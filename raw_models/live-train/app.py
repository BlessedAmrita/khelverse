import gradio as gr
import cv2
import numpy as np
import mediapipe as mp
import time
import traceback # For detailed error logging

# Import your exercise classes
from exercises.hammer_curl import HammerCurl
from exercises.push_up import PushUp
from exercises.squat import Squat

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# --- State Variables ---
exercise_trackers = {
    "Hammer Curl": HammerCurl(),
    "Push Up": PushUp(),
    "Squat": Squat()
}
current_exercise_tracker = None
selected_exercise_name = "Hammer Curl"  # Default exercise

# Target and progress tracking
target_reps = 10  # Default target reps
target_sets = 3   # Default target sets
current_set_count = 1
workout_complete_message = ""


def process_frame(video_frame_np, exercise_name_choice, target_reps_input, target_sets_input):
    global current_exercise_tracker, selected_exercise_name
    global target_reps, target_sets, current_set_count, workout_complete_message

    default_h, default_w = 480, 640
    if video_frame_np is not None:
        default_h, default_w, _ = video_frame_np.shape
        annotated_image = video_frame_np.copy()
    else:
        blank_frame = np.zeros((default_h, default_w, 3), dtype=np.uint8)
        cv2.putText(blank_frame, "No Camera Input", (50, default_h // 2), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)
        return blank_frame, f"0/{target_reps}", f"{current_set_count}/{target_sets}", "No frame", "No camera", "Error: No Frame"

    try:
        new_target_reps_val = target_reps
        try:
            new_target_reps_val = int(target_reps_input)
            if new_target_reps_val > 0 and target_reps != new_target_reps_val:
                target_reps = new_target_reps_val
                if current_exercise_tracker: current_exercise_tracker.reset_reps()
                current_set_count = 1
                workout_complete_message = ""
        except ValueError: pass

        new_target_sets_val = target_sets
        try:
            new_target_sets_val = int(target_sets_input)
            if new_target_sets_val > 0 and target_sets != new_target_sets_val:
                target_sets = new_target_sets_val
                if current_exercise_tracker: current_exercise_tracker.reset_reps()
                current_set_count = 1
                workout_complete_message = ""
        except ValueError: pass

        if selected_exercise_name != exercise_name_choice:
            selected_exercise_name = exercise_name_choice
            if selected_exercise_name in exercise_trackers:
                if selected_exercise_name == "Hammer Curl": exercise_trackers[selected_exercise_name] = HammerCurl()
                elif selected_exercise_name == "Push Up": exercise_trackers[selected_exercise_name] = PushUp()
                elif selected_exercise_name == "Squat": exercise_trackers[selected_exercise_name] = Squat()
                current_set_count = 1
                workout_complete_message = ""
            else: current_exercise_tracker = None
        current_exercise_tracker = exercise_trackers.get(selected_exercise_name)

        image_rgb = cv2.cvtColor(video_frame_np, cv2.COLOR_BGR2RGB)
        image_rgb.flags.writeable = False
        results = pose.process(image_rgb)
        image_rgb.flags.writeable = True
        
        reps_display = f"0/{target_reps}"
        sets_display = f"{current_set_count}/{target_sets}"
        angle_display = "N/A"
        feedback_display = "Initializing..."
        temp_workout_message = workout_complete_message

        if results.pose_landmarks and current_exercise_tracker and not workout_complete_message:
            landmarks_mp = results.pose_landmarks.landmark
            frame_height, frame_width, _ = annotated_image.shape
            actual_reps_this_set = 0

            try:
                if selected_exercise_name == "Hammer Curl":
                    r_count, r_angle, l_count, l_angle, warn_r, warn_l, _, _, r_stage, l_stage = current_exercise_tracker.track_hammer_curl(landmarks_mp, annotated_image)
                    actual_reps_this_set = r_count
                    reps_display = f"R: {r_count}, L: {l_count} (Target: {target_reps} for R)"
                    angle_display = f"R Ang: {int(r_angle)}, L Ang: {int(l_angle)}"
                    feedback_list = []
                    if warn_r: feedback_list.append(f"R: {warn_r}")
                    if warn_l: feedback_list.append(f"L: {warn_l}")
                    feedback_display = " | ".join(feedback_list) if feedback_list else "Good form!"

                elif selected_exercise_name == "Push Up":
                    exercise_data = current_exercise_tracker.track_push_up(landmarks_mp, frame_width, frame_height)
                    actual_reps_this_set = exercise_data.get("counter", 0)
                    angle_display = f"L: {int(exercise_data.get('angle_left',0))}, R: {int(exercise_data.get('angle_right',0))}"
                    feedback_display = str(exercise_data.get("feedback", "No feedback"))
                    if 'get_drawing_annotations' in dir(current_exercise_tracker):
                        annotations_to_draw = current_exercise_tracker.get_drawing_annotations(landmarks_mp, frame_width, frame_height, exercise_data)
                        for ann in annotations_to_draw:
                            if ann["type"] == "line": cv2.line(annotated_image, tuple(ann["start_point"]), tuple(ann["end_point"]), ann["color_bgr"], ann["thickness"])
                            elif ann["type"] == "circle": cv2.circle(annotated_image, tuple(ann["center_point"]), ann["radius"], ann["color_bgr"], -1 if ann.get("filled", False) else ann["thickness"])
                            elif ann["type"] == "text": cv2.putText(annotated_image, ann["text_content"], tuple(ann["position"]), cv2.FONT_HERSHEY_SIMPLEX, ann["font_scale"], ann["color_bgr"], ann["thickness"])

                elif selected_exercise_name == "Squat":
                    exercise_data = current_exercise_tracker.track_squat(landmarks_mp, frame_width, frame_height)
                    actual_reps_this_set = exercise_data.get("counter", 0)
                    angle_display = f"L: {int(exercise_data.get('angle_left',0))}, R: {int(exercise_data.get('angle_right',0))}"
                    feedback_display = str(exercise_data.get("feedback", "No feedback"))
                    if 'get_drawing_annotations' in dir(current_exercise_tracker):
                        annotations_to_draw = current_exercise_tracker.get_drawing_annotations(landmarks_mp, frame_width, frame_height, exercise_data)
                        for ann in annotations_to_draw:
                            if ann["type"] == "line": cv2.line(annotated_image, tuple(ann["start_point"]), tuple(ann["end_point"]), ann["color_bgr"], ann["thickness"])
                            elif ann["type"] == "circle": cv2.circle(annotated_image, tuple(ann["center_point"]), ann["radius"], ann["color_bgr"], -1 if ann.get("filled", False) else ann["thickness"])
                            elif ann["type"] == "text": cv2.putText(annotated_image, ann["text_content"], tuple(ann["position"]), cv2.FONT_HERSHEY_SIMPLEX, ann["font_scale"], ann["color_bgr"], ann["thickness"])
                
                if selected_exercise_name != "Hammer Curl":
                     reps_display = f"{actual_reps_this_set}/{target_reps}"

                if actual_reps_this_set >= target_reps:
                    if current_set_count < target_sets:
                        current_set_count += 1
                        current_exercise_tracker.reset_reps()
                        feedback_display = f"Set {current_set_count-1} complete! Starting set {current_set_count}."
                        if selected_exercise_name == "Hammer Curl": reps_display = f"R: 0, L: 0 (Target: {target_reps} for R)"
                        else: reps_display = f"0/{target_reps}"
                    elif current_set_count >= target_sets:
                        feedback_display = "Workout Complete!"
                        workout_complete_message = "Workout Complete! Change targets or exercise to restart."
                        if selected_exercise_name == "Hammer Curl": reps_display = f"R: {target_reps}, L: {target_reps} (Target: {target_reps} for R)"
                        else: reps_display = f"{target_reps}/{target_reps}"
                    temp_workout_message = workout_complete_message

            except Exception as e_exercise:
                print(f"PROCESS_FRAME: Error during exercise '{selected_exercise_name}' logic: {e_exercise}")
                print(traceback.format_exc())
                cv2.putText(annotated_image, f"Error in {selected_exercise_name}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                feedback_display = f"Error in {selected_exercise_name} processing."
        
        elif workout_complete_message:
            feedback_display = workout_complete_message
            reps_display = f"{target_reps}/{target_reps}" if selected_exercise_name != "Hammer Curl" else f"R: {target_reps}, L: {target_reps} (Target: {target_reps} for R)"
            sets_display = f"{target_sets}/{target_sets}"
            if results.pose_landmarks:
                mp_drawing.draw_landmarks(annotated_image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS, landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())

        else:
            feedback_display = "No person detected or exercise not selected properly."
            if results and results.pose_landmarks :
                mp_drawing.draw_landmarks(annotated_image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS, landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())
            else:
                cv2.putText(annotated_image, "No person detected", (50, default_h // 2), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255),2)
        
        sets_display = f"{current_set_count}/{target_sets}"

        if not isinstance(annotated_image, np.ndarray) or annotated_image.ndim != 3 or annotated_image.shape[2] != 3:
            annotated_image = np.zeros((default_h, default_w, 3), dtype=np.uint8)
            cv2.putText(annotated_image, "Display Error", (50, default_h // 2), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255),2)

        return annotated_image, reps_display, sets_display, angle_display, feedback_display, temp_workout_message

    except Exception as e_main:
        print(f"PROCESS_FRAME: CRITICAL error in process_frame: {e_main}")
        print(traceback.format_exc())
        error_frame = np.zeros((default_h, default_w, 3), dtype=np.uint8)
        cv2.putText(error_frame, f"Error: {e_main}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        return error_frame, "Error", "Error", "Error", "Critical Error", "Critical Error"

def trigger_reset_workout():
    global current_set_count, workout_complete_message, selected_exercise_name, target_reps, target_sets, current_exercise_tracker
    
    current_set_count = 1
    workout_complete_message = ""
    
    if current_exercise_tracker:
        current_exercise_tracker.reset_reps()
    
    reset_reps_display = f"0/{target_reps}"
    if selected_exercise_name == "Hammer Curl":
        reset_reps_display = f"R: 0, L: 0 (Target: {target_reps} for R)"
    
    reset_sets_display = f"1/{target_sets}"
    reset_angle_display = "N/A"
    reset_feedback_display = "Workout Reset. Ready to start."
    reset_workout_status = ""

    return reset_reps_display, reset_sets_display, reset_angle_display, reset_feedback_display, reset_workout_status

# --- Custom CSS for gradient background and styling ---
# Note: Applying gradient to the root/body might be overridden by Gradio's specific block styling.
# It's often better to target .gradio-container or specific blocks if possible.
# However, for broad effect, body is a start. More specific selectors might be needed for full coverage.
# --- Custom CSS for gradient background and styling ---
custom_css = """
body {
    background: linear-gradient(to bottom right, #301934, #8A2BE0) !important; /* Dark Violet to a brighter Violet */
}
.gradio-container {
    background: linear-gradient(to bottom right, #301934, #8A2BE0) !important; /* Ensure container also gets it */
}
label, .gr-checkbox-label span { /* Target labels and checkbox labels */
    color: #E8E8E8 !important; /* Slightly brighter light gray for labels */
    font-weight: bold !important;
}
h1 {
    color: #FFFFFF !important;
    text-align: center !important;
}
.prose { /* Markdown text */
    color: #F0F0F0 !important;
}
/* General text within blocks that isn't a label or title */
.gr-block .gr-box > div > p, .gr-block .gr-box > div > span {
    color: #E0E0E0 !important;
}
/* You might need to adjust button font styling with more specific selectors if this doesn't work */
button.gr-button-primary {
    font-family: 'Exo 2', sans-serif !important;
    /* The theme's primary_hue should handle button background and text color for contrast */
}
"""

# --- Gradio Theme ---
# Using a base theme to set font and then overriding some colors.
# For button color, if primary_hue doesn't give desired button color, specific CSS might be needed.
theme = gr.themes.Base(
    font=[gr.themes.GoogleFont("Exo 2"), "ui-sans-serif", "system-ui", "sans-serif"],
    primary_hue=gr.themes.colors.amber, # For buttons - gives a yellowish/golden hue
    secondary_hue=gr.themes.colors.blue,
    neutral_hue=gr.themes.colors.gray
).set(
    body_text_color="#E0E0E0", # Light gray for general text (this should also affect input text)
    input_background_fill="#4A2A6C", # Darker violet for input backgrounds
    input_border_color="#6A3AA2",
    # button_primary_text_color="#111111", # Often better to let theme handle this or use CSS
    # Ensure other text elements have good contrast automatically or via custom_css
)


# --- Gradio Interface ---
exercise_choices = ["Hammer Curl", "Push Up", "Squat"]

# Pass the theme and custom_css to gr.Blocks
with gr.Blocks(theme=theme, css=custom_css) as iface:
    gr.Markdown("# Live AI Trainer") # This will be styled by H1 in CSS
    gr.Markdown("Select an exercise, set your targets, and get real-time feedback on your form and reps.") # Styled by .prose

    with gr.Row():
        with gr.Column(scale=2):
            webcam_input = gr.Image(sources=["webcam"], streaming=True, type="numpy", label="Your Webcam")
        with gr.Column(scale=1):
            gr.Markdown("### Controls") # Markdown default color should be handled by theme or prose
            exercise_dropdown = gr.Dropdown(choices=exercise_choices, label="Select Exercise", value="Hammer Curl")
            target_reps_number = gr.Number(value=target_reps, label="Target Reps per Set", precision=0, minimum=1)
            target_sets_number = gr.Number(value=target_sets, label="Target Sets", precision=0, minimum=1)
            
            reset_button = gr.Button("Reset Workout") # Will use primary_hue from theme
            
            gr.Markdown("### Progress")
            reps_output = gr.Textbox(label="Reps Progress")
            sets_output = gr.Textbox(label="Sets Progress")
            angle_output = gr.Textbox(label="Angle Details")
            feedback_output = gr.Textbox(label="Feedback", lines=3, max_lines=5)
            workout_status_output = gr.Textbox(label="Workout Status", lines=2, interactive=False)

    process_frame_inputs = [webcam_input, exercise_dropdown, target_reps_number, target_sets_number]
    process_frame_outputs = [webcam_input, reps_output, sets_output, angle_output, feedback_output, workout_status_output]

    webcam_input.stream(fn=process_frame, inputs=process_frame_inputs, outputs=process_frame_outputs)
    exercise_dropdown.change(fn=process_frame, inputs=process_frame_inputs, outputs=process_frame_outputs)
    target_reps_number.change(fn=process_frame, inputs=process_frame_inputs, outputs=process_frame_outputs)
    target_sets_number.change(fn=process_frame, inputs=process_frame_inputs, outputs=process_frame_outputs)

    reset_button_outputs = [reps_output, sets_output, angle_output, feedback_output, workout_status_output]
    reset_button.click(fn=trigger_reset_workout, inputs=None, outputs=reset_button_outputs)

if __name__ == "__main__":
    iface.launch(debug=False, share=False) # share=False is default but good to be explicit for Spaces