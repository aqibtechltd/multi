// Sentiment analyzer functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeSentimentAnalyzer();
});

let emotionChart = null;

function initializeSentimentAnalyzer() {
    // Set up event listeners
    document.getElementById('textInput')?.addEventListener('input', handleTextInput);
    document.getElementById('analyzeBtn')?.addEventListener('click', analyzeSentiment);
    document.getElementById('clearBtn')?.addEventListener('click', clearText);
    document.getElementById('copyBtn')?.addEventListener('click', copyText);
    document.getElementById('downloadBtn')?.addEventListener('click', downloadAnalysis);

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    // Initialize settings listeners
    document.getElementById('analysisMode')?.addEventListener('change', handleSettingsChange);
    document.getElementById('language')?.addEventListener('change', handleSettingsChange);
    
    const checkboxes = ['includeEmotions', 'includeKeyPhrases', 'includeSarcasm'];
    checkboxes.forEach(id => {
        document.getElementById(id)?.addEventListener('change', handleSettingsChange);
    });

    // Initialize empty chart
    initializeEmotionChart();
}

function handleTextInput(e) {
    const text = e.target.value;
    if (text.length > 10) { // Auto-analyze after 10 characters
        analyzeSentiment();
    }
}

function handleSettingsChange() {
    if (document.getElementById('textInput').value.trim()) {
        analyzeSentiment();
    }
}

async function analyzeSentiment() {
    const text = document.getElementById('textInput').value.trim();
    if (!text) {
        showToast('Please enter some text to analyze', 'warning');
        return;
    }

    const settings = {
        mode: document.getElementById('analysisMode').value,
        language: document.getElementById('language').value,
        includeEmotions: document.getElementById('includeEmotions').checked,
        includeKeyPhrases: document.getElementById('includeKeyPhrases').checked,
        includeSarcasm: document.getElementById('includeSarcasm').checked
    };

    showLoadingOverlay('Analyzing sentiment...');

    try {
        // Simulated API call - Replace with actual sentiment analysis API
        const analysis = await analyzeText(text, settings);
        displayResults(analysis);
        showToast('Analysis completed successfully', 'success');
    } catch (error) {
        console.error('Sentiment analysis failed:', error);
        showToast('Failed to analyze text. Please try again.', 'error');
    } finally {
        hideLoadingOverlay();
    }
}

async function analyzeText(text, settings) {
    // Simulated API response - Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // Sample analysis results
            const analysis = {
                sentiment: {
                    score: 75,
                    label: 'Positive',
                    confidence: 0.85
                },
                emotions: {
                    joy: 0.45,
                    sadness: 0.1,
                    anger: 0.05,
                    fear: 0.15,
                    surprise: 0.2,
                    disgust: 0.05
                },
                keyPhrases: [
                    { text: 'excellent service', sentiment: 'positive' },
                    { text: 'quick response', sentiment: 'positive' },
                    { text: 'minor issues', sentiment: 'negative' }
                ],
                sarcasm: {
                    detected: false,
                    confidence: 0.9
                }
            };
            resolve(analysis);
        }, 1500);
    });
}

function displayResults(analysis) {
    // Update sentiment score and label
    document.getElementById('sentimentScore').textContent = `${analysis.sentiment.score}%`;
    document.getElementById('sentimentLabel').textContent = analysis.sentiment.label;
    document.getElementById('sentimentProgress').style.width = `${analysis.sentiment.score}%`;

    // Update emotions chart
    updateEmotionChart(analysis.emotions);

    // Display emotion badges
    displayEmotions(analysis.emotions);

    // Display key phrases
    displayKeyPhrases(analysis.keyPhrases);
}

function initializeEmotionChart() {
    const ctx = document.getElementById('emotionChart');
    emotionChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Disgust'],
            datasets: [{
                label: 'Emotions',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

function updateEmotionChart(emotions) {
    if (!emotionChart) return;

    emotionChart.data.datasets[0].data = [
        emotions.joy,
        emotions.sadness,
        emotions.anger,
        emotions.fear,
        emotions.surprise,
        emotions.disgust
    ];
    emotionChart.update();
}

function displayEmotions(emotions) {
    const container = document.getElementById('emotionsContainer');
    const emotionColors = {
        joy: 'success',
        sadness: 'primary',
        anger: 'danger',
        fear: 'dark',
        surprise: 'warning',
        disgust: 'secondary'
    };

    container.innerHTML = Object.entries(emotions)
        .map(([emotion, value]) => `
            <span class="emotion-badge bg-${emotionColors[emotion]} bg-opacity-10 text-${emotionColors[emotion]} border border-${emotionColors[emotion]}">
                ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}: ${Math.round(value * 100)}%
            </span>
        `).join('');
}

function displayKeyPhrases(phrases) {
    const container = document.getElementById('keyPhrasesContainer');
    if (!phrases.length) {
        container.innerHTML = '<p class="text-muted">No key phrases detected</p>';
        return;
    }

    container.innerHTML = phrases.map(phrase => `
        <div class="mb-2">
            <span class="badge bg-${phrase.sentiment === 'positive' ? 'success' : 'danger'} me-2">
                ${phrase.sentiment}
            </span>
            "${phrase.text}"
        </div>
    `).join('');
}

function clearText() {
    document.getElementById('textInput').value = '';
    document.getElementById('sentimentScore').textContent = '0%';
    document.getElementById('sentimentLabel').textContent = 'Neutral';
    document.getElementById('sentimentProgress').style.width = '0%';
    document.getElementById('emotionsContainer').innerHTML = '';
    document.getElementById('keyPhrasesContainer').innerHTML = '';
    
    if (emotionChart) {
        emotionChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0];
        emotionChart.update();
    }
}

function copyText() {
    const text = document.getElementById('textInput');
    text.select();
    document.execCommand('copy');
    showToast('Text copied to clipboard', 'success');
}

function downloadAnalysis() {
    const text = document.getElementById('textInput').value;
    const sentiment = document.getElementById('sentimentLabel').textContent;
    const score = document.getElementById('sentimentScore').textContent;

    const content = `Sentiment Analysis Report\n\n` +
                   `Text:\n${text}\n\n` +
                   `Overall Sentiment: ${sentiment}\n` +
                   `Sentiment Score: ${score}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentiment-analysis.txt';
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