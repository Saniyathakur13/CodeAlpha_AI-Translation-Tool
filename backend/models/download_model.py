#!/usr/bin/env python3
"""
Model download script for MarianMT translation models.
Downloads pre-trained transformer models from Hugging Face.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

def download_marian_model(model_name="Helsinki-NLP/opus-mt-en-es"):
    """
    Download MarianMT model from Hugging Face
    
    Available models:
    - Helsinki-NLP/opus-mt-en-es (English to Spanish)
    - Helsinki-NLP/opus-mt-en-fr (English to French)
    - Helsinki-NLP/opus-mt-en-de (English to German)
    - Helsinki-NLP/opus-mt-en-zh (English to Chinese)
    - Helsinki-NLP/opus-mt-en-ja (English to Japanese)
    - Helsinki-NLP/opus-mt-mul-en (Multiple to English)
    """
    
    print(f"🔄 Downloading model: {model_name}")
    print("⏳ This may take a few minutes depending on your internet connection...")
    
    try:
        from transformers import MarianMTModel, MarianTokenizer
        
        # Download tokenizer
        print("📥 Downloading tokenizer...")
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        
        # Download model
        print("📥 Downloading model weights...")
        model = MarianMTModel.from_pretrained(model_name)
        
        # Save to local cache
        cache_dir = Path.home() / ".cache" / "huggingface" / "transformers"
        print(f"✅ Model saved to: {cache_dir}")
        
        # Test the model with a sample
        print("\n🧪 Testing model with sample translation...")
        sample_text = "Hello, how are you?"
        inputs = tokenizer(sample_text, return_tensors="pt", padding=True, truncation=True)
        translated = model.generate(**inputs)
        result = tokenizer.batch_decode(translated, skip_special_tokens=True)
        
        print(f"📝 Test translation:")
        print(f"   Input: {sample_text}")
        print(f"   Output: {result[0]}")
        print("\n✅ Model downloaded and tested successfully!")
        
        return True
        
    except ImportError as e:
        print(f"❌ Error: Missing required packages. Please run: pip install transformers torch")
        print(f"   Error details: {e}")
        return False
    except Exception as e:
        print(f"❌ Error downloading model: {e}")
        return False

def download_multiple_models():
    """Download multiple translation models for different language pairs"""
    
    models = [
        ("Helsinki-NLP/opus-mt-en-es", "English → Spanish"),
        ("Helsinki-NLP/opus-mt-en-fr", "English → French"),
        ("Helsinki-NLP/opus-mt-en-de", "English → German"),
        ("Helsinki-NLP/opus-mt-en-zh", "English → Chinese"),
        ("Helsinki-NLP/opus-mt-en-ja", "English → Japanese"),
        ("Helsinki-NLP/opus-mt-mul-en", "Multi-language → English"),
    ]
    
    print("=" * 60)
    print("🌐 AI Translation Tool - Model Downloader")
    print("=" * 60)
    
    for model_name, description in models:
        print(f"\n📦 Downloading {description}...")
        print(f"   Model: {model_name}")
        success = download_marian_model(model_name)
        if success:
            print(f"   ✅ {description} ready!")
        else:
            print(f"   ❌ Failed to download {description}")
        print("-" * 40)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Download AI translation models")
    parser.add_argument("--model", type=str, default="Helsinki-NLP/opus-mt-en-es",
                       help="Model name from Hugging Face")
    parser.add_argument("--all", action="store_true",
                       help="Download all recommended models")
    
    args = parser.parse_args()
    
    if args.all:
        download_multiple_models()
    else:
        download_marian_model(args.model)