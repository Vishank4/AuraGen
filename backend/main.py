import os
import asyncio
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List, Optional

from pipeline.prompt_engineer import PromptEngineer
from pipeline.image_generator import ImageGenerator

load_dotenv()

app = FastAPI(title="AuraGen Backend API")

# Configure CORS for production - using "*" to ensure smoothness across different deploy URLs
# In a strict production environment, you would list your specific Vercel URL here.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    prompt: str
    count: int
    layout: str
    aspect_ratio: str
    engine: Optional[str] = "cinematic"
    guidance: Optional[float] = 7.5
    steps: Optional[int] = 30

class GenerateResponse(BaseModel):
    prompt: str
    images: List[str]
    layout: str
    imageCount: int
    aspectRatio: str
    reasoning: Optional[str] = ""

@app.get("/")
def read_root():
    return {"message": "AuraGen API is running"}

@app.post("/api/generate", response_model=GenerateResponse)
async def generate_moodboard(request: GenerateRequest):
    GEMINI_KEY = os.getenv("GEMINI_API_KEY")

    try:
        # 1. Expand prompt using Gemini (returns structured data with reasoning)
        if GEMINI_KEY:
            engineer = PromptEngineer(GEMINI_KEY)
            expansion_data = await engineer.expand_prompt(request.prompt, request.count)
        else:
            # Fallback if no Gemini key: use raw prompts
            print("GEMINI_API_KEY not set. Using raw prompts.")
            expansion_data = {
                "prompts": [f"{request.prompt}, high quality, cinematic, detailed" for _ in range(request.count)],
                "reasoning": "Direct prompt mode (no Gemini key configured).",
                "negative_prompt": "blurry, low quality, distorted"
            }

        sub_prompts = expansion_data["prompts"]
        reasoning = expansion_data["reasoning"]
        
        print(f"Sub-prompts generated: {sub_prompts}")
        print(f"Reasoning: {reasoning}")

        # 2. Generate images using Pollinations.ai (no API key needed, always free)
        generator = ImageGenerator()
        images = await generator.generate_batch(
            sub_prompts, 
            engine=request.engine, 
            guidance=request.guidance, 
            steps=request.steps
        )
        
        return GenerateResponse(
            prompt=request.prompt,
            images=images,
            layout=request.layout,
            imageCount=len(images),
            aspectRatio=request.aspect_ratio,
            reasoning=reasoning
        )
    except Exception as e:
        print(f"Pipeline error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Render provides the port via the PORT environment variable
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
