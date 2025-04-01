from flask import Flask, render_template, Response, request, jsonify, session, redirect, url_for
import cv2
import threading
import time
import sys
import traceback
import logging
from flask_cors import CORS

# Set up logging
logging.basicConfig(level=logging.DEBUG, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                   handlers=[logging.StreamHandler()])
logger = logging.getLogger(__name__)

# Import attempt with error handling
try:
    from pose_estimation.estimation import PoseEstimator
    from exercises.squat import Squat
    from exercises.hammer_curl import HammerCurl
    from exercises.push_up import PushUp
    from feedback.information import get_exercise_info
    from feedback.layout import layout_indicators
    from utils.draw_text_with_background import draw_text_with_background
    logger.info("Successfully imported pose estimation modules")
except ImportError as e:
    logger.error(f"Failed to import required modules: {e}")
    traceback.print_exc()
    sys.exit(1)

# Try to import WorkoutLogger with fallback
try:
    from db.workout_logger import WorkoutLogger
    workout_logger = WorkoutLogger()
    logger.info("Successfully initialized workout logger")
except ImportError:
    logger.warning("WorkoutLogger import failed, creating dummy class")
    
    class DummyWorkoutLogger:
        def __init__(self):
            pass
        def log_workout(self, *args, **kwargs):
            return {}
        def get_recent_workouts(self, *args, **kwargs):
            return []
        def get_weekly_stats(self, *args, **kwargs):
            return {}
        def get_exercise_distribution(self, *args, **kwargs):
            return {}
        def get_user_stats(self, *args, **kwargs):
            return {'total_workouts': 0, 'total_exercises': 0, 'streak_days': 0}
    
    workout_logger = DummyWorkoutLogger()

logger.info("Setting up Flask application")
app = Flask(__name__)
app.secret_key = 'fitness_trainer_secret_key'  # Required for sessions
CORS(app)
# Global variables
camera = None
output_frame = None
lock = threading.Lock()
exercise_running = False
current_exercise = None
current_exercise_data = None
exercise_counter = 0
exercise_goal = 0
sets_completed = 0
sets_goal = 0
workout_start_time = None

def initialize_camera():
    global camera
    if camera is None:
        camera = cv2.VideoCapture(0)
    return camera

def release_camera():
    global camera
    if camera is not None:
        camera.release()
        camera = None

