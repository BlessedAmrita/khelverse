# 1. Use an official Python runtime as a parent image
FROM python:3.9-slim

# 2. Set environment variables
# Prevents Python from writing pyc files to disc (optional)
ENV PYTHONDONTWRITEBYTECODE 1
# Prevents Python from buffering stdout and stderr (optional, good for logging)
ENV PYTHONUNBUFFERED 1

# 3. Set the working directory in the container
WORKDIR /app

# 4. Copy the requirements file into the container at /app
COPY requirements.txt .

# 5. Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 6. Copy the rest of your application's code into the container at /app
COPY ./main.py .
# If you had other Python modules or directories, copy them too e.g.
# COPY ./my_modules/ ./my_modules/

# 7. Expose the port the app runs on.
# Hugging Face Spaces will pass a PORT environment variable, typically 7860.
# Your Uvicorn command should use this $PORT.
# This EXPOSE instruction is more for documentation and local testing.
EXPOSE 7860

# 8. Define the command to run your application.
# Use the PORT environment variable provided by Hugging Face Spaces.
# The default PORT for HF Spaces is 7860.
# Using "main:app" assumes your FastAPI instance is named 'app' in 'main.py'.
# Use 0.0.0.0 to bind to all available network interfaces.
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-7860}
