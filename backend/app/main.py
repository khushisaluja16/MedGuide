from fastapi import FastAPI
from pydantic import BaseModel
from app.database import collection, db
from fastapi.middleware.cors import CORSMiddleware
import csv
import requests
import os
from app.database import reports_col
from datetime import datetime

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── File Paths ────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH  = os.path.join(BASE_DIR, "disease_symptom.csv", "dataset.csv")
DESC_PATH = os.path.join(BASE_DIR, "disease_symptom.csv", "symptom_Description.csv")
PREC_PATH = os.path.join(BASE_DIR, "disease_symptom.csv", "symptom_precaution.csv")

# ── Load dataset.csv ──────────────────────────────────────────────
symptom_data = []
with open(CSV_PATH, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        symptom_data.append(row)

# ── Load symptom_Description.csv ──────────────────────────────────
disease_desc = {}
with open(DESC_PATH, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        disease_desc[row["Disease"].strip()] = row["Description"].strip()

# ── Load symptom_precaution.csv ───────────────────────────────────
disease_prec = {}
with open(PREC_PATH, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        precs = [row.get(f"Precaution_{i}", "").strip() for i in range(1, 5)]
        disease_prec[row["Disease"].strip()] = [p for p in precs if p]

# ── Build unique symptoms list for dropdown ───────────────────────
all_symptoms = set()
for row in symptom_data:
    for i in range(1, 18):
        s = row.get(f"Symptom_{i}", "").strip()
        if s:
            all_symptoms.add(s)
all_symptoms = sorted(list(all_symptoms))


# ── User Model ────────────────────────────────────────────────────
class User(BaseModel):
    email: str
    username: str = ""
    password: str
    name: str = ""
    age: int = 0
    gender: str = ""


# ── Auth Endpoints ────────────────────────────────────────────────
@app.post("/register")
def register(user: User):
    try:
        existing = collection.find_one({"email": user.email})
        if existing:
            return {"success": False, "message": "User already exists"}
        collection.insert_one({
            "email": user.email,
            "username": user.username,
            "password": user.password,
            "name": user.name,
            "age": user.age,
            "gender": user.gender
        })
        return {"success": True, "message": "Registered successfully"}
    except Exception as e:
        print("ERROR:", e)
        return {"success": False, "message": "Backend error"}


@app.post("/login")
def login(user: User):
    existing = collection.find_one({
        "email": user.email,
        "password": user.password
    })
    if not existing:
        return {"success": False, "message": "Invalid credentials"}
    return {
        "success": True, 
        "message": "Login successful",
        "username": existing["name"]  
    }


@app.get("/")
def test_connection():
    try:
        db.list_collection_names()
        return {"status": "Connected to MongoDB ✅"}
    except Exception as e:
        return {"status": "Connection failed ❌", "error": str(e)}


@app.get("/test-db")
async def test_db():
    col = db["test_collection"]
    col.insert_one({"name": "Khushi", "project": "MedGuide"})
    result = list(col.find({}, {"_id": 0}))
    return {"data": result}


# ── Get all symptoms for dropdown ─────────────────────────────────
@app.get("/get-symptoms")
def get_symptoms():
    return {"symptoms": all_symptoms}


# ── Symptom Checker ───────────────────────────────────────────────
@app.get("/check-symptoms")
def check_symptoms(query: str):
    try:
        selected = [s.strip() for s in query.split(",") if s.strip()]
        matched_diseases = []

        for row in symptom_data:
            disease_val = row.get("Disease", "").strip()

            row_symptoms = []
            for i in range(1, 18):
                s = row.get(f"Symptom_{i}", "").strip()
                if s:
                    row_symptoms.append(s)

            matches = sum(1 for s in selected if s in row_symptoms)
            if matches > 0:
                existing = next((d for d in matched_diseases if d["disease"] == disease_val), None)
                if not existing:
                    matched_diseases.append({
                        "disease": disease_val,
                        "matches": matches,
                        "description": disease_desc.get(disease_val, "No description available"),
                        "precautions": disease_prec.get(disease_val, [])
                    })

        matched_diseases.sort(key=lambda x: x["matches"], reverse=True)

        if not matched_diseases:
            return {"results": [], "message": "No matching conditions found"}
        return {"results": matched_diseases[:5]}

    except Exception as e:
        print("Symptom error:", e)
        return {"results": [], "message": str(e)}


# ── Search Medicine ───────────────────────────────────────────────
@app.get("/search-medicine")
def search_medicine(name: str):
    try:
        if not name.strip():
            return {"error": "Please enter a medicine name"}

        url = f"https://api.fda.gov/drug/label.json?search=openfda.generic_name:{name.lower()}&limit=1"
        response = requests.get(url, timeout=10)
        data = response.json()

        if "results" not in data:
            url = f"https://api.fda.gov/drug/label.json?search=openfda.brand_name:{name.lower()}&limit=1"
            response = requests.get(url, timeout=10)
            data = response.json()

        if "results" not in data:
            return {"error": "Medicine not found. Try generic names like 'paracetamol', 'ibuprofen', 'aspirin'"}

        result = data["results"][0]

        uses = (
            result.get("indications_and_usage") or
            result.get("purpose") or
            result.get("description") or
            ["Usage information not available"]
        )[0]

        side_effects = None
        for field in ["adverse_reactions", "adverse_reactions_table", "precautions"]:
            val = result.get(field)
            if val and val[0].strip():
                side_effects = val[0]
                break
        if not side_effects:
            side_effects = "Common side effects may include nausea, stomach upset, headache, dizziness. Consult your doctor for complete information."

        warnings = None
        for field in ["boxed_warning", "warnings", "warnings_and_cautions"]:
            val = result.get(field)
            if val and val[0].strip():
                warnings = val[0]
                break
        if warnings == side_effects or not warnings:
            warnings = (
                result.get("drug_interactions") or
                result.get("keep_out_of_reach_of_children") or
                ["Consult your doctor or pharmacist before use."]
            )[0]

        return {
            "name": name,
            "uses": uses,
            "side_effects": side_effects,
            "warnings": warnings,
        }

    except Exception as e:
        print("Medicine error:", e)
        return {"error": "Error fetching medicine data"}
    
class Profile(BaseModel):
    email: str
    name: str = ""
    age: str = ""
    gender: str = ""
    weight: str = ""
    height: str = ""
    bloodGroup: str = ""
    allergies: str = ""
    chronicConditions: str = ""
    currentMedications: str = ""
    emergencyContact: str = ""
    activityLevel: str = ""
    smokingStatus: str = "No"
    alcoholUse: str = "No"

@app.post("/save-profile")
def save_profile(profile: Profile):
    profiles_col = db["profiles"]
    profiles_col.update_one(
        {"email": profile.email},
        {"$set": profile.dict()},
        upsert=True
    )
    return {"success": True, "message": "Profile saved"}

@app.get("/get-profile")
def get_profile(email: str):
    profiles_col = db["profiles"]
    profile = profiles_col.find_one({"email": email}, {"_id": 0})
    if not profile:
        return {"success": False, "message": "Not found"}
    return {"success": True, "profile": profile}

# backend/app/main.py
import os
import re
import shutil
import tempfile
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .ocr import extract_text_from_image, extract_text_from_pdf
from .parse_vitals import parse_vitals_from_text
from .compare import compare_vitals_against_ranges
from .openai_client import analyze_with_openai


class AnalysisResponse(BaseModel):
    vitals: dict
    abnormal_vitals: List[dict]
    llm_assessment: dict

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze(
    name: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    manual_bp: Optional[str] = Form(None),  # optional manual BP like "120/80"
    files: List[UploadFile] = File(None),
):
    """
    Accepts form data + files. Returns structured vitals, abnormalities and LLM analysis.
    """
    # sanity checks
    if not files or len(files) == 0:
        raise HTTPException(status_code=400, detail="Please upload at least one file (JPEG or PDF).")
    if gender.lower() not in ("male", "female", "other"):
        gender = gender  # keep as-is; compare function should tolerate

    tmp_dir = tempfile.mkdtemp(prefix="ai_health_")
    try:
        aggregated_text = ""
        for upload in files:
            filename = upload.filename.lower()
            dest = os.path.join(tmp_dir, upload.filename)
            with open(dest, "wb") as f:
                content = await upload.read()
                f.write(content)

            if filename.endswith(".pdf"):
                text = extract_text_from_pdf(dest)
            else:
                # assume image
                text = extract_text_from_image(dest)
            aggregated_text += "\n" + text

        # parse vitals from the OCR'ed text
        extracted_vitals = parse_vitals_from_text(aggregated_text)

        # include manual BP if provided (override or supplement)
        if manual_bp:
            m = re.search(r"(\d{2,3})\s*/\s*(\d{2,3})", manual_bp)
            if m:
                extracted_vitals["blood_pressure_systolic"] = int(m.group(1))
                extracted_vitals["blood_pressure_diastolic"] = int(m.group(2))

        # include basic form data into vitals (age/gender are metadata)
        vitals_payload = {
            "name": name,
            "age": int(age),
            "gender": gender,
            "vitals": extracted_vitals
        }

        # compare vitals to healthy ranges
        comparison_result = compare_vitals_against_ranges(extracted_vitals, age, gender)

        # create a structured list of abnormal vitals
        abnormal_vitals = [
            v for v in comparison_result["detailed"]
            if v.get("value") is not None and v.get("within_range") is False
        ]

        # call LLM to get assessment
        llm_assessment = analyze_with_openai(
            vitals_payload,
            comparison_result,
            aggregated_text
        )

# 🔥 STORE IN DB
        report_doc = {
            "name": str(name),
            "age": int(age),  # ✅ MUST be int
            "gender": str(gender),

            "vitals": extracted_vitals if isinstance(extracted_vitals, dict) else {},
            "abnormal_vitals": abnormal_vitals if isinstance(abnormal_vitals, list) else [],

            "llm_assessment": llm_assessment if isinstance(llm_assessment, dict) else {
                "health_risk_assessment": "Error",
                "possible_diseases": ["None"],
                "preventive_measures": ["None"],
                "lifestyle_suggestions": ["None"]
            },

            "created_at": datetime.utcnow()
        }
        print("LLM TYPE:", type(llm_assessment))

        result = reports_col.insert_one(report_doc)

        return {
            "id": str(result.inserted_id),
            "vitals": extracted_vitals,
            "abnormal_vitals": abnormal_vitals,
            "llm_assessment": llm_assessment
        }
    finally:
        # cleanup
        shutil.rmtree(tmp_dir, ignore_errors=True)