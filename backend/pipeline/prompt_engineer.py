import google.generativeai as genai
import json
import re

class PromptEngineer:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-flash-lite-latest')

    async def expand_prompt(self, user_input: str, count: int):
        """
        Takes a short user aesthetic input and expands it into a JSON list of detailed prompts.
        """
        system_prompt = f"""
        You are a master cinematic moodboard curator. 
        Your goal is to take a brief aesthetic keyword and expand it into {count} distinct, high-fidelity visual prompts for Stable Diffusion XL.
        
        Guidelines for each prompt:
        - Focus on composition, lighting, texture, and mood.
        - Use descriptive adjectives (e.g., 'tactile', 'ethereal', 'liminal', 'noir').
        - Specify photography style if relevant (e.g., '35mm film grain', 'macro photography', 'anamorphic lens flare').
        - Avoid generic terms; be specific about materials (e.g., 'distressed leather', 'cracked obsidian').
        - Ensure all {count} prompts work together to form a cohesive narrative.
        
        Return ONLY a JSON list of strings. No extra text.
        """
        
        prompt = f"User Aesthetic: '{user_input}'\nGenerate {count} unique, cohesive, high-quality visual prompts."
        
        try:
            # Re-initializing with a broadly available model name
            self.model = genai.GenerativeModel('gemini-1.5-flash-latest')
            response = self.model.generate_content([system_prompt, prompt])
            
            # Extract JSON from the response text
            match = re.search(r'\[.*\]', response.text, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            else:
                print("Could not find JSON list in Gemini response. Using fallback.")
                return [user_input] * count
        except Exception as e:
            print(f"Gemini expansion failed or quota exceeded: {e}. Falling back to raw prompt.")
            return [f"{user_input}, high quality, cinematic, aesthetic" for _ in range(count)]
