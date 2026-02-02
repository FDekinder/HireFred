FROM python:3.12-slim

WORKDIR /app

# Install build dependencies for bcrypt
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY start.sh .
RUN sed -i 's/\r$//' start.sh && chmod +x start.sh
CMD ["./start.sh"]
