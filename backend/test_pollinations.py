"""
Test script: Verify Pollinations.ai API reliability across all engine types.
Pollinations requires NO API key and is free forever.
"""
import asyncio
import httpx
import time
import urllib.parse

ENGINES = {
    "cinematic": "flux",
    "photoreal": "flux-realism",
    "digital_art": "flux-anime",
    "minimalist": "flux-3d"
}

async def test_engine(engine_name, model):
    prompt = "a beautiful sunset over mountains, cinematic, 8k"
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=1024&height=1024&model={model}&nologo=true&seed=42"
    
    print(f"\n[{engine_name}] Testing model '{model}'...")
    
    start = time.time()
    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.get(url)
            elapsed = time.time() - start
            
            if response.status_code == 200:
                size_kb = len(response.content) / 1024
                content_type = response.headers.get("content-type", "unknown")
                print(f"  PASS in {elapsed:.1f}s | Size: {size_kb:.0f}KB | Type: {content_type}")
                return True
            else:
                print(f"  FAIL with status {response.status_code} in {elapsed:.1f}s")
                return False
    except Exception as e:
        elapsed = time.time() - start
        print(f"  ERROR after {elapsed:.1f}s: {e}")
        return False

async def main():
    print("=" * 50)
    print("POLLINATIONS.AI RELIABILITY TEST")
    print("=" * 50)
    
    results = {}
    for engine_name, model in ENGINES.items():
        results[engine_name] = await test_engine(engine_name, model)
    
    print("\n" + "=" * 50)
    print("RESULTS")
    print("=" * 50)
    passed = sum(1 for v in results.values() if v)
    for name, ok in results.items():
        status = "PASS" if ok else "FAIL"
        print(f"  {name}: {status}")
    print(f"\n  Total: {passed}/{len(results)} engines working")

if __name__ == "__main__":
    asyncio.run(main())
