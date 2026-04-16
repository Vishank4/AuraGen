import asyncio
from huggingface_hub import AsyncInferenceClient
import os

# Using a dummy token for the test logic or assuming the environment has one
# HF_TOKEN = "your_token_here"

models_to_test = [
    "stabilityai/stable-diffusion-xl-base-1.0",
    "stabilityai/stable-diffusion-2-1",
    "runwayml/stable-diffusion-v1-5",
    "prompthero/openjourney",
    "SG_1612/Realistic_Vision_V6.0_B1_noVAE",
    "playgroundai/playground-v2.5-1024px-aesthetic",
    "stabilityai/sdxl-turbo"
]

async def test_models():
    # Attempt to read from env if available
    token = os.getenv("HUGGINGFACE_API_KEY") # We can't actually see this but the script will run in their terminal
    
    for model_id in models_to_test:
        print(f"Testing {model_id}...")
        client = AsyncInferenceClient(model=model_id, token=token)
        try:
            # Short timeout or small generation
            image = await client.text_to_image("a simple cat", num_inference_steps=1)
            print(f"SUCCESS: {model_id} is available.")
        except Exception as e:
            print(f"FAILED: {model_id} - {e}")

if __name__ == "__main__":
    asyncio.run(test_models())
