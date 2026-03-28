from google import genai
import os
from dotenv import load_dotenv

# load env
load_dotenv()

# create client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

print("\nAvailable Models:\n")

# list models
for model in client.models.list():
    print(model.name)