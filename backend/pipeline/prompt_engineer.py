import google.generativeai as genai
import json
import re

class PromptEngineer:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-flash-lite-latest')

    async def expand_prompt(self, user_input: str, count: int):
        """
        Takes a short user aesthetic input and expands it into a JSON object 
        containing detailed prompts, negative prompts, and stylistic reasoning.
        """
        system_prompt = f"""
        You are a master cinematic moodboard curator and Generative AI researcher.
        Your goal is to take a brief aesthetic keyword and expand it into {count} distinct, high-fidelity visual prompts for Stable Diffusion.
        
        You must return a JSON object with three fields:
        1. 'prompts': A list of {count} detailed strings focusing on composition, lighting, and texture.
        2. 'reasoning': A brief (1-2 sentence) technical explanation of why these stylistic choices were made to match the user's intent.
        3. 'negative_prompt': A string of unwanted elements specifically tailored to this aesthetic (e.g., if 'minimalist', negative should include 'clutter, busy').
        
        Guidelines for prompts:
        - Focus on composition, lighting, texture, and mood.
        - Use descriptive adjectives (e.g., 'tactile', 'ethereal', 'liminal', 'noir').
        - Specify photography style if relevant (e.g., '35mm film grain').
        
        Return ONLY valid JSON. No extra text.
        """
        
        prompt = f"User Aesthetic: '{user_input}'\nGenerate {count} unique, cohesive, high-quality visual prompts in the required JSON format."
        
        try:
            # Using current stable model
            self.model = genai.GenerativeModel('gemini-1.5-flash-latest')
            response = self.model.generate_content([system_prompt, prompt])
            
            # Extract JSON from the response text
            match = re.search(r'\{.*\}', response.text, re.DOTALL)
            if match:
                data = json.loads(match.group(0))
                # Ensure all fields exist
                return {
                    "prompts": data.get("prompts", [user_input] * count),
                    "reasoning": data.get("reasoning", "Extending aesthetic based on core visual principles."),
                    "negative_prompt": data.get("negative_prompt", "blurry, low quality, distorted, text, watermark")
                }
            else:
                print("Could not find JSON object in Gemini response. Using fallback.")
                return self._fallback_response(user_input, count)
        except Exception as e:
            print(f"Gemini expansion failed or quota exceeded: {e}. Falling back.")
            return self._fallback_response(user_input, count)

    def _fallback_response(self, user_input: str, count: int):
        return {
            "prompts": [f"{user_input}, high quality, cinematic, aesthetic" for _ in range(count)],
            "reasoning": "Standard aesthetic enhancement applied due to AI processing constraints.",
            "negative_prompt": "blurry, low quality, distorted, text, watermark"
        }
