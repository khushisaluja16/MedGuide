# backend/app/ocr.py
import io
import re
from typing import List
from PIL import Image, ImageOps
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

import pdfplumber

# If Tesseract isn't on PATH, set pytesseract.pytesseract.tesseract_cmd = r"/usr/bin/tesseract"

def preprocess_image_for_ocr(pil_image: Image.Image) -> Image.Image:
    # basic preprocessing: convert to grayscale, increase contrast, maybe resize
    img = pil_image.convert("L")
    img = ImageOps.autocontrast(img)
    w, h = img.size
    if max(w, h) < 1200:
        img = img.resize((int(w*2), int(h*2)))
    return img

def extract_text_from_image(path: str) -> str:
    img = Image.open(path)
    img = preprocess_image_for_ocr(img)
    text = pytesseract.image_to_string(img)
    return text

def extract_text_from_pdf(path: str) -> str:
    """
    Tries to extract selectable text with pdfplumber first.
    If little text is returned (scanned pages), convert pages to images and use pytesseract.
    """
    full_text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text and len(text.strip()) > 20:
                full_text += "\n" + text
            else:
                # fallback: render page as image and OCR
                try:
                    pil = page.to_image(resolution=200).original
                    pil = preprocess_image_for_ocr(pil)
                    page_text = pytesseract.image_to_string(pil)
                    full_text += "\n" + page_text
                except Exception:
                    continue
    return full_text