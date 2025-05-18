// Engagement Calculator functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeCalculator();
    setupEventListeners();
});

let engagementChart = null;

// Initialize calculator
function initializeCalculator() {
    setupPlatformSpecificFields();
    setupChartDefaults();
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('engagementForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateEngagement();
    });

    // Platform change
    document.querySelectorAll('input[name="platform"]').forEach(input => {
        input.addEventListener('change', () => {
            setupPlatformSpecificFields();
        });
    });
}

// Setup platform specific fields
function setupPlatformSpecificFields() {
    const platform = document.querySelector('input[name="platform"]:checked').id;
    const savesField = document.getElementById('saves')?.closest('.col-md-6');
    
    if (savesField) {
        savesField.style.display = platform === 'instagram' ? 'block' : 'none';
    }
}

// Setup chart defaults
function setupChartDefaults() {
    const ctx = document.getElementById('engagementChart')?.getContext('2d');
    if (!ctx) return;

    engagementChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Engagement Rate', 'Reach Rate', 'Interaction Rate', 'Share Rate', 'Profile Visit Rate'],
            datasets: [{
                label: 'Your Metrics',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Calculate engagement metrics
function calculateEngagement() {
    const metrics = getMetrics();
    const rates = calculateRates(metrics);
    
    updateUI(rates);
    updateChart(rates);
    showResults();
    provideBenchmarks(rates);
    provideRecommendations(rates);
}

// Get metrics from form
function getMetrics() {
    return {
        platform: document.querySelector('input[name="platform"]:checked').id,
        followers: parseInt(document.getElementById('followers').value) || 0,
        reach: parseInt(document.getElementById('reach').value) || 0,
        likes: parseInt(document.getElementById('likes').value) || 0,
        comments: parseInt(document.getElementById('comments').value) || 0,
        shares: parseInt(document.getElementById('shares').value) || 0,
        saves: parseInt(document.getElementById('saves').value) || 0,
        profileVisits: parseInt(document.getElementById('profileVisits').value) || 0
    };
}

// Calculate various rates
function calculateRates(metrics) {
    const totalEngagements = metrics.likes + metrics.comments + metrics.shares + 
                           (metrics.platform === 'instagram' ? metrics.saves : 0);
    
    return {
        engagementRate: (totalEngagements / metrics.followers) * 100,
        reachRate: (metrics.reach / metrics.followers) * 100,
        interactionRate: ((metrics.likes + metrics.comments) / metrics.reach) * 100,
        shareRate: (metrics.shares / metrics.reach) * 100,
        profileVisitRate: (metrics.profileVisits / metrics.reach) * 100
    };
}

// Update UI with calculated rates
function updateUI(rates) {
    document.getElementById('engagementRate').textContent = rates.engagementRate.toFixed(2) + '%';
    document.getElementById('reachRate').textContent = rates.reachRate.toFixed(2) + '%';
    document.getElementById('interactionRate').textContent = rates.interactionRate.toFixed(2) + '%';
}

// Update chart with new data
function updateChart(rates) {
    if (!engagementChart) return;

    engagementChart.data.datasets[0].data = [
        rates.engagementRate,
        rates.reachRate,
        rates.interactionRate,
        rates.shareRate,
        rates.profileVisitRate
    ];
    engagementChart.update();
}

// Show results section
function showResults() {
    document.getElementById('resultsCard').style.display = 'block';
}

// Provide industry benchmarks
function provideBenchmarks(rates) {
    const platform = document.querySelector('input[name="platform"]:checked').id;
    const benchmarks = getPlatformBenchmarks(platform);
    const engagementRate = rates.engagementRate;

    let status, color, percentage;
    if (engagementRate >= benchmarks.good) {
        status = 'Good';
        color = 'success';
        percentage = 100;
    } else if (engagementRate >= benchmarks.average) {
        status = 'Average';
        color = 'warning';
        percentage = 60;
    } else {
        status = 'Below Average';
        color = 'danger';
        percentage = 30;
    }

    const indicator = document.getElementById('benchmarkIndicator');
    const text = document.getElementById('benchmarkText');
    const progress = document.getElementById('benchmarkProgress');

    indicator.className = `benchmark-indicator benchmark-${color}`;
    text.textContent = `${status} (${engagementRate.toFixed(2)}%)`;
    progress.className = `progress-bar bg-${color}`;
    progress.style.width = `${percentage}%`;
}

// Get platform specific benchmarks
function getPlatformBenchmarks(platform) {
    const benchmarks = {
        instagram: { good: 3.0, average: 1.5 },
        facebook: { good: 1.0, average: 0.5 },
        twitter: { good: 0.5, average: 0.25 },
        linkedin: { good: 2.0, average: 1.0 }
    };
    return benchmarks[platform];
}

// Provide recommendations based on metrics
function provideRecommendations(rates) {
    const recommendations = [];
    const platform = document.querySelector('input[name="platform"]:checked').id;

    if (rates.engagementRate < getPlatformBenchmarks(platform).average) {
        recommendations.push({
            title: 'Improve Content Quality',
            text: 'Focus on creating more engaging and relevant content for your audience.'
        });
    }

    if (rates.reachRate < 30) {
        recommendations.push({
            title: 'Increase Reach',
            text: 'Use relevant hashtags and optimize posting times to improve content visibility.'
        });
    }

    if (rates.interactionRate < 2) {
        recommendations.push({
            title: 'Boost Interactions',
            text: 'Ask questions in your posts and respond to comments to encourage more engagement.'
        });
    }

    if (rates.shareRate < 1) {
        recommendations.push({
            title: 'Encourage Sharing',
            text: 'Create more shareable content and include clear calls-to-action.'
        });
    }

    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = recommendations.map(rec => `
        <div class="alert alert-info mb-2">
            <strong>${rec.title}:</strong> ${rec.text}
        </div>
    `).join('');
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
} 