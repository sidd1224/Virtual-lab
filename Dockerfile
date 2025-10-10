# Use official Python image
FROM python:3.10-slim

# Install dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn psycopg2-binary

# Copy all project files
# This will create a 'vlab' directory inside /app
COPY . .

# Collect static files for production, referencing the correct path to manage.py
RUN python vlab/manage.py collectstatic --noinput

# Expose port for Cloud Run
EXPOSE 8080

# Run migrations + start server, referencing the correct path to manage.py
CMD ["sh", "-c", "python vlab/manage.py migrate && gunicorn vlab.wsgi:application --bind 0.0.0.0:${PORT:-8080}"]

