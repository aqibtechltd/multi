// Grammar checker functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeGrammarChecker();
});

function initializeGrammarChecker() {
    // Set up event listeners
    document.getElementById('textInput')?.addEventListener('input', handleTextInput);
    document.getElementById('checkBtn')?.addEventListener('click', checkGrammar);
    document.getElementById('clearBtn')?.addEventListener('click', clearText);
    document.getElementById('copyBtn')?.addEventListener('click', copyText);
    document.getElementById('downloadBtn')?.addEventListener('click', downloadText);

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    // Initialize settings listeners
    document.getElementById('writingStyle')?.addEventListener('change', checkGrammar);
    document.getElementById('languageVariety')?.addEventListener('change', checkGrammar);
    
    const checkboxes = ['checkGrammar', 'checkSpelling', 'checkPunctuation', 'checkStyle'];
    checkboxes.forEach(id => {
        document.getElementById(id)?.addEventListener('change', checkGrammar);
    });
}

function handleTextInput(e) {
    const text = e.target.value;
    updateTextStatistics(text);
}

function updateTextStatistics(text) {
    // Update word count
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('wordCount').textContent = words;

    // Update character count
    const chars = text.length;
    document.getElementById('charCount').textContent = chars;

    // Update sentence count
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    document.getElementById('sentenceCount').textContent = sentences;

    // Calculate and update readability score
    const readabilityScore = calculateReadabilityScore(text);
    document.getElementById('readabilityScore').textContent = readabilityScore;
}

function calculateReadabilityScore(text) {
    if (!text.trim()) return 0;

    const words = text.trim().split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const syllables = countSyllables(text);

    // Flesch Reading Ease score calculation
    const wordsPerSentence = words / sentences;
    const syllablesPerWord = syllables / words;
    const score = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);

    return Math.max(0, Math.min(100, Math.round(score)));
}

function countSyllables(text) {
    const words = text.toLowerCase().split(/\s+/);
    return words.reduce((total, word) => {
        return total + countWordSyllables(word);
    }, 0);
}

function countWordSyllables(word) {
    word = word.toLowerCase();
    word = word.replace(/[^a-z]/g, '');
    
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
}

async function checkGrammar() {
    const text = document.getElementById('textInput').value.trim();
    if (!text) {
        showToast('Please enter some text to check', 'warning');
        return;
    }

    const settings = {
        style: document.getElementById('writingStyle').value,
        language: document.getElementById('languageVariety').value,
        checks: {
            grammar: document.getElementById('checkGrammar').checked,
            spelling: document.getElementById('checkSpelling').checked,
            punctuation: document.getElementById('checkPunctuation').checked,
            style: document.getElementById('checkStyle').checked
        }
    };

    showLoadingOverlay('Analyzing your text...');

    try {
        // Simulated API call - Replace with actual grammar checking API
        const suggestions = await analyzeText(text, settings);
        displaySuggestions(suggestions);
        showToast('Grammar check completed', 'success');
    } catch (error) {
        console.error('Grammar check failed:', error);
        showToast('Failed to check grammar. Please try again.', 'error');
    } finally {
        hideLoadingOverlay();
    }
}

async function analyzeText(text, settings) {
    // Simulated API response - Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // Sample suggestions
            const suggestions = [
                {
                    type: 'grammar',
                    severity: 'error',
                    message: 'Subject-verb agreement error',
                    context: 'The students is studying',
                    suggestion: 'The students are studying',
                    explanation: 'Use plural verb form with plural subjects'
                },
                {
                    type: 'spelling',
                    severity: 'error',
                    message: 'Possible spelling mistake',
                    context: 'recieved',
                    suggestion: 'received',
                    explanation: 'Remember: i before e, except after c'
                },
                {
                    type: 'punctuation',
                    severity: 'warning',
                    message: 'Missing comma in compound sentence',
                    context: 'He ran fast but he missed the bus',
                    suggestion: 'He ran fast, but he missed the bus',
                    explanation: 'Use a comma before coordinating conjunctions'
                },
                {
                    type: 'style',
                    severity: 'suggestion',
                    message: 'Wordy expression',
                    context: 'at this point in time',
                    suggestion: 'now',
                    explanation: 'Use concise language for clarity'
                }
            ];
            resolve(suggestions);
        }, 1500);
    });
}

function displaySuggestions(suggestions) {
    const container = document.getElementById('suggestionsContainer');
    if (!suggestions.length) {
        container.innerHTML = '<p class="text-success text-center mb-0">No issues found in your text!</p>';
        return;
    }

    container.innerHTML = suggestions.map((suggestion, index) => `
        <div class="correction-card p-3 ${suggestion.severity}-highlight">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="mb-0">${suggestion.message}</h6>
                <span class="badge bg-${getBadgeColor(suggestion.severity)}">${suggestion.type}</span>
            </div>
            <p class="mb-2"><small class="text-muted">Context:</small> "${suggestion.context}"</p>
            <p class="mb-2"><small class="text-muted">Suggestion:</small> "${suggestion.suggestion}"</p>
            <p class="mb-0"><small class="text-muted">${suggestion.explanation}</small></p>
            <button class="btn btn-sm btn-outline-primary mt-2" onclick="applySuggestion(${index})">
                Apply Suggestion
            </button>
        </div>
    `).join('');
}

function getBadgeColor(severity) {
    switch (severity) {
        case 'error': return 'danger';
        case 'warning': return 'warning';
        case 'suggestion': return 'info';
        default: return 'secondary';
    }
}

function applySuggestion(index) {
    // This would be implemented to apply the suggestion to the text
    showToast('Suggestion applied', 'success');
}

function clearText() {
    document.getElementById('textInput').value = '';
    document.getElementById('suggestionsContainer').innerHTML = 
        '<p class="text-muted text-center mb-0">Click "Check Grammar" to see suggestions</p>';
    updateTextStatistics('');
}

function copyText() {
    const text = document.getElementById('textInput');
    text.select();
    document.execCommand('copy');
    showToast('Text copied to clipboard', 'success');
}

function downloadText() {
    const text = document.getElementById('textInput').value;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'checked-text.txt';
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
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
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