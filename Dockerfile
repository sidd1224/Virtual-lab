# Use official Python image
FROM python:3.10-slim

# Install dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn psycopg2-binary whitenoise

# Copy all project files
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port for Cloud Run
EXPOSE 8080

# Run migrations + start server
CMD ["sh", "-c", "python manage.py migrate && gunicorn vlab.wsgi:application --bind 0.0.0.0:${PORT:-8080}"]
