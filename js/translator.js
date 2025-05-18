// Language detection and translation functionality
let currentMode = 'text';
let translationHistory = [];
const MAX_HISTORY_ITEMS = 10;

// Initialize the translator
document.addEventListener('DOMContentLoaded', () => {
    initializeTranslator();
    loadTranslationHistory();
});

function initializeTranslator() {
    // Set up event listeners
    document.getElementById('sourceText')?.addEventListener('input', handleInputChange);
    document.getElementById('translateBtn')?.addEventListener('click', handleTranslation);
    document.getElementById('clearBtn')?.addEventListener('click', clearTranslation);
    document.getElementById('copySourceBtn')?.addEventListener('click', () => copyText('sourceText'));
    document.getElementById('copyTranslationBtn')?.addEventListener('click', () => copyText('translatedText'));
    document.getElementById('downloadBtn')?.addEventListener('click', downloadTranslation);
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
}

function handleInputChange(e) {
    const text = e.target.value;
    updateCharacterCount('sourceCharCount', text);
    if (document.getElementById('sourceLanguage').value === 'auto') {
        detectLanguage(text);
    }
}

function updateCharacterCount(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        element.textContent = `${charCount} characters, ${wordCount} words`;
    }
}

async function detectLanguage(text) {
    if (!text.trim()) return;
    
    try {
        // Simulated language detection - Replace with actual API call
        const detectedLang = 'en'; // Example result
        showDetectedLanguage(detectedLang);
    } catch (error) {
        console.error('Language detection failed:', error);
    }
}

function showDetectedLanguage(langCode) {
    const detectedLangElement = document.getElementById('detectedLanguage');
    if (detectedLangElement) {
        const langName = getLanguageName(langCode);
        detectedLangElement.textContent = `Detected: ${langName}`;
        detectedLangElement.style.display = 'block';
    }
}

function getLanguageName(langCode) {
    const languages = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'hi': 'Hindi'
    };
    return languages[langCode] || langCode;
}

async function handleTranslation() {
    const sourceText = document.getElementById('sourceText').value.trim();
    if (!sourceText) {
        showToast('Please enter text to translate', 'warning');
        return;
    }

    const sourceLang = document.getElementById('sourceLanguage').value;
    const targetLang = document.getElementById('targetLanguage').value;

    showLoadingOverlay('Translating your content...');

    try {
        // Simulated translation - Replace with actual API call
        const translatedText = await translateText(sourceText, sourceLang, targetLang);
        displayTranslation(translatedText);
        addToHistory(sourceText, translatedText, sourceLang, targetLang);
        showToast('Translation completed successfully', 'success');
    } catch (error) {
        console.error('Translation failed:', error);
        showToast('Translation failed. Please try again.', 'error');
    } finally {
        hideLoadingOverlay();
    }
}

async function translateText(text, sourceLang, targetLang) {
    // Simulated API call - Replace with actual translation API
    return new Promise((resolve) => {
        setTimeout(() => {
            // This is a placeholder. Replace with actual API integration
            resolve(`Translated: ${text}`);
        }, 1000);
    });
}

function displayTranslation(text) {
    const translatedTextArea = document.getElementById('translatedText');
    if (translatedTextArea) {
        translatedTextArea.value = text;
        updateCharacterCount('translatedCharCount', text);
    }
}

function addToHistory(sourceText, translatedText, sourceLang, targetLang) {
    const historyItem = {
        sourceText,
        translatedText,
        sourceLang,
        targetLang,
        timestamp: new Date().toISOString()
    };

    translationHistory.unshift(historyItem);
    if (translationHistory.length > MAX_HISTORY_ITEMS) {
        translationHistory.pop();
    }

    saveTranslationHistory();
    updateHistoryDisplay();
}

function saveTranslationHistory() {
    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
}

function loadTranslationHistory() {
    const saved = localStorage.getItem('translationHistory');
    if (saved) {
        translationHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
}

function updateHistoryDisplay() {
    const historyContainer = document.getElementById('translationHistory');
    if (!historyContainer) return;

    historyContainer.innerHTML = translationHistory.map((item, index) => `
        <div class="history-item" onclick="loadHistoryItem(${index})">
            <div class="d-flex justify-content-between">
                <small class="text-muted">${new Date(item.timestamp).toLocaleString()}</small>
                <small>${getLanguageName(item.sourceLang)} → ${getLanguageName(item.targetLang)}</small>
            </div>
            <div class="text-truncate">${item.sourceText}</div>
        </div>
    `).join('');
}

function loadHistoryItem(index) {
    const item = translationHistory[index];
    if (!item) return;

    document.getElementById('sourceText').value = item.sourceText;
    document.getElementById('translatedText').value = item.translatedText;
    document.getElementById('sourceLanguage').value = item.sourceLang;
    document.getElementById('targetLanguage').value = item.targetLang;

    updateCharacterCount('sourceCharCount', item.sourceText);
    updateCharacterCount('translatedCharCount', item.translatedText);
}

function selectMode(element) {
    // Remove active class from all mode cards
    document.querySelectorAll('.mode-card').forEach(card => card.classList.remove('active'));
    // Add active class to selected mode
    element.classList.add('active');
    currentMode = element.dataset.mode;
    
    // Show/hide relevant interface elements based on mode
    updateInterface();
}

function updateInterface() {
    const textInterface = document.getElementById('textTranslation');
    const documentInterface = document.getElementById('documentTranslation');
    const websiteInterface = document.getElementById('websiteTranslation');

    if (textInterface) textInterface.style.display = currentMode === 'text' ? 'block' : 'none';
    if (documentInterface) documentInterface.style.display = currentMode === 'document' ? 'block' : 'none';
    if (websiteInterface) websiteInterface.style.display = currentMode === 'website' ? 'block' : 'none';
}

function swapLanguages() {
    const sourceLang = document.getElementById('sourceLanguage');
    const targetLang = document.getElementById('targetLanguage');
    const sourceText = document.getElementById('sourceText');
    const translatedText = document.getElementById('translatedText');

    // Swap languages
    [sourceLang.value, targetLang.value] = [targetLang.value, sourceLang.value];
    
    // Swap text if there's a translation
    if (translatedText.value) {
        [sourceText.value, translatedText.value] = [translatedText.value, sourceText.value];
        updateCharacterCount('sourceCharCount', sourceText.value);
        updateCharacterCount('translatedCharCount', translatedText.value);
    }
}

function clearTranslation() {
    document.getElementById('sourceText').value = '';
    document.getElementById('translatedText').value = '';
    document.getElementById('sourceCharCount').textContent = '0 characters, 0 words';
    document.getElementById('translatedCharCount').textContent = '0 characters, 0 words';
    document.getElementById('detectedLanguage').style.display = 'none';
}

function copyText(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.select();
    document.execCommand('copy');
    showToast('Text copied to clipboard', 'success');
}

function downloadTranslation() {
    const sourceText = document.getElementById('sourceText').value;
    const translatedText = document.getElementById('translatedText').value;
    const sourceLang = getLanguageName(document.getElementById('sourceLanguage').value);
    const targetLang = getLanguageName(document.getElementById('targetLanguage').value);

    const content = `Source (${sourceLang}):\n${sourceText}\n\nTranslation (${targetLang}):\n${translatedText}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showLoadingOverlay(message) {
    const overlay = document.getElementById('loadingOverlay');
    const status = document.getElementById('loadingStatus');
    if (status) status.textContent = message;
    if (overlay) overlay.style.display = 'flex';
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    const container = document.querySelector('.toast-container') || createToastContainer();
    container.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => {
        container.removeChild(toast);
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
} 