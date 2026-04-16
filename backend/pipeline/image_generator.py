import asyncio
import io
import base64
import urllib.parse
import random
import httpx


class ImageGenerator:
    """
    Multi-engine image generator using Pollinations.ai (FLUX models).
    Zero API keys required. Always free. Always available.
    """

    def __init__(self, api_key: str = None):
        # api_key kept in signature for backward compatibility but not used
        self.base_url = "https://image.pollinations.ai/prompt"

        # Engine → Pollinations model mapping
        self.engines = {
            "cinematic":   "flux",
            "photoreal":   "flux-realism",
            "digital_art": "flux-anime",
            "minimalist":  "flux-3d",
        }

    async def generate_single(
        self,
        prompt: str,
        engine: str = "cinematic",
        guidance: float = 7.5,
        steps: int = 30,
    ) -> str | None:
        """
        Generate a single image via Pollinations.ai and return as a Base64 data URI.
        """
        model = self.engines.get(engine, self.engines["cinematic"])
        seed = random.randint(1, 999999)

        encoded_prompt = urllib.parse.quote(prompt)
        url = (
            f"{self.base_url}/{encoded_prompt}"
            f"?width=1024&height=1024"
            f"&model={model}"
            f"&seed={seed}"
            f"&nologo=true"
        )

        try:
            async with httpx.AsyncClient(timeout=90.0, follow_redirects=True) as client:
                response = await client.get(url)

                if response.status_code == 200 and len(response.content) > 1000:
                    img_str = base64.b64encode(response.content).decode("utf-8")
                    content_type = response.headers.get("content-type", "image/jpeg")
                    return f"data:{content_type};base64,{img_str}"
                else:
                    print(f"Pollinations returned status {response.status_code} for engine '{engine}'")
                    return None

        except Exception as e:
            print(f"Pollinations request failed for engine '{engine}': {e}")
            return None

    async def generate_batch(
        self,
        sub_prompts: list,
        engine: str = "cinematic",
        guidance: float = 7.5,
        steps: int = 30,
    ) -> list:
        """
        Generate multiple images with staggered timing to avoid rate limits.
        """
        results = []
        for i, prompt in enumerate(sub_prompts):
            if i > 0:
                await asyncio.sleep(0.5)  # Stagger requests to avoid 429
            result = await self.generate_single(prompt, engine, guidance, steps)
            if result:
                results.append(result)
        return results
