FROM python:3.10-slim

RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY vlab/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt gunicorn psycopg2-binary

# Copy only the Django app subfolder
COPY vlab/ .

EXPOSE 8080

CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn vlab.wsgi:application --bind 0.0.0.0:${PORT:-8080}"]
