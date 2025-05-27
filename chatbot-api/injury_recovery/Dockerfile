# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container at /app
COPY . .

# Make port 7860 available to the world outside this container
EXPOSE 7860

# Define environment variable for the port
ENV PORT 7860
ENV HOST 0.0.0.0

# Command to run the application using Uvicorn
CMD ["uvicorn", "khelverse_detailed_injury_recovery:app", "--host", "0.0.0.0", "--port", "7860"]