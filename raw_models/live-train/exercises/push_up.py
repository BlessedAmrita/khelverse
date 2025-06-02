import mediapipe as mp
import time
from pose_estimation.angle_calculation import calculate_angle

class PushUp:
    def __init__(self):
        self.counter = 0
        self.stage = "up"  # Changed from "Initial"
        self.angle_threshold_up = 150
        self.angle_threshold_down = 70
        self.last_counter_update = time.time()
        self.mp_pose = mp.solutions.pose # Added

    def calculate_shoulder_elbow_wrist_angle(self, shoulder, elbow, wrist):
        """Calculate the angle between shoulder, elbow, and wrist."""
        return calculate_angle(shoulder, elbow, wrist)

    def track_push_up(self, landmarks_mp, frame_width, frame_height):
        lm = landmarks_mp # shortcut

        # Left side landmarks
        shoulder_left = [int(lm[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].x * frame_width),
                         int(lm[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].y * frame_height)]
        elbow_left = [int(lm[self.mp_pose.PoseLandmark.LEFT_ELBOW.value].x * frame_width),
                      int(lm[self.mp_pose.PoseLandmark.LEFT_ELBOW.value].y * frame_height)]
        wrist_left = [int(lm[self.mp_pose.PoseLandmark.LEFT_WRIST.value].x * frame_width),
                      int(lm[self.mp_pose.PoseLandmark.LEFT_WRIST.value].y * frame_height)]

        # Right side landmarks
        shoulder_right = [int(lm[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x * frame_width),
                          int(lm[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y * frame_height)]
        elbow_right = [int(lm[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value].x * frame_width),
                       int(lm[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value].y * frame_height)]
        wrist_right = [int(lm[self.mp_pose.PoseLandmark.RIGHT_WRIST.value].x * frame_width),
                       int(lm[self.mp_pose.PoseLandmark.RIGHT_WRIST.value].y * frame_height)]

        # Calculate angles
        angle_left = self.calculate_shoulder_elbow_wrist_angle(shoulder_left, elbow_left, wrist_left)
        angle_right = self.calculate_shoulder_elbow_wrist_angle(shoulder_right, elbow_right, wrist_right)

        # Stage and Counter Logic
        current_angle_for_logic = angle_left
        current_time = time.time()

        if current_angle_for_logic > self.angle_threshold_up:
            self.stage = "up"
        elif self.angle_threshold_down < current_angle_for_logic < self.angle_threshold_up and self.stage == "up":
            self.stage = "down"
        elif current_angle_for_logic < self.angle_threshold_down and self.stage == "down":
            if current_time - self.last_counter_update > 1:  # 1 second debounce
                self.counter += 1
                self.last_counter_update = current_time
            self.stage = "up" # Transition back to up

        feedback = self._get_push_up_feedback(angle_left, angle_right, self.stage)

        return {
            "counter": self.counter,
            "stage": self.stage,
            "angle_left": angle_left,
            "angle_right": angle_right,
            "feedback": feedback
        }

    def _get_push_up_feedback(self, angle_left, angle_right, stage):
        feedback = "Keep going!" # Default

        if stage == "down":
            if min(angle_left, angle_right) < self.angle_threshold_down - 5:
                feedback = "Good depth!"
            elif min(angle_left, angle_right) > self.angle_threshold_down + 10:
                feedback = "Go lower."
        elif stage == "up":
             feedback = "Push up!" # Or "Ready"

        if abs(angle_left - angle_right) > 25:
            feedback += " Try to keep your push-up even." if feedback != "Keep going!" else "Try to keep your push-up even."

        return feedback.strip()

    def get_drawing_annotations(self, landmarks_mp, frame_width, frame_height, exercise_data_dict):
        annotations = []
        lm = landmarks_mp # shortcut

        # Pixel coordinates
        shoulder_left = [int(lm[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].x * frame_width),
                         int(lm[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].y * frame_height)]
        elbow_left = [int(lm[self.mp_pose.PoseLandmark.LEFT_ELBOW.value].x * frame_width),
                      int(lm[self.mp_pose.PoseLandmark.LEFT_ELBOW.value].y * frame_height)]
        wrist_left = [int(lm[self.mp_pose.PoseLandmark.LEFT_WRIST.value].x * frame_width),
                      int(lm[self.mp_pose.PoseLandmark.LEFT_WRIST.value].y * frame_height)]

        shoulder_right = [int(lm[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x * frame_width),
                          int(lm[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y * frame_height)]
        elbow_right = [int(lm[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value].x * frame_width),
                       int(lm[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value].y * frame_height)]
        wrist_right = [int(lm[self.mp_pose.PoseLandmark.RIGHT_WRIST.value].x * frame_width),
                       int(lm[self.mp_pose.PoseLandmark.RIGHT_WRIST.value].y * frame_height)]

        # Lines (original colors: left (0,0,255) -> BGR [255,0,0], right (102,0,0) -> BGR [0,0,102])
        annotations.append({"type": "line", "start_point": shoulder_left, "end_point": elbow_left, "color_bgr": [255, 0, 0], "thickness": 2})
        annotations.append({"type": "line", "start_point": elbow_left, "end_point": wrist_left, "color_bgr": [255, 0, 0], "thickness": 2})
        annotations.append({"type": "line", "start_point": shoulder_right, "end_point": elbow_right, "color_bgr": [0, 0, 102], "thickness": 2})
        annotations.append({"type": "line", "start_point": elbow_right, "end_point": wrist_right, "color_bgr": [0, 0, 102], "thickness": 2})

        # Circles
        annotations.append({"type": "circle", "center_point": shoulder_left, "radius": 8, "color_bgr": [255, 0, 0], "filled": True})
        annotations.append({"type": "circle", "center_point": elbow_left, "radius": 8, "color_bgr": [255, 0, 0], "filled": True})
        annotations.append({"type": "circle", "center_point": wrist_left, "radius": 8, "color_bgr": [255, 0, 0], "filled": True})
        annotations.append({"type": "circle", "center_point": shoulder_right, "radius": 8, "color_bgr": [0, 0, 102], "filled": True})
        annotations.append({"type": "circle", "center_point": elbow_right, "radius": 8, "color_bgr": [0, 0, 102], "filled": True})
        annotations.append({"type": "circle", "center_point": wrist_right, "radius": 8, "color_bgr": [0, 0, 102], "filled": True})

        # Text for angles
        if 'angle_left' in exercise_data_dict:
            annotations.append({"type": "text", "text_content": f"Angle L: {int(exercise_data_dict['angle_left'])}",
                                "position": [elbow_left[0] + 10, elbow_left[1] - 10],
                                "font_scale": 0.5, "color_bgr": [255, 255, 255], "thickness": 2})
        if 'angle_right' in exercise_data_dict:
            annotations.append({"type": "text", "text_content": f"Angle R: {int(exercise_data_dict['angle_right'])}",
                                "position": [elbow_right[0] + 10, elbow_right[1] - 10],
                                "font_scale": 0.5, "color_bgr": [255, 255, 255], "thickness": 2})

        # Display main feedback from exercise_data_dict
        if 'feedback' in exercise_data_dict:
             annotations.append({"type": "text", "text_content": exercise_data_dict['feedback'],
                                "position": [frame_width // 2 - 150, frame_height - 40], # Adjusted for longer text
                                "font_scale": 0.7, "color_bgr": [0, 255, 0], "thickness": 2}) # Green for feedback

        return annotations
    
    # Inside the PushUp class in push_up.py
    def reset_reps(self):
        self.counter = 0
        self.stage = "up"  # Reset to the initial stage
        self.last_counter_update = time.time() # Important to reset debounce timer
        print("PushUp reps and stage reset for new set.")