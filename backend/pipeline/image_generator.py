import asyncio
import os
import uuid
import io
import base64
from huggingface_hub import AsyncInferenceClient

class ImageGenerator:
    def __init__(self, api_key: str):
        self.api_key = api_key
        # Engine Mappings
        self.engines = {
            "cinematic": "stabilityai/stable-diffusion-xl-base-1.0",
            "photoreal": "SG_1612/Realistic_Vision_V6.0_B1_noVAE",
            "digital_art": "playgroundai/playground-v2.5-1024px-aesthetic",
            "minimalist": "prompthero/openjourney-v4"
        }
        # We'll initialize clients on the fly to save resources or maintain a pool
        self.clients = {
            name: AsyncInferenceClient(model=model_id, token=self.api_key)
            for name, model_id in self.engines.items()
        }

    async def generate_single(self, prompt: str, engine: str = "cinematic", guidance: float = 7.5, steps: int = 30):
        """
        Hits a specific HF Inference Engine and returns a Base64 string.
        """
        try:
            client = self.clients.get(engine, self.clients["cinematic"])
            
            # Use text_to_image with expanded parameters
            image = await client.text_to_image(
                prompt,
                negative_prompt="blurry, distorted, low quality, pixelated, text, watermark, deformed",
                guidance_scale=guidance,
                num_inference_steps=steps
            )
            
            # Convert PIL image to Base64
            buffered = io.BytesIO()
            image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            
            return f"data:image/png;base64,{img_str}"
            
        except Exception as e:
            print(f"Engine {engine} failed: {e}")
            return None

    async def generate_batch(self, sub_prompts: list, engine: str = "cinematic", guidance: float = 7.5, steps: int = 30):
        """
        Runs multiple generations in parallel using the selected engine.
        """
        tasks = [self.generate_single(p, engine, guidance, steps) for p in sub_prompts]
        results = await asyncio.gather(*tasks)
        return [r for r in results if r is not None]
