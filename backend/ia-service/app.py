import hmac
import io
import ipaddress
import os
import socket
from urllib.parse import urljoin, urlparse

import numpy as np
import requests
import uvicorn
from fastapi import FastAPI, Header, HTTPException
from PIL import Image
from pydantic import BaseModel, Field

import onnxruntime as ort

app = FastAPI(title="ECOMER IA Service", version="2.0.1")

YOLO_MODEL = os.environ.get("YOLO_MODEL", "yolov8n.onnx")
CONF_THRESHOLD = float(os.environ.get("YOLO_CONF_THRESHOLD", "0.35"))
NMS_THRESHOLD = float(os.environ.get("YOLO_NMS_THRESHOLD", "0.45"))
DOWNLOAD_TIMEOUT = int(os.environ.get("YOLO_DOWNLOAD_TIMEOUT", "15"))
MAX_DOWNLOAD_BYTES = int(os.environ.get("YOLO_MAX_DOWNLOAD_BYTES", "10485760"))  # 10 Mo
MAX_REDIRECTS = int(os.environ.get("YOLO_MAX_REDIRECTS", "5"))
IA_API_KEY = os.environ.get("IA_API_KEY", "")
# Sécurité SSRF : interdire les adresses privées/réservées par défaut.
# Passer à "1" uniquement pour un dev local où le backend sert des photos
# depuis http://localhost:... (à proscrire en production).
IA_ALLOW_PRIVATE = os.environ.get("IA_ALLOW_PRIVATE", "0") == "1"
IMGSZ = int(os.environ.get("YOLO_IMGSZ", "640"))

_session = None

COCO_NAMES = [
    "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck",
    "boat", "traffic light", "fire hydrant", "stop sign", "parking meter", "bench",
    "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra",
    "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
    "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove",
    "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup",
    "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange",
    "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch",
    "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse",
    "remote", "keyboard", "cell phone", "microwave", "oven", "toaster", "sink",
    "refrigerator", "book", "clock", "vase", "scissors", "teddy bear", "hair drier",
    "toothbrush",
]

COCO_TO_DECHET = {
    "bottle": "plastique",
    "cup": "plastique",
    "wine glass": "verre",
    "bowl": "dechets_melanges",
    "fork": "dechets_melanges",
    "knife": "metal",
    "spoon": "metal",
    "banana": "organique",
    "apple": "organique",
    "orange": "organique",
    "sandwich": "organique",
    "broccoli": "organique",
    "carrot": "organique",
    "pizza": "organique",
    "donut": "organique",
    "cake": "organique",
    "book": "papier",
    "newspaper": "papier",
    "cell phone": "electronique",
    "laptop": "electronique",
    "mouse": "electronique",
    "keyboard": "electronique",
    "remote": "electronique",
    "tv": "electronique",
    "suitcase": "textile",
    "backpack": "textile",
    "handbag": "textile",
    "umbrella": "textile",
}


class AnalyseRequest(BaseModel):
    photoUrl: str = Field(..., description="URL de la photo (Cloudinary) a analyser")


def categorie_waste(classe: str) -> str:
    return COCO_TO_DECHET.get(classe, "dechets_melanges")


def get_session():
    global _session
    if _session is None:
        options = ort.SessionOptions()
        options.intra_op_num_threads = int(os.environ.get("YOLO_THREADS", "1"))
        options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        _session = ort.InferenceSession(YOLO_MODEL, sess_options=options, providers=["CPUExecutionProvider"])
    return _session


def _est_ip_privee(ip: str) -> bool:
    try:
        addr = ipaddress.ip_address(ip)
    except ValueError:
        return True  # adresse non parsable : on refuse par sécurité
    if addr.is_private or addr.is_loopback or addr.is_link_local \
            or addr.is_multicast or addr.is_unspecified or addr.is_reserved:
        return True
    return False


def _verifier_url(url: str) -> None:
    """Valide la photoUrl pour bloquer les attaques SSRF (IP privées, DNS rebinding...)."""
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise HTTPException(status_code=422, detail="Seules les URLs http/https sont autorisées.")
    if parsed.username or parsed.password:
        raise HTTPException(status_code=422, detail="Authentification dans l'URL interdite.")
    hostname = parsed.hostname
    if not hostname:
        raise HTTPException(status_code=422, detail="URL invalide (hôte manquant).")
    try:
        infos = socket.getaddrinfo(hostname, parsed.port or (443 if parsed.scheme == "https" else 80))
    except socket.gaierror:
        raise HTTPException(status_code=422, detail="Hôte introuvable.")
    for info in infos:
        ip = info[4][0]
        if not IA_ALLOW_PRIVATE and _est_ip_privee(ip):
            raise HTTPException(status_code=422, detail="Accès réseau refusé (adresse privée ou réservée).")


def telecharger_image(url: str) -> Image.Image:
    current = url
    try:
        for _ in range(MAX_REDIRECTS + 1):
            _verifier_url(current)
            response = requests.get(
                current,
                timeout=DOWNLOAD_TIMEOUT,
                stream=True,
                allow_redirects=False,
            )
            if response.is_redirect and response.headers.get("Location"):
                response.close()
                current = urljoin(current, response.headers["Location"])
                continue
            size = 0
            chunks = []
            for chunk in response.iter_content(chunk_size=65536):
                size += len(chunk)
                if size > MAX_DOWNLOAD_BYTES:
                    response.close()
                    raise HTTPException(status_code=422, detail=f"Image trop volumineuse (> {MAX_DOWNLOAD_BYTES} octets).")
                chunks.append(chunk)
            response.raise_for_status()
            content = b"".join(chunks)
            break
        else:
            raise HTTPException(status_code=422, detail="Trop de redirections.")
    except HTTPException:
        raise
    except requests.RequestException as exc:
        raise HTTPException(status_code=422, detail=f"Image introuvable ou inaccessible : {exc}")
    try:
        return Image.open(io.BytesIO(content)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Format d'image invalide : {exc}")


def preprocess(img: Image.Image):
    """Resize avec letterbox 640x640 -> tenseur (1,3,640,640) float32."""
    w, h = img.size
    scale = min(IMGSZ / w, IMGSZ / h)
    nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
    resized = img.resize((nw, nh), Image.BILINEAR)
    canvas = Image.new("RGB", (IMGSZ, IMGSZ), (114, 114, 114))
    pad_x = (IMGSZ - nw) / 2
    pad_y = (IMGSZ - nh) / 2
    canvas.paste(resized, (int(pad_x), int(pad_y)))
    arr = np.asarray(canvas, dtype=np.float32) / 255.0
    blob = np.transpose(arr, (2, 0, 1))[None, ...]
    return blob, scale, pad_x, pad_y


def nms(boxes, scores, iou_thres):
    if boxes.shape[0] == 0:
        return []
    x1, y1, x2, y2 = boxes[:, 0], boxes[:, 1], boxes[:, 2], boxes[:, 3]
    areas = (x2 - x1 + 1) * (y2 - y1 + 1)
    order = scores.argsort()[::-1]
    keep = []
    while order.size > 0:
        i = order[0]
        keep.append(int(i))
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])
        w_ = np.maximum(0.0, xx2 - xx1 + 1)
        h_ = np.maximum(0.0, yy2 - yy1 + 1)
        inter = w_ * h_
        unions = areas[i] + areas[order[1:]] - inter
        ovr = inter / np.maximum(unions, 1e-9)
        order = order[np.where(ovr <= iou_thres)[0] + 1]
    return keep


def analyser_image(photo_url: str):
    image = telecharger_image(photo_url)
    sess = get_session()
    blob, scale, pad_x, pad_y = preprocess(image)

    input_name = sess.get_inputs()[0].name
    output = sess.run(None, {input_name: blob})[0]  # (1,84,8400)
    pred = output[0].T  # (8400,84)

    class_probs = pred[:, 4:]
    class_ids = class_probs.argmax(axis=1)
    conf = class_probs[np.arange(class_probs.shape[0]), class_ids]
    mask = conf >= CONF_THRESHOLD
    if not mask.any():
        return None

    box_xywh = pred[mask, :4]
    cids = class_ids[mask]
    scores = conf[mask]
    cx, cy, bw, bh = box_xywh[:, 0], box_xywh[:, 1], box_xywh[:, 2], box_xywh[:, 3]
    boxes_canvas = np.stack([
        (cx - bw / 2) * IMGSZ - pad_x,
        (cy - bh / 2) * IMGSZ - pad_y,
        (cx + bw / 2) * IMGSZ - pad_x,
        (cy + bh / 2) * IMGSZ - pad_y,
    ], axis=1)
    boxes_img = boxes_canvas / scale

    keep_idx = []
    for cls_id in np.unique(cids):
        sel = np.where(cids == cls_id)[0]
        keep = nms(boxes_img[sel], scores[sel], NMS_THRESHOLD)
        keep_idx.extend(sel[keep].tolist())

    detections = []
    for idx in keep_idx:
        nom = COCO_NAMES[int(cids[idx])]
        detections.append({
            "classe": nom,
            "categorie": categorie_waste(nom),
            "confiance": round(float(scores[idx]), 4),
        })
    detections.sort(key=lambda d: d["confiance"], reverse=True)
    return detections


def cle_valide(cle: str) -> bool:
    if not IA_API_KEY:
        return True
    return hmac.compare_digest(cle, IA_API_KEY)


def exiger_cle(x_api_key: str = Header(default="", alias="X-API-KEY")):
    if not cle_valide(x_api_key):
        raise HTTPException(status_code=401, detail="Clé API invalide.")


@app.get("/health")
def health():
    return {"status": "ok", "model": YOLO_MODEL}


@app.post("/analyser")
def analyser(req: AnalyseRequest, x_api_key: str = Header(default="", alias="X-API-KEY")):
    exiger_cle(x_api_key)
    detections = analyser_image(req.photoUrl)

    if not detections:
        return {
            "typeDechet": None,
            "confiance": None,
            "detections": [],
            "message": "Aucun objet détecté sur l'image.",
        }

    counts = {}
    for d in detections:
        counts[d["categorie"]] = counts.get(d["categorie"], 0) + 1
    dominant = max(counts, key=lambda c: counts[c])
    conf_dominant = max(d["confiance"] for d in detections if d["categorie"] == dominant)

    return {
        "typeDechet": dominant,
        "confiance": conf_dominant,
        "detections": detections,
        "message": f"{len(detections)} objet(s) detecte(s).",
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("IA_SERVICE_PORT", "8501")))