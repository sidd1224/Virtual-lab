FROM python:3.10-slim

# Install dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency list and install
COPY vlab/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt gunicorn psycopg2-binary

# Copy only the Django app subfolder
COPY vlab/ .

# Expose port for Cloud Run
EXPOSE 8080

# Run migrations and start Gunicorn
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn vlab.wsgi:application --bind 0.0.0.0:${PORT:-8080}"]