def generate_frames():
    global output_frame, lock, exercise_running, current_exercise, current_exercise_data
    global exercise_counter, exercise_goal, sets_completed, sets_goal
    
    pose_estimator = PoseEstimator()
    
    while True:
        if camera is None:
            continue
            
        success, frame = camera.read()
        if not success:
            continue
        
        # Only process frames if an exercise is running
        if exercise_running and current_exercise:
            # Process with pose estimation
            results = pose_estimator.estimate_pose(frame, current_exercise_data['type'])
            
            if results.pose_landmarks:
                # Track exercise based on type
                if current_exercise_data['type'] == "squat":
                    counter, angle, stage = current_exercise.track_squat(results.pose_landmarks.landmark, frame)
                    layout_indicators(frame, current_exercise_data['type'], (counter, angle, stage))
                    exercise_counter = counter
                    
                elif current_exercise_data['type'] == "push_up":
                    counter, angle, stage = current_exercise.track_push_up(results.pose_landmarks.landmark, frame)
                    layout_indicators(frame, current_exercise_data['type'], (counter, angle, stage))
                    exercise_counter = counter
                    
                elif current_exercise_data['type'] == "hammer_curl":
                    (counter_right, angle_right, counter_left, angle_left,
                     warning_message_right, warning_message_left, progress_right, 
                     progress_left, stage_right, stage_left) = current_exercise.track_hammer_curl(
                        results.pose_landmarks.landmark, frame)
                    layout_indicators(frame, current_exercise_data['type'], 
                                     (counter_right, angle_right, counter_left, angle_left,
                                      warning_message_right, warning_message_left, 
                                      progress_right, progress_left, stage_right, stage_left))
                    exercise_counter = max(counter_right, counter_left)
                
                # Display exercise information
                exercise_info = get_exercise_info(current_exercise_data['type'])
                draw_text_with_background(frame, f"Exercise: {exercise_info.get('name', 'N/A')}", (40, 50),
                                         cv2.FONT_HERSHEY_DUPLEX, 0.7, (255, 255, 255), (118, 29, 14), 1)
                draw_text_with_background(frame, f"Reps Goal: {exercise_goal}", (40, 80),
                                         cv2.FONT_HERSHEY_DUPLEX, 0.7, (255, 255, 255), (118, 29, 14), 1)
                draw_text_with_background(frame, f"Sets Goal: {sets_goal}", (40, 110),
                                         cv2.FONT_HERSHEY_DUPLEX, 0.7, (255, 255, 255), (118, 29, 14), 1)
                draw_text_with_background(frame, f"Current Set: {sets_completed + 1}", (40, 140),
                                         cv2.FONT_HERSHEY_DUPLEX, 0.7, (255, 255, 255), (118, 29, 14), 1)
                
                # Check if rep goal is reached for current set
                if exercise_counter >= exercise_goal:
                    sets_completed += 1
                    exercise_counter = 0
                    # Reset exercise counter in the appropriate exercise object
                    if current_exercise_data['type'] == "squat" or current_exercise_data['type'] == "push_up":
                        current_exercise.counter = 0
                    elif current_exercise_data['type'] == "hammer_curl":
                        current_exercise.counter_right = 0
                        current_exercise.counter_left = 0
                    
                    # Check if all sets are completed
                    if sets_completed >= sets_goal:
                        exercise_running = False
                        draw_text_with_background(frame, "WORKOUT COMPLETE!", (frame.shape[1]//2 - 150, frame.shape[0]//2),
                                                cv2.FONT_HERSHEY_DUPLEX, 1.2, (255, 255, 255), (0, 200, 0), 2)
                    else:
                        draw_text_with_background(frame, f"SET {sets_completed} COMPLETE! Rest for 30 sec", 
                                                (frame.shape[1]//2 - 200, frame.shape[0]//2),
                                                cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 255, 255), (0, 0, 200), 2)
                        # We could add rest timer functionality here
        else:
            # Display welcome message if no exercise is running
            cv2.putText(frame, "Select an exercise to begin", (frame.shape[1]//2 - 150, frame.shape[0]//2),
                       cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 255, 255), 1)
                
        # Encode the frame in JPEG format
        with lock:
            output_frame = frame.copy()
            
        # Yield the frame in byte format
        ret, buffer = cv2.imencode('.jpg', output_frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    """Home page with exercise selection"""
    logger.info("Rendering index page")
    try:
        return render_template('index.html')
    except Exception as e:
        logger.error(f"Error rendering index: {e}")
        return f"Error rendering template: {str(e)}", 500

@app.route('/dashboard')
def dashboard():
    """Dashboard page with workout statistics"""
    logger.info("Rendering dashboard page")
    try:
        # Get data for the dashboard
        recent_workouts = workout_logger.get_recent_workouts(5)
        weekly_stats = workout_logger.get_weekly_stats()
        exercise_distribution = workout_logger.get_exercise_distribution()
        user_stats = workout_logger.get_user_stats()
        
        # Format workouts for display
        formatted_workouts = []
        for workout in recent_workouts:
            formatted_workouts.append({
                'date': workout['date'],
                'exercise': workout['exercise_type'].replace('_', ' ').title(),
                'sets': workout['sets'],
                'reps': workout['reps'],
                'duration': f"{workout['duration_seconds'] // 60}:{workout['duration_seconds'] % 60:02d}"
            })
        
        # Calculate total workouts this week
        weekly_workout_count = sum(day['workout_count'] for day in weekly_stats.values())
        
        return render_template('dashboard.html',
                              recent_workouts=formatted_workouts,
                              weekly_workouts=weekly_workout_count,
                              total_workouts=user_stats['total_workouts'],
                              total_exercises=user_stats['total_exercises'],
                              streak_days=user_stats['streak_days'])
    except Exception as e:
        logger.error(f"Error in dashboard: {e}")
        traceback.print_exc()
        return f"Error loading dashboard: {str(e)}", 500

@app.route('/video_feed')
def video_feed():
    """Video streaming route"""
    return Response(generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start_exercise', methods=['POST'])
def start_exercise():
    """Start a new exercise based on user selection"""
    global exercise_running, current_exercise, current_exercise_data
    global exercise_counter, exercise_goal, sets_completed, sets_goal
    global workout_start_time
    
    data = request.json
    exercise_type = data.get('exercise_type')
    sets_goal = int(data.get('sets', 3))
    exercise_goal = int(data.get('reps', 10))
    
    # Initialize camera if not already done
    initialize_camera()
    
    # Reset counters
    exercise_counter = 0
    sets_completed = 0
    workout_start_time = time.time()
    
    # Initialize the appropriate exercise class
    if exercise_type == "squat":
        current_exercise = Squat()
    elif exercise_type == "push_up":
        current_exercise = PushUp()
    elif exercise_type == "hammer_curl":
        current_exercise = HammerCurl()
    else:
        return jsonify({'success': False, 'error': 'Invalid exercise type'})
    
    # Store exercise data
    current_exercise_data = {
        'type': exercise_type,
        'sets': sets_goal,
        'reps': exercise_goal
    }
    
    # Start the exercise
    exercise_running = True
    
    return jsonify({'success': True})

@app.route('/stop_exercise', methods=['POST'])
def stop_exercise():
    """Stop the current exercise and log the workout"""
    global exercise_running, current_exercise_data, workout_start_time
    global exercise_counter, exercise_goal, sets_completed, sets_goal
    
    if exercise_running and current_exercise_data:
        # Calculate duration
        duration = int(time.time() - workout_start_time) if workout_start_time else 0
        
        # Log the workout
        workout_logger.log_workout(
            exercise_type=current_exercise_data['type'],
            sets=sets_completed + (1 if exercise_counter > 0 else 0),  # Include partial set
            reps=exercise_goal,
            duration_seconds=duration
        )
    release_camera()
    exercise_running = False
    return jsonify({'success': True})

@app.route('/get_status', methods=['GET'])
def get_status():
    """Return current exercise status"""
    global exercise_counter, sets_completed, exercise_goal, sets_goal, exercise_running
    
    return jsonify({
        'exercise_running': exercise_running,
        'current_reps': exercise_counter,
        'current_set': sets_completed + 1 if exercise_running else 0,
        'total_sets': sets_goal,
        'rep_goal': exercise_goal
    })

@app.route('/profile')
def profile():
    """User profile page - placeholder for future development"""
    return "Profile page - Coming soon!"

if __name__ == '__main__':
    try:
        logger.info("Starting the Flask application on http://127.0.0.1:5000")
        print("Starting Fitness Trainer app, please wait...")
        print("Open http://127.0.0.1:5000 in your web browser when the server starts")
        app.run(debug=True)
    except Exception as e:
        logger.error(f"Failed to start application: {e}")
        traceback.print_exc()
