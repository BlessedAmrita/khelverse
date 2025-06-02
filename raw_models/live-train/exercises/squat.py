import mediapipe as mp
from pose_estimation.angle_calculation import calculate_angle

class Squat:
    def __init__(self):
        self.counter = 0
        self.stage = "up"  # Initial stage
        self.mp_pose = mp.solutions.pose # Added for convenience

    def calculate_angle(self, point1, point2, point3): # Assuming these are pixel coordinates
        return calculate_angle(point1, point2, point3)

    def track_squat(self, landmarks_mp, frame_width, frame_height):
        lm = landmarks_mp # shortcut

        # Left side landmarks
        shoulder_left = [int(lm[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].x * frame_width),
                         int(lm[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].y * frame_height)]
        hip_left = [int(lm[self.mp_pose.PoseLandmark.LEFT_HIP.value].x * frame_width),
                    int(lm[self.mp_pose.PoseLandmark.LEFT_HIP.value].y * frame_height)]
        knee_left = [int(lm[self.mp_pose.PoseLandmark.LEFT_KNEE.value].x * frame_width),
                     int(lm[self.mp_pose.PoseLandmark.LEFT_KNEE.value].y * frame_height)]
        # ankle_left = [int(lm[self.mp_pose.PoseLandmark.LEFT_ANKLE.value].x * frame_width),
        #               int(lm[self.mp_pose.PoseLandmark.LEFT_ANKLE.value].y * frame_height)]


        # Right side landmarks
        shoulder_right = [int(lm[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x * frame_width),
                          int(lm[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y * frame_height)]
        hip_right = [int(lm[self.mp_pose.PoseLandmark.RIGHT_HIP.value].x * frame_width),
                     int(lm[self.mp_pose.PoseLandmark.RIGHT_HIP.value].y * frame_height)]
        knee_right = [int(lm[self.mp_pose.PoseLandmark.RIGHT_KNEE.value].x * frame_width),
                      int(lm[self.mp_pose.PoseLandmark.RIGHT_KNEE.value].y * frame_height)]
        # ankle_right = [int(lm[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value].x * frame_width),
        #                int(lm[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value].y * frame_height)]

        # Calculate angles
        angle_left = self.calculate_angle(shoulder_left, hip_left, knee_left)
        angle_right = self.calculate_angle(shoulder_right, hip_right, knee_right)

        # Stage and counter logic (using angle_left for primary logic)
        current_angle_for_logic = angle_left
        if current_angle_for_logic > 170:
            self.stage = "up"
        elif 90 < current_angle_for_logic < 170 and self.stage == "up":
            self.stage = "down"
        elif current_angle_for_logic < 90 and self.stage == "down":
            self.stage = "up"
            self.counter += 1

        feedback_message = self._get_squat_feedback(angle_left, angle_right, self.stage,
                                                    knee_left, hip_left, shoulder_left,
                                                    knee_right, hip_right, shoulder_right)

        return {
            "counter": self.counter,
            "stage": self.stage,
            "angle_left": angle_left,
            "angle_right": angle_right,
            "feedback": feedback_message
        }

    def _get_squat_feedback(self, angle_left, angle_right, stage,
                            knee_left, hip_left, shoulder_left,
                            knee_right, hip_right, shoulder_right): # Added points for future use
        feedback = "Keep going." # Default feedback

        if stage == "down":
            if min(angle_left, angle_right) < 80:
                feedback = "Good depth!"
            elif min(angle_left, angle_right) > 100: # Knees should be more bent
                feedback = "Go lower."

        if abs(angle_left - angle_right) > 20: # Check for uneven squat
             # Adding a check to see if there's significant movement, e.g., not in "up" stage fully extended
            if not (stage == "up" and min(angle_left, angle_right) > 160): # Avoid this message if standing straight
                feedback += " Try to keep your squat even." if feedback != "Keep going." else "Try to keep your squat even."


        # Placeholder for more advanced feedback using the passed points:
        # E.g., Knee valgus: check if knee_left.x < hip_left.x and knee_left.x > shoulder_left.x (simplified)
        # E.g., Back posture: calculate angle shoulder-hip-ankle (requires ankle points)

        return feedback.strip()


    def get_drawing_annotations(self, landmarks_mp, frame_width, frame_height, exercise_data_dict):
        annotations = []
        lm = landmarks_mp # shortcut

        # Re-calculate or retrieve necessary points (pixel coordinates)
        # For simplicity, re-calculating here. Could be optimized by passing from track_squat.
        shoulder_left = [int(lm[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].x * frame_width),
                         int(lm[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].y * frame_height)]
        hip_left = [int(lm[self.mp_pose.PoseLandmark.LEFT_HIP.value].x * frame_width),
                    int(lm[self.mp_pose.PoseLandmark.LEFT_HIP.value].y * frame_height)]
        knee_left = [int(lm[self.mp_pose.PoseLandmark.LEFT_KNEE.value].x * frame_width),
                     int(lm[self.mp_pose.PoseLandmark.LEFT_KNEE.value].y * frame_height)]

        shoulder_right = [int(lm[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x * frame_width),
                          int(lm[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y * frame_height)]
        hip_right = [int(lm[self.mp_pose.PoseLandmark.RIGHT_HIP.value].x * frame_width),
                     int(lm[self.mp_pose.PoseLandmark.RIGHT_HIP.value].y * frame_height)]
        knee_right = [int(lm[self.mp_pose.PoseLandmark.RIGHT_KNEE.value].x * frame_width),
                      int(lm[self.mp_pose.PoseLandmark.RIGHT_KNEE.value].y * frame_height)]

        # Lines for left side (original color: (178, 102, 255) -> BGR: [255, 102, 178])
        annotations.append({"type": "line", "start_point": shoulder_left, "end_point": hip_left, "color_bgr": [255, 102, 178], "thickness": 2})
        annotations.append({"type": "line", "start_point": hip_left, "end_point": knee_left, "color_bgr": [255, 102, 178], "thickness": 2})

        # Lines for right side (original color: (51, 153, 255) -> BGR: [255, 153, 51])
        annotations.append({"type": "line", "start_point": shoulder_right, "end_point": hip_right, "color_bgr": [255, 153, 51], "thickness": 2})
        annotations.append({"type": "line", "start_point": hip_right, "end_point": knee_right, "color_bgr": [255, 153, 51], "thickness": 2})

        # Circles for left side
        annotations.append({"type": "circle", "center_point": shoulder_left, "radius": 8, "color_bgr": [255, 102, 178], "filled": True})
        annotations.append({"type": "circle", "center_point": hip_left, "radius": 8, "color_bgr": [255, 102, 178], "filled": True})
        annotations.append({"type": "circle", "center_point": knee_left, "radius": 8, "color_bgr": [255, 102, 178], "filled": True})

        # Circles for right side
        annotations.append({"type": "circle", "center_point": shoulder_right, "radius": 8, "color_bgr": [255, 153, 51], "filled": True})
        annotations.append({"type": "circle", "center_point": hip_right, "radius": 8, "color_bgr": [255, 153, 51], "filled": True})
        annotations.append({"type": "circle", "center_point": knee_right, "radius": 8, "color_bgr": [255, 153, 51], "filled": True})

        # Text for angles
        if 'angle_left' in exercise_data_dict:
            annotations.append({"type": "text", "text_content": f"Angle L: {int(exercise_data_dict['angle_left'])}",
                                "position": [knee_left[0] + 10, knee_left[1] - 10],
                                "font_scale": 0.5, "color_bgr": [255, 255, 255], "thickness": 2})
        if 'angle_right' in exercise_data_dict:
            annotations.append({"type": "text", "text_content": f"Angle R: {int(exercise_data_dict['angle_right'])}",
                                "position": [knee_right[0] + 10, knee_right[1] - 10],
                                "font_scale": 0.5, "color_bgr": [255, 255, 255], "thickness": 2})

        # Display main feedback from exercise_data_dict
        if 'feedback' in exercise_data_dict:
             annotations.append({"type": "text", "text_content": exercise_data_dict['feedback'],
                                "position": [frame_width // 2 - 100, frame_height - 40], # Centered at bottom
                                "font_scale": 0.7, "color_bgr": [0, 0, 255], "thickness": 2})


        return annotations
    
    # Inside the Squat class in squat.py
    def reset_reps(self):
        self.counter = 0
        self.stage = "up"  # Reset to the initial stage
        print("Squat reps and stage reset for new set.")