FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY backend/ia-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ia-service/app.py .
COPY backend/ia-service/yolov8n.onnx .

ARG YOLO_MODEL=yolov8n.onnx
ENV YOLO_MODEL=$YOLO_MODEL

EXPOSE 8501

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8501"]