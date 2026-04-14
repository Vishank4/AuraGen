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

class GenerateResponse(BaseModel):
    prompt: str
    images: List[str]
    layout: str
    imageCount: int
    aspectRatio: str

@app.get("/")
def read_root():
    return {"message": "AuraGen API is running"}

@app.post("/api/generate", response_model=GenerateResponse)
async def generate_moodboard(request: GenerateRequest):
    GEMINI_KEY = os.getenv("GEMINI_API_KEY")
    HF_KEY = os.getenv("HUGGINGFACE_API_KEY")

    if not GEMINI_KEY or not HF_KEY:
        print("API Keys missing in environment. Running in MOCK mode.")
        await asyncio.sleep(2)
        mock_images = [f"https://picsum.photos/seed/{i+200}/800/800" for i in range(request.count)]
        return GenerateResponse(
            prompt=request.prompt,
            images=mock_images,
            layout=request.layout,
            imageCount=request.count,
            aspectRatio=request.aspect_ratio
        )

    try:
        # 1. Expand prompt using Gemini
        engineer = PromptEngineer(GEMINI_KEY)
        sub_prompts = await engineer.expand_prompt(request.prompt, request.count)
        print(f"Sub-prompts generated: {sub_prompts}")

        # 2. Generate images using Hugging Face (returns Base64 strings)
        generator = ImageGenerator(HF_KEY)
        images = await generator.generate_batch(sub_prompts)
        
        return GenerateResponse(
            prompt=request.prompt,
            images=images,
            layout=request.layout,
            imageCount=len(images),
            aspectRatio=request.aspect_ratio
        )
    except Exception as e:
        print(f"Pipeline error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Render provides the port via the PORT environment variable
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
