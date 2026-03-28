# backend/app/models.py
from pydantic import BaseModel
from typing import Any, Dict, List

class VitalsComparisonItem(BaseModel):
    name: str
    value: Any
    within_range: bool = None
    expected_min: float = None
    expected_max: float = None
    unit: str = None

class OpenAIResponse(BaseModel):
    summary: str
    risk_assessment: str
    possible_conditions: List[str]
    recommended_tests: List[str]
    preventive_measures: List[str]
    lifestyle_suggestions: List[str]