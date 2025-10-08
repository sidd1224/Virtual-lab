# Use official Python image
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy requirements.txt from the root folder (where Dockerfile is)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt gunicorn psycopg2-binary

# Copy the whole project into /app
COPY . .

# Move into the Django project folder where manage.py exists
WORKDIR /app/vlab

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Run migrations and start the Gunicorn server
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn vlab.wsgi:application --bind 0.0.0.0:${PORT:-8080}"]
