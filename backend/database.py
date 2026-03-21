from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
print(os.getenv("MONGO_URI"))

db = client["medguide"]
reports_collection = db["reports"]