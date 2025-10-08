# Use official Python image
FROM python:3.10-slim

# Install system dependencies required by psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency file first (for better caching)
COPY requirements.txt .

# Install dependencies + Gunicorn
RUN pip install --no-cache-dir -r requirements.txt gunicorn psycopg2-binary

# Copy project files
COPY . .

# Collect static files for production
RUN python manage.py collectstatic --noinput

# Expose port for Cloud Run
EXPOSE 8080

# Run migrations and start Gunicorn on Cloud Run port
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn vlab.wsgi:application --bind 0.0.0.0:${PORT:-8080}"]
