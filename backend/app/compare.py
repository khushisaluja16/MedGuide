# backend/app/compare.py
from typing import Dict, Any, List

# NOTE: These ranges are generic adult examples. For production, use authoritative clinical ranges per population.
BASELINE_RANGES = {
    "blood_pressure_systolic": {"min": 90, "max": 120, "unit": "mmHg"},
    "blood_pressure_diastolic": {"min": 60, "max": 80, "unit": "mmHg"},
    "heart_rate_bpm": {"min": 60, "max": 100, "unit": "bpm"},
    "spo2_percent": {"min": 95, "max": 100, "unit": "%"},
    "temperature_c": {"min": 36.1, "max": 37.2, "unit": "°C"},
    "blood_glucose_mg_dl": {"min": 70, "max": 140, "unit": "mg/dL"},
    "cholesterol_total_mg_dl": {"min": 0, "max": 200, "unit": "mg/dL"},
    "respiratory_rate_bpm": {"min": 12, "max": 20, "unit": "breaths/min"},
}

def age_gender_adjusted_ranges(age: int, gender: str):
    # Minimal example: you may modify ranges by age groups; for now we return baseline
    return BASELINE_RANGES

def compare_vitals_against_ranges(vitals: Dict[str, Any], age: int, gender: str) -> Dict:
    ranges = age_gender_adjusted_ranges(age, gender)
    detailed = []
    overall_ok = True
    for key, meta in ranges.items():
        value = vitals.get(key)
        if value is None:
            detailed.append({
                "name": key,
                "value": None,
                "within_range": None,
                "expected_min": meta["min"],
                "expected_max": meta["max"],
                "unit": meta["unit"],
            })
            continue
        within = (value >= meta["min"]) and (value <= meta["max"])
        if within is False:
            overall_ok = False
        detailed.append({
            "name": key,
            "value": value,
            "within_range": within,
            "expected_min": meta["min"],
            "expected_max": meta["max"],
            "unit": meta["unit"],
        })
    return {"overall_ok": overall_ok, "detailed": detailed}