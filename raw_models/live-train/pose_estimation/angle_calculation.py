import numpy as np
import math

def calculate_angle(a, b, c):
    """Calculates the angle between three points (e.g., elbow, shoulder, hip).
    Args:
        a: First point (list or tuple of [x, y]).
        b: Second point (vertex) (list or tuple of [x, y]).
        c: Third point (list or tuple of [x, y]).
    Returns:
        The angle in degrees.
    """
    a = np.array(a)  # First
    b = np.array(b)  # Mid
    c = np.array(c)  # End

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - \
              np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle
    
    return angle

def calculate_angle_3d(a, b, c):
    """Calculates the angle between three 3D points.
    Args:
        a: First landmark (MediaPipe Landmark object or dict with x, y, z).
        b: Second landmark (vertex) (MediaPipe Landmark object or dict with x, y, z).
        c: Third landmark (MediaPipe Landmark object or dict with x, y, z).
    Returns:
        The angle in degrees.
    """
    # Convert to numpy arrays
    vec_a = np.array([a.x, a.y, a.z]) if hasattr(a, 'x') else np.array(a)
    vec_b = np.array([b.x, b.y, b.z]) if hasattr(b, 'x') else np.array(b)
    vec_c = np.array([c.x, c.y, c.z]) if hasattr(c, 'x') else np.array(c)

    # Calculate vectors from mid_point to other points
    vec_ba = vec_a - vec_b
    vec_bc = vec_c - vec_b

    # Calculate dot product
    dot_product = np.dot(vec_ba, vec_bc)

    # Calculate magnitudes
    magnitude_ba = np.linalg.norm(vec_ba)
    magnitude_bc = np.linalg.norm(vec_bc)

    # Calculate cosine of the angle
    # Add a small epsilon to prevent division by zero if magnitudes are zero
    epsilon = 1e-7
    cosine_angle = dot_product / (magnitude_ba * magnitude_bc + epsilon)

    # Ensure cosine_angle is within the valid range for arccos [-1, 1]
    cosine_angle = np.clip(cosine_angle, -1.0, 1.0)
    
    # Calculate angle in radians
    angle_rad = np.arccos(cosine_angle)

    # Convert angle to degrees
    angle_deg = np.degrees(angle_rad)

    return angle_deg