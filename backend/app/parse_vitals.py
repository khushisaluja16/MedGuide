# backend/app/parse_vitals.py
import re
from typing import Dict

def _first_int_in_text_after_keyword(text: str, keyword: str):
    # helper to find numbers after a keyword
    pattern = rf"{keyword}[:\s]*([0-9]{{2,3}}(?:\.[0-9]+)?)"
    m = re.search(pattern, text, flags=re.IGNORECASE)
    if m:
        try:
            return float(m.group(1))
        except:
            return None
    return None

def parse_vitals_from_text(text: str) -> Dict:
    t = text.replace("\n", " ").lower()
    vitals = {}

    # Blood pressure: "120/80" or "BP 120/80" or "blood pressure: 120/80 mmhg"
    m = re.search(r"(\d{2,3})\s*/\s*(\d{2,3})", t)
    if m:
        vitals["blood_pressure_systolic"] = int(m.group(1))
        vitals["blood_pressure_diastolic"] = int(m.group(2))

    # Heart rate / pulse
    hr = _first_int_in_text_after_keyword(t, r"(heart rate|pulse|bpm)")
    if hr:
        vitals["heart_rate_bpm"] = int(hr)

    # SpO2
    spo2 = _first_int_in_text_after_keyword(t, r"(spo2|oxygen saturation|saturation)")
    if spo2:
        vitals["spo2_percent"] = int(spo2)

    # Temperature (C or F detection)
    mtemp = re.search(r"temperature[:\s]*([0-9]{2,3}(?:\.[0-9])?)\s*°?\s*([cf])?", t)
    if mtemp:
        temp = float(mtemp.group(1))
        unit = mtemp.group(2)
        if unit == 'f':
            temp = (temp - 32) * 5.0/9.0
        vitals["temperature_c"] = round(temp, 1)
    else:
        # fallback search simple 'fever 100.4 F' etc
        ttemp = re.search(r"([0-9]{2}\.[0-9])\s*°?\s*f", t)
        if ttemp:
            vitals["temperature_c"] = round((float(ttemp.group(1)) - 32) * 5.0/9.0, 1)

    # Glucose
    glu = _first_int_in_text_after_keyword(t, r"(glucose|blood sugar|mg/dl)")
    if glu:
        vitals["blood_glucose_mg_dl"] = int(glu)

    # Cholesterol (total)
    chol = _first_int_in_text_after_keyword(t, r"(cholesterol|total cholesterol)")
    if chol:
        vitals["cholesterol_total_mg_dl"] = int(chol)

    # Respiratory rate
    rr = _first_int_in_text_after_keyword(t, r"(respiratory rate|breaths/min|rr)")
    if rr:
        vitals["respiratory_rate_bpm"] = int(rr)

    return vitals