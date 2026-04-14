import asyncio
import os
import uuid
import io
import base64
from huggingface_hub import AsyncInferenceClient

class ImageGenerator:
    def __init__(self, api_key: str):
        self.api_key = api_key
        # Use the master client which handles routing to router.huggingface.co automatically
        self.client = AsyncInferenceClient(
            model="stabilityai/stable-diffusion-xl-base-1.0",
            token=self.api_key
        )

    async def generate_single(self, prompt: str):
        """
        Hits the HF Inference API for a single image and returns it as a Base64 string.
        """
        try:
            # The client handles the API call and returns a PIL image for text-to-image models
            image = await self.client.text_to_image(
                prompt,
                negative_prompt="blurry, distorted, low quality, pixelated, text, watermark",
                guidance_scale=7.5
            )
            
            # Convert PIL image to Base64 string
            buffered = io.BytesIO()
            image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            
            return f"data:image/png;base64,{img_str}"
            
        except Exception as e:
            print(f"HF Inference failed: {e}")
            return None # Main.py will handle missing images

    async def generate_batch(self, sub_prompts: list):
        """
        Runs multiple generations in parallel.
        """
        tasks = [self.generate_single(p) for p in sub_prompts]
        results = await asyncio.gather(*tasks)
        # Filter out any failed generations
        return [r for r in results if r is not None]
