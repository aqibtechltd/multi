// Content rewriter functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeContentRewriter();
});

function initializeContentRewriter() {
    // Set up event listeners
    document.getElementById('textInput')?.addEventListener('input', handleTextInput);
    document.getElementById('rewriteBtn')?.addEventListener('click', rewriteContent);
    document.getElementById('clearBtn')?.addEventListener('click', clearText);
    document.getElementById('copyBtn')?.addEventListener('click', copyText);
    document.getElementById('downloadBtn')?.addEventListener('click', downloadResults);

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    // Initialize settings listeners
    document.getElementById('writingStyle')?.addEventListener('change', handleSettingsChange);
    document.getElementById('tone')?.addEventListener('change', handleSettingsChange);
    document.getElementById('variationCount')?.addEventListener('input', updateVariationCountValue);
    
    const checkboxes = ['keepKeywords', 'enhanceClarity', 'improveFlow'];
    checkboxes.forEach(id => {
        document.getElementById(id)?.addEventListener('change', handleSettingsChange);
    });
}

function handleTextInput(e) {
    const text = e.target.value;
    if (text.length > 100) { // Auto-rewrite after 100 characters
        rewriteContent();
    }
}

function handleSettingsChange() {
    if (document.getElementById('textInput').value.trim()) {
        rewriteContent();
    }
}

function updateVariationCountValue(e) {
    const value = e.target.value;
    document.getElementById('variationCountValue').textContent = `${value} variation${value > 1 ? 's' : ''}`;
}

async function rewriteContent() {
    const text = document.getElementById('textInput').value.trim();
    if (!text) {
        showToast('Please enter some text to rewrite', 'warning');
        return;
    }

    const settings = {
        style: document.getElementById('writingStyle').value,
        tone: document.getElementById('tone').value,
        variationCount: parseInt(document.getElementById('variationCount').value),
        keepKeywords: document.getElementById('keepKeywords').checked,
        enhanceClarity: document.getElementById('enhanceClarity').checked,
        improveFlow: document.getElementById('improveFlow').checked
    };

    showLoadingOverlay('Rewriting content...');

    try {
        // Simulated API call - Replace with actual content rewriting API
        const results = await rewriteText(text, settings);
        displayResults(results, text);
        showToast('Content rewritten successfully', 'success');
    } catch (error) {
        console.error('Content rewriting failed:', error);
        showToast('Failed to rewrite content. Please try again.', 'error');
    } finally {
        hideLoadingOverlay();
    }
}

async function rewriteText(text, settings) {
    // Simulated API response - Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // Sample rewrite results
            const results = {
                mainRewrite: {
                    text: "Our innovative artificial intelligence solution revolutionizes business operations by automating complex tasks and providing data-driven insights for informed decision-making.",
                    scores: {
                        uniqueness: 0.85,
                        readability: 0.90,
                        coherence: 0.88
                    }
                },
                variations: [
                    {
                        text: "Through advanced AI technology, we transform business processes by streamlining complex operations and delivering actionable insights for strategic decisions.",
                        quality: 0.82
                    },
                    {
                        text: "Leveraging cutting-edge artificial intelligence, our solution enhances business efficiency by handling intricate tasks and generating valuable insights for better decision-making.",
                        quality: 0.78
                    },
                    {
                        text: "Our state-of-the-art AI platform optimizes business workflows by managing sophisticated operations and providing analytical insights for smarter choices.",
                        quality: 0.75
                    }
                ]
            };
            resolve(results);
        }, 2000);
    });
}

function displayResults(results, originalText) {
    // Update quality scores
    const overallQuality = calculateOverallQuality(results.mainRewrite.scores);
    document.getElementById('qualityScore').textContent = `${Math.round(overallQuality * 100)}%`;
    document.getElementById('qualityLabel').textContent = getQualityLabel(overallQuality);

    // Update progress bars
    document.getElementById('uniquenessProgress').style.width = `${results.mainRewrite.scores.uniqueness * 100}%`;
    document.getElementById('readabilityProgress').style.width = `${results.mainRewrite.scores.readability * 100}%`;
    document.getElementById('coherenceProgress').style.width = `${results.mainRewrite.scores.coherence * 100}%`;

    // Display comparison
    displayComparison(originalText, results.mainRewrite.text);

    // Display variations
    displayVariations(results.variations);
}

function calculateOverallQuality(scores) {
    return (scores.uniqueness + scores.readability + scores.coherence) / 3;
}

function getQualityLabel(score) {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.8) return 'Very Good';
    if (score >= 0.7) return 'Good';
    if (score >= 0.6) return 'Fair';
    return 'Needs Improvement';
}

function displayComparison(original, rewritten) {
    document.getElementById('originalText').textContent = original;
    document.getElementById('rewrittenText').innerHTML = highlightDifferences(original, rewritten);
}

function highlightDifferences(original, rewritten) {
    // Simple word-based difference highlighting
    const originalWords = original.toLowerCase().split(/\s+/);
    const rewrittenWords = rewritten.split(/\s+/);
    
    return rewrittenWords.map(word => {
        if (!originalWords.includes(word.toLowerCase())) {
            return `<span class="diff-highlight">${word}</span>`;
        }
        return word;
    }).join(' ');
}

function displayVariations(variations) {
    const container = document.getElementById('variationsContainer');
    if (!variations.length) {
        container.innerHTML = '<p class="text-muted">No alternative variations generated</p>';
        return;
    }

    container.innerHTML = variations.map((variation, index) => `
        <div class="variation-card p-3" onclick="applyVariation(${index})">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="mb-0">Variation ${index + 1}</h6>
                <span class="badge bg-${getQualityBadgeColor(variation.quality)}">
                    ${Math.round(variation.quality * 100)}% Quality
                </span>
            </div>
            <p class="mb-0">${variation.text}</p>
            <button class="btn btn-sm btn-outline-primary mt-2">
                Apply This Version
            </button>
        </div>
    `).join('');
}

function getQualityBadgeColor(quality) {
    if (quality >= 0.8) return 'success';
    if (quality >= 0.6) return 'info';
    return 'warning';
}

function applyVariation(index) {
    // This would be implemented to apply the selected variation
    showToast('Variation applied', 'success');
}

function clearText() {
    document.getElementById('textInput').value = '';
    document.getElementById('qualityScore').textContent = '0%';
    document.getElementById('qualityLabel').textContent = 'Content Quality';
    document.getElementById('uniquenessProgress').style.width = '0%';
    document.getElementById('readabilityProgress').style.width = '0%';
    document.getElementById('coherenceProgress').style.width = '0%';
    document.getElementById('originalText').textContent = '';
    document.getElementById('rewrittenText').textContent = '';
    document.getElementById('variationsContainer').innerHTML = '';
}

function copyText() {
    const text = document.getElementById('rewrittenText').textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Rewritten text copied to clipboard', 'success');
    }).catch(() => {
        showToast('Failed to copy text', 'error');
    });
}

function downloadResults() {
    const original = document.getElementById('originalText').textContent;
    const rewritten = document.getElementById('rewrittenText').textContent;
    const variations = Array.from(document.querySelectorAll('.variation-card p'))
        .map(p => p.textContent)
        .join('\n\n');

    const content = `Content Rewriting Results\n\n` +
                   `Original Text:\n${original}\n\n` +
                   `Rewritten Version:\n${rewritten}\n\n` +
                   `Alternative Variations:\n${variations}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rewritten-content.txt';
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