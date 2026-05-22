// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// DOM Elements
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const inputText = document.getElementById('inputText');
const outputDiv = document.getElementById('outputText');
const translateBtn = document.getElementById('translateBtn');
const swapBtn = document.getElementById('swapLangs');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const speakBtn = document.getElementById('speakBtn');
const stopSpeakBtn = document.getElementById('stopSpeakBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMsg = document.getElementById('errorMsg');

// Store current translation
let currentTranslatedText = '';

// Check backend
async function checkBackend() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            console.log('✅ Backend connected!');
            const statusEl = document.getElementById('modelStatus');
            if (statusEl) statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Connected';
            return true;
        }
    } catch (error) {
        console.error('Backend not running');
        const statusEl = document.getElementById('modelStatus');
        if (statusEl) statusEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Backend off';
        showError('Backend not running. Start with: python server.py');
        return false;
    }
    return false;
}

function showLoading(show) {
    if (loadingIndicator) {
        if (show) loadingIndicator.classList.remove('hidden');
        else loadingIndicator.classList.add('hidden');
    }
    if (translateBtn) translateBtn.disabled = show;
}

function showError(message) {
    if (!errorMsg) return;
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    setTimeout(() => errorMsg.classList.add('hidden'), 5000);
}

// Translate
async function translateText() {
    const text = inputText.value.trim();
    if (!text) {
        showError('Please enter text to translate');
        return;
    }
    
    showLoading(true);
    outputDiv.innerHTML = '<div class="placeholder-text">Translating...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                source_lang: sourceLang.value,
                target_lang: targetLang.value
            })
        });
        
        if (!response.ok) throw new Error('Translation failed');
        
        const result = await response.json();
        currentTranslatedText = result.translated_text;
        
        outputDiv.innerHTML = `
            <div class="translated-text" style="font-size: 1.1rem; line-height: 1.6;">
                ${escapeHtml(result.translated_text)}
            </div>
            <div class="translation-meta" style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 0.75rem; color: #6b7280;">
                ⏱️ ${result.processing_time_ms}ms | 🌐 ${result.source_lang} → ${result.target_lang}
            </div>
        `;
    } catch (error) {
        showError(error.message);
        outputDiv.innerHTML = '<div class="placeholder-text">Translation failed</div>';
        currentTranslatedText = '';
    } finally {
        showLoading(false);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Swap languages
async function swapLanguages() {
    if (sourceLang.value === 'auto') {
        showError('Cannot swap with auto-detect');
        return;
    }
    const temp = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = temp;
    if (inputText.value.trim()) await translateText();
}

// Copy
async function copyTranslation() {
    if (!currentTranslatedText) {
        showError('Nothing to copy');
        return;
    }
    try {
        await navigator.clipboard.writeText(currentTranslatedText);
        const original = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check" style="color: #10b981;"></i>';
        setTimeout(() => { copyBtn.innerHTML = original; }, 1500);
    } catch (err) {
        showError('Failed to copy');
    }
}

// SPEAK FUNCTION - WORKING VERSION
function speakTranslation() {
    const textToSpeak = currentTranslatedText || inputText.value.trim();
    
    if (!textToSpeak) {
        showError('Nothing to speak');
        return;
    }
    
    // Stop any ongoing speech
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Set language
    const langCode = currentTranslatedText ? targetLang.value : sourceLang.value;
    const voiceMap = {
        'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE',
        'it': 'it-IT', 'pt': 'pt-PT', 'ru': 'ru-RU', 'hi': 'hi-IN',
        'ar': 'ar-SA'
    };
    
    utterance.lang = voiceMap[langCode] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Visual feedback
    speakBtn.style.opacity = '0.5';
    
    utterance.onstart = () => {
        console.log('🔊 Speaking...');
    };
    
    utterance.onend = () => {
        speakBtn.style.opacity = '1';
    };
    
    utterance.onerror = () => {
        speakBtn.style.opacity = '1';
        showError('Speech failed');
    };
    
    window.speechSynthesis.speak(utterance);
}

// STOP SPEAKING FUNCTION
function stopSpeaking() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        speakBtn.style.opacity = '1';
        console.log('🔇 Stopped');
    }
}

// Clear
function clearInput() {
    inputText.value = '';
    outputDiv.innerHTML = '<div class="placeholder-text">Translation will appear here...</div>';
    currentTranslatedText = '';
    stopSpeaking();
}

// Event listeners
if (translateBtn) translateBtn.addEventListener('click', translateText);
if (swapBtn) swapBtn.addEventListener('click', swapLanguages);
if (clearBtn) clearBtn.addEventListener('click', clearInput);
if (copyBtn) copyBtn.addEventListener('click', copyTranslation);
if (speakBtn) speakBtn.addEventListener('click', speakTranslation);
if (stopSpeakBtn) stopSpeakBtn.addEventListener('click', stopSpeaking);

// Keyboard shortcut
if (inputText) {
    inputText.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            translateText();
        }
    });
}

// Initialize
checkBackend();
setInterval(checkBackend, 30000);