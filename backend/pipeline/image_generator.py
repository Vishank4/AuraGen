import asyncio
import os
import uuid
import io
import base64
import time
from huggingface_hub import AsyncInferenceClient

class ImageGenerator:
    def __init__(self, api_key: str):
        self.api_key = api_key
        # Engine Mappings Optimized for Reliability & Free Tier
        self.engines = {
            "cinematic": "stabilityai/sdxl-turbo",
            "photoreal": "prompthero/openjourney",
            "digital_art": "runwayml/stable-diffusion-v1-5",
            "minimalist": "stabilityai/stable-diffusion-2-1"
        }
        self.clients = {
            name: AsyncInferenceClient(model=model_id, token=self.api_key)
            for name, model_id in self.engines.items()
        }

    async def generate_single(self, prompt: str, engine: str = "cinematic", guidance: float = 7.5, steps: int = 30):
        """
        Hits a specific HF Inference Engine with Retry logic for free-tier cold starts.
        """
        max_retries = 3
        retry_delay = 5 # seconds
        
        for attempt in range(max_retries):
            try:
                client = self.clients.get(engine, self.clients["cinematic"])
                
                # Use text_to_image with expanded parameters
                # Note: sdxl-turbo works best with lower steps (e.g. 1-4)
                actual_steps = steps if engine != "cinematic" else min(steps, 4)
                
                image = await client.text_to_image(
                    prompt,
                    negative_prompt="blurry, distorted, low quality, pixelated, text, watermark, deformed",
                    guidance_scale=guidance,
                    num_inference_steps=actual_steps
                )
                
                # Convert PIL image to Base64
                buffered = io.BytesIO()
                image.save(buffered, format="PNG")
                img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
                
                return f"data:image/png;base64,{img_str}"
                
            except Exception as e:
                error_msg = str(e)
                print(f"Attempt {attempt + 1} failed for {engine}: {error_msg}")
                
                # If it's a model loading error (503/533), wait and retry
                if "503" in error_msg or "533" in error_msg or "loading" in error_msg.lower():
                    if attempt < max_retries - 1:
                        print(f"Model {engine} is loading. Retrying in {retry_delay}s...")
                        await asyncio.sleep(retry_delay)
                        continue
                
                # Other errors fail immediately
                return None
        
        return None

    async def generate_batch(self, sub_prompts: list, engine: str = "cinematic", guidance: float = 7.5, steps: int = 30):
        """
        Runs multiple generations in parallel using the selected engine.
        """
        tasks = [self.generate_single(p, engine, guidance, steps) for p in sub_prompts]
        results = await asyncio.gather(*tasks)
        return [r for r in results if r is not None]
