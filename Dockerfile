# Use official Python image
FROM python:3.10-slim

# Install system dependencies (important for psycopg2 etc.)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

WORKDIR /app/vlab


# Expose Django port
EXPOSE 8080

# Use Cloud Run's PORT variable dynamically
CMD ["sh", "-c", "python manage.py runserver 0.0.0.0:${PORT:-8000}"]