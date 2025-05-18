// Keyword extractor functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeKeywordExtractor();
});

let keywordChart = null;

function initializeKeywordExtractor() {
    // Set up event listeners
    document.getElementById('textInput')?.addEventListener('input', handleTextInput);
    document.getElementById('extractBtn')?.addEventListener('click', extractKeywords);
    document.getElementById('clearBtn')?.addEventListener('click', clearText);
    document.getElementById('copyBtn')?.addEventListener('click', copyText);
    document.getElementById('downloadBtn')?.addEventListener('click', downloadResults);

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    // Initialize settings listeners
    document.getElementById('extractionMode')?.addEventListener('change', handleSettingsChange);
    document.getElementById('language')?.addEventListener('change', handleSettingsChange);
    document.getElementById('maxKeywords')?.addEventListener('input', updateMaxKeywordsValue);
    
    const checkboxes = ['includeTopics', 'includeEntities', 'includeRelevance'];
    checkboxes.forEach(id => {
        document.getElementById(id)?.addEventListener('change', handleSettingsChange);
    });

    // Initialize empty chart
    initializeKeywordChart();
}

function handleTextInput(e) {
    const text = e.target.value;
    if (text.length > 100) { // Auto-extract after 100 characters
        extractKeywords();
    }
}

function handleSettingsChange() {
    if (document.getElementById('textInput').value.trim()) {
        extractKeywords();
    }
}

function updateMaxKeywordsValue(e) {
    const value = e.target.value;
    document.getElementById('maxKeywordsValue').textContent = `${value} keywords`;
}

async function extractKeywords() {
    const text = document.getElementById('textInput').value.trim();
    if (!text) {
        showToast('Please enter some text to analyze', 'warning');
        return;
    }

    const settings = {
        mode: document.getElementById('extractionMode').value,
        language: document.getElementById('language').value,
        maxKeywords: parseInt(document.getElementById('maxKeywords').value),
        includeTopics: document.getElementById('includeTopics').checked,
        includeEntities: document.getElementById('includeEntities').checked,
        includeRelevance: document.getElementById('includeRelevance').checked
    };

    showLoadingOverlay('Extracting keywords...');

    try {
        // Simulated API call - Replace with actual keyword extraction API
        const results = await analyzeText(text, settings);
        displayResults(results);
        showToast('Keyword extraction completed', 'success');
    } catch (error) {
        console.error('Keyword extraction failed:', error);
        showToast('Failed to extract keywords. Please try again.', 'error');
    } finally {
        hideLoadingOverlay();
    }
}

async function analyzeText(text, settings) {
    // Simulated API response - Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // Sample analysis results
            const results = {
                keywords: [
                    { text: 'artificial intelligence', relevance: 0.95, frequency: 12 },
                    { text: 'machine learning', relevance: 0.90, frequency: 8 },
                    { text: 'data analysis', relevance: 0.85, frequency: 6 },
                    { text: 'neural networks', relevance: 0.80, frequency: 5 },
                    { text: 'deep learning', relevance: 0.75, frequency: 4 }
                ],
                topics: [
                    {
                        name: 'AI Technology',
                        keywords: ['artificial intelligence', 'machine learning', 'neural networks'],
                        relevance: 0.9
                    },
                    {
                        name: 'Data Science',
                        keywords: ['data analysis', 'statistics', 'visualization'],
                        relevance: 0.8
                    }
                ],
                entities: [
                    { text: 'TensorFlow', type: 'TECHNOLOGY', relevance: 0.9 },
                    { text: 'Python', type: 'TECHNOLOGY', relevance: 0.85 },
                    { text: 'Google', type: 'ORGANIZATION', relevance: 0.8 }
                ]
            };
            resolve(results);
        }, 1500);
    });
}

function displayResults(results) {
    // Update keywords chart
    updateKeywordChart(results.keywords);

    // Display keywords
    displayKeywords(results.keywords);

    // Display topic clusters if enabled
    if (document.getElementById('includeTopics').checked) {
        displayTopicClusters(results.topics);
    }

    // Display named entities if enabled
    if (document.getElementById('includeEntities').checked) {
        displayEntities(results.entities);
    }
}

function initializeKeywordChart() {
    const ctx = document.getElementById('keywordChart');
    keywordChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Keyword Relevance',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

function updateKeywordChart(keywords) {
    if (!keywordChart) return;

    const sortedKeywords = [...keywords].sort((a, b) => b.relevance - a.relevance);
    const labels = sortedKeywords.map(k => k.text);
    const data = sortedKeywords.map(k => k.relevance);

    keywordChart.data.labels = labels;
    keywordChart.data.datasets[0].data = data;
    keywordChart.update();
}

function displayKeywords(keywords) {
    const container = document.getElementById('keywordsContainer');
    const showRelevance = document.getElementById('includeRelevance').checked;

    container.innerHTML = keywords
        .sort((a, b) => b.relevance - a.relevance)
        .map(keyword => `
            <span class="keyword-badge bg-primary bg-opacity-10 text-primary border border-primary">
                ${keyword.text}
                ${showRelevance ? `<span class="relevance-score">(${Math.round(keyword.relevance * 100)}%)</span>` : ''}
            </span>
        `).join('');
}

function displayTopicClusters(topics) {
    const container = document.getElementById('topicClustersContainer');
    if (!topics.length) {
        container.innerHTML = '<p class="text-muted">No topic clusters detected</p>';
        return;
    }

    container.innerHTML = topics.map(topic => `
        <div class="topic-cluster">
            <h6 class="mb-2">${topic.name} 
                <small class="text-muted">(${Math.round(topic.relevance * 100)}%)</small>
            </h6>
            <div>
                ${topic.keywords.map(keyword => `
                    <span class="badge bg-secondary me-1">${keyword}</span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function displayEntities(entities) {
    const container = document.getElementById('entitiesContainer');
    if (!entities.length) {
        container.innerHTML = '<p class="text-muted">No named entities detected</p>';
        return;
    }

    const entityColors = {
        PERSON: 'primary',
        ORGANIZATION: 'success',
        LOCATION: 'warning',
        TECHNOLOGY: 'info',
        EVENT: 'secondary',
        OTHER: 'dark'
    };

    container.innerHTML = entities
        .sort((a, b) => b.relevance - a.relevance)
        .map(entity => `
            <span class="keyword-badge bg-${entityColors[entity.type] || 'secondary'} bg-opacity-10 
                         text-${entityColors[entity.type] || 'secondary'} 
                         border border-${entityColors[entity.type] || 'secondary'}">
                ${entity.text}
                <small class="ms-1">(${entity.type})</small>
            </span>
        `).join('');
}

function clearText() {
    document.getElementById('textInput').value = '';
    document.getElementById('keywordsContainer').innerHTML = '';
    document.getElementById('topicClustersContainer').innerHTML = '';
    document.getElementById('entitiesContainer').innerHTML = '';
    
    if (keywordChart) {
        keywordChart.data.labels = [];
        keywordChart.data.datasets[0].data = [];
        keywordChart.update();
    }
}

function copyText() {
    const text = document.getElementById('textInput');
    text.select();
    document.execCommand('copy');
    showToast('Text copied to clipboard', 'success');
}

function downloadResults() {
    const text = document.getElementById('textInput').value;
    const keywords = document.getElementById('keywordsContainer').textContent;
    const topics = document.getElementById('topicClustersContainer').textContent;
    const entities = document.getElementById('entitiesContainer').textContent;

    const content = `Keyword Extraction Results\n\n` +
                   `Text:\n${text}\n\n` +
                   `Keywords:\n${keywords}\n\n` +
                   `Topic Clusters:\n${topics}\n\n` +
                   `Named Entities:\n${entities}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-extraction.txt';
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