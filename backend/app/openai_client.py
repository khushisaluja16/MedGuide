from dotenv import load_dotenv
import os
import json
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
from google import genai


client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))


PROMPT_TEMPLATE = """
You are a professional medical assistant summarizer (non-diagnostic).

IMPORTANT:
- You MUST return ONLY valid JSON.
- DO NOT include markdown (no ```json, no ```).
- DO NOT include any explanation outside JSON.

STRICT OUTPUT FORMAT:
{{
  "health_risk_assessment": "string",
  "possible_diseases": ["string"],
  "preventive_measures": ["string"],
  "lifestyle_suggestions": ["string"]
}}

RULES:
- Always return ALL 4 keys.
- Do NOT add extra keys.
- Arrays must NEVER be empty → use ["None"] if needed.
- Keep responses short and patient-friendly.
- Do NOT provide diagnosis — only possibilities.

LOGIC:
- Analyze:
  1. Vitals
  2. Comparison
  3. Medical Report
- Priority: Report > Comparison > Vitals
- If everything normal → "No significant risk detected"

INPUT:

Vitals:
{vitals}

Comparison Results:
{comparison}

Medical Report:
{report}
"""


import re


def analyze_with_openai(vitals_payload, comparison_result, report_text):
    prompt = PROMPT_TEMPLATE.format(
        vitals=json.dumps(vitals_payload.get("vitals"), indent=2),
        comparison=json.dumps(comparison_result, indent=2),
        report=report_text[:8000]
    )

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )

    raw_text = response.text.strip()

    try:
        # 🔥 CLEAN markdown
        cleaned = re.sub(r"```json|```", "", raw_text).strip()

        # 🔥 EXTRACT JSON
        start = cleaned.find("{")
        end = cleaned.rfind("}") + 1
        cleaned = cleaned[start:end]

        parsed = json.loads(cleaned)

    except Exception:
        return {
            "health_risk_assessment": "Error parsing response",
            "possible_diseases": ["None"],
            "preventive_measures": ["None"],
            "lifestyle_suggestions": ["None"],
            "raw_output": raw_text
        }

    # 🔥 MAP KEYS
    return {
        "health_risk_assessment": parsed.get("health_risk_assessment") 
            or parsed.get("risk_assessment", ""),

        "possible_diseases": parsed.get("possible_diseases") 
            or parsed.get("possible_conditions", ["None"]),

        "preventive_measures": parsed.get("preventive_measures", ["None"]),

        "lifestyle_suggestions": parsed.get("lifestyle_suggestions", ["None"]),
    }