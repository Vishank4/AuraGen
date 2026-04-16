# AuraGen Project Documentation

AuraGen is a premium, AI-driven moodboard generator that bridges the gap between raw aesthetic intent and high-fidelity visual assets. This document serves as a complete technical summary of the project.

---

## 1. Core Concept
AuraGen takes a simple user aesthetic input (e.g., "Neo-Noir Rainy Seoul") and uses a multi-modal AI pipeline to expand that idea into a cohesive set of cinematic visual prompts, which are then rendered into high-quality moodboards using Stable Diffusion.

---

## 2. Technical Stack

### **Frontend (The Interface)**
*   **Framework:** React 19 + Vite (for lightning-fast development and optimized builds).
*   **Animations:** `framer-motion` (used for smooth transitions, layout changes, and interactive micro-animations).
*   **Icons:** `lucide-react` (modern, minimalist iconography).
*   **Canvas Export:** `html2canvas` (allows users to download their generated moodboards as single image files).
*   **Styling:** Modern Vanilla CSS with high-end aesthetics (Dark mode, Glassmorphism, CSS Variables for theme switching).

### **Backend (The Engine)**
*   **Framework:** FastAPI (Python) – high-performance, asynchronous REST API.
*   **Server:** Uvicorn (ASGI server).
*   **Validation:** Pydantic (strict type checking for AI responses).
*   **Security:** CORS middleware configured for cross-domain production (Vercel -> Render).

### **AI Pipeline**
*   **Prompt Engineering:** **Google Gemini 1.5 Flash** (Handles aesthetic expansion, turning 3 words into 4 cinematic descriptions).
*   **Image Generation:** **Stable Diffusion XL 1.0 (via Hugging Face)** (Generates high-fidelity 1024x1024 visual assets).
*   **Data Handling:** **Base64 Encoding** (Images are streamed as data strings, making the backend completely ephemeral and serverless-ready).

---

## 3. Premium UI/UX Features

### **Visual Effects**
- **Background Fluid:** A custom-built Canvas/SVG background with dynamic, moving particles.
- **Domino Flash:** Interactive UI elements that react to hover with a cascading animation effect.
- **Shatter Text:** Specialized text animations for headings that add a "premium" feel.
- **Bento Grid:** A responsive, structured grid system for displaying generated assets in various layouts (Row, Grid, Hero).

### **Interactive Controls**
- **Dynamic Proportions:** Real-time aspect ratio switching (1:1, 16:9, 4:3, etc.) without page reloads.
- **Live Layout Engine:** Instantly switch between "Grid", "Hero", and "Row" arrangements.
- **History Panel:** A sidebar to track your current session tasks.

---

## 4. Backend Logic & Reliability
- **Graceful Fallback:** If the Gemini API hits a quota limit, the [PromptEngineer](file:///d:/Files/GEN%20AI%20CSET419/moodgen/backend/pipeline/prompt_engineer.py) automatically uses the user's raw prompt with aesthetic "boosters," ensuring the generation never breaks.
- **Unified Router:** The [ImageGenerator](file:///d:/Files/GEN%20AI%20CSET419/moodgen/backend/pipeline/image_generator.py) uses the latest `huggingface_hub` master client to handle API routing automatically.

---

## 5. Deployment Architecture
- **Source Control:** GitHub ([Vishank4/AuraGen](https://github.com/Vishank4/AuraGen)).
- **Frontend Hosting:** Vercel (CD/CI enabled, auto-rebuilds on push).
- **Backend Hosting:** Render (Web Service auto-deploy from GitHub).
- **Inter-service Auth:** Secured via Environment Variables (`VITE_API_BASE_URL`).

---

## 6. Future Roadmap
- **Community Gallery:** A database-backed feature to save and share boards publicly.
- **Color Palette Extraction:** Logic to extract primary hex codes from generated images.
- **Custom Model Selection:** Allowing users to switch between different SDXL LoRAs (e.g., Anime, Architectural, Interior Design).

---
*Created with care for the AuraGen Launch — April 14, 2026*
