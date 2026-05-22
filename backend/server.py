from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import time

from gemini_translator import get_translator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "auto"
    target_lang: str = "en"

translator = None

@app.on_event("startup")
async def startup():
    global translator
    print("\n" + "="*40)
    print("🤖 TRANSLATION SERVER")
    print("="*40)
    translator = get_translator()
    print("\n✅ Server on http://localhost:8000\n")

@app.get("/")
async def root():
    return {"status": "running"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/translate")
async def translate(req: TranslateRequest):
    if not req.text:
        raise HTTPException(400, "Text required")
    
    start = time.time()
    result = translator.translate(req.text, req.source_lang, req.target_lang)
    
    return {
        "translated_text": result['translated_text'],
        "source_lang": result['source_lang'],
        "target_lang": result['target_lang'],
        "processing_time_ms": round((time.time() - start) * 1000, 2)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)