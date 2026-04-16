import asyncio
from huggingface_hub import AsyncInferenceClient
import os
from dotenv import load_dotenv

load_dotenv()

models_to_test = [
    "stabilityai/stable-diffusion-xl-base-1.0",
    "runwayml/stable-diffusion-v1-5",
    "prompthero/openjourney",
    "SG_1612/Realistic_Vision_V4.0_noVAE",
    "stabilityai/sdxl-turbo"
]

async def test_models():
    token = os.getenv("HUGGINGFACE_API_KEY")
    if not token:
        print("ERROR: HUGGINGFACE_API_KEY not found in .env")
        return
    
    for model_id in models_to_test:
        print(f"Testing {model_id}...")
        client = AsyncInferenceClient(model=model_id, token=token)
        try:
            # Simple call to see if it responds
            image = await client.text_to_image("a simple cat", guidance_scale=7.0, num_inference_steps=20)
            print(f"SUCCESS: {model_id} is available.")
        except Exception as e:
            print(f"FAILED: {model_id} - {e}")

if __name__ == "__main__":
    asyncio.run(test_models())
