// Hashtag Generator functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeGenerator();
    setupEventListeners();
    loadTrendingHashtags();
});

// Initialize generator
function initializeGenerator() {
    setupCategories();
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('hashtagForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        generateHashtags();
    });

    // Category selection
    document.querySelectorAll('.category-badge').forEach(badge => {
        badge.addEventListener('click', () => {
            badge.classList.toggle('active');
            if (document.getElementById('content').value) {
                generateHashtags();
            }
        });
    });

    // Platform change
    document.querySelectorAll('input[name="platform"]').forEach(input => {
        input.addEventListener('change', () => {
            if (document.getElementById('content').value) {
                generateHashtags();
            }
        });
    });
}

// Setup categories
function setupCategories() {
    const categories = document.querySelectorAll('.category-badge');
    categories.forEach(category => {
        category.addEventListener('click', () => {
            category.classList.toggle('active');
        });
    });
}

// Generate hashtags
function generateHashtags() {
    const content = document.getElementById('content').value;
    const platform = document.querySelector('input[name="platform"]:checked').id;
    const categories = Array.from(document.querySelectorAll('.category-badge.active'))
        .map(badge => badge.dataset.category);

    if (!content) {
        showAlert('Please enter some content or keywords', 'warning');
        return;
    }

    // Get keywords from content
    const keywords = extractKeywords(content);

    // Generate hashtag sets
    const hashtagSets = generateHashtagSets(keywords, categories, platform);

    // Generate individual hashtags
    const individualHashtags = generateIndividualHashtags(keywords, categories, platform);

    // Update UI
    updateResults(hashtagSets, individualHashtags);
    showResults();
}

// Extract keywords from content
function extractKeywords(content) {
    // Remove special characters and split into words
    const words = content.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2);

    // Remove common words
    const commonWords = ['the', 'and', 'for', 'that', 'this', 'with', 'are', 'was'];
    return [...new Set(words.filter(word => !commonWords.includes(word)))];
}

// Generate hashtag sets
function generateHashtagSets(keywords, categories, platform) {
    const sets = [];
    const platformLimits = {
        instagram: 30,
        twitter: 3,
        tiktok: 5
    };

    // Popular hashtags for each category
    const categoryHashtags = {
        fashion: ['fashion', 'style', 'ootd', 'fashionblogger', 'streetstyle'],
        food: ['food', 'foodie', 'foodporn', 'instafood', 'yummy'],
        travel: ['travel', 'wanderlust', 'travelgram', 'instatravel', 'adventure'],
        fitness: ['fitness', 'gym', 'workout', 'fit', 'health'],
        tech: ['tech', 'technology', 'innovation', 'coding', 'programming'],
        art: ['art', 'artist', 'artwork', 'creative', 'design'],
        beauty: ['beauty', 'makeup', 'skincare', 'beautiful', 'cosmetics'],
        business: ['business', 'entrepreneur', 'success', 'marketing', 'startup'],
        education: ['education', 'learning', 'study', 'student', 'knowledge'],
        entertainment: ['entertainment', 'fun', 'music', 'movie', 'party']
    };

    // Generate three sets of hashtags
    for (let i = 0; i < 3; i++) {
        const set = new Set();
        
        // Add category-specific hashtags
        categories.forEach(category => {
            const categoryTags = categoryHashtags[category] || [];
            categoryTags.forEach(tag => {
                if (set.size < platformLimits[platform]) {
                    set.add(tag);
                }
            });
        });

        // Add keyword-based hashtags
        keywords.forEach(keyword => {
            if (set.size < platformLimits[platform]) {
                set.add(keyword);
            }
        });

        // Add trending hashtags
        getTrendingHashtags().slice(0, 3).forEach(tag => {
            if (set.size < platformLimits[platform]) {
                set.add(tag.replace('#', ''));
            }
        });

        sets.push([...set].map(tag => '#' + tag));
    }

    return sets;
}

// Generate individual hashtags
function generateIndividualHashtags(keywords, categories, platform) {
    const hashtags = new Set();
    const maxHashtags = 50;

    // Add keyword-based hashtags
    keywords.forEach(keyword => {
        if (hashtags.size < maxHashtags) {
            hashtags.add(keyword);
        }
    });

    // Add category-specific hashtags
    categories.forEach(category => {
        const categoryVariations = generateCategoryVariations(category);
        categoryVariations.forEach(variation => {
            if (hashtags.size < maxHashtags) {
                hashtags.add(variation);
            }
        });
    });

    return [...hashtags].map(tag => ({
        tag: '#' + tag,
        engagement: Math.floor(Math.random() * 100),
        posts: Math.floor(Math.random() * 1000000)
    }));
}

// Generate category variations
function generateCategoryVariations(category) {
    const variations = [];
    variations.push(category);
    variations.push(category + 'life');
    variations.push(category + 'lover');
    variations.push(category + 'daily');
    variations.push('best' + category);
    return variations;
}

// Update results in UI
function updateResults(hashtagSets, individualHashtags) {
    // Update hashtag sets
    const setsContainer = document.getElementById('hashtagSets');
    setsContainer.innerHTML = hashtagSets.map((set, index) => `
        <div class="col-md-4">
            <div class="card hashtag-card">
                <div class="card-body position-relative">
                    <h6 class="card-title">Set ${index + 1}</h6>
                    <p class="card-text small">${set.join(' ')}</p>
                    <button class="btn btn-sm btn-outline-primary copy-btn" onclick="copyToClipboard('${set.join(' ')}')">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Update individual hashtags
    const tagsContainer = document.getElementById('individualHashtags');
    tagsContainer.innerHTML = individualHashtags
        .sort((a, b) => b.engagement - a.engagement)
        .map(hashtag => `
            <span class="hashtag-badge" onclick="copyToClipboard('${hashtag.tag}')">
                ${hashtag.tag}
                <span class="engagement-indicator ${getEngagementClass(hashtag.engagement)}"></span>
                <small class="text-muted">${formatNumber(hashtag.posts)} posts</small>
            </span>
        `).join('');
}

// Get engagement class based on score
function getEngagementClass(score) {
    if (score >= 70) return 'engagement-high';
    if (score >= 40) return 'engagement-medium';
    return 'engagement-low';
}

// Format number with K/M suffix
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// Show results section
function showResults() {
    document.getElementById('resultsCard').style.display = 'block';
}

// Load trending hashtags
function loadTrendingHashtags() {
    const trending = getTrendingHashtags();
    const container = document.getElementById('trendingHashtags');
    
    container.innerHTML = trending.map(tag => `
        <span class="trending-hashtag" onclick="copyToClipboard('${tag}')">
            ${tag}
            <i class="bi bi-arrow-up-right text-success"></i>
        </span>
    `).join('');
}

// Get trending hashtags (mock data)
function getTrendingHashtags() {
    return [
        '#trending',
        '#viral',
        '#challenge',
        '#motivation',
        '#instagood',
        '#photooftheday',
        '#love',
        '#fashion',
        '#beautiful',
        '#happy'
    ];
}

// Analyze hashtag
function analyzeHashtag() {
    const hashtag = document.getElementById('hashtagAnalytics').value.replace('#', '');
    if (!hashtag) {
        showAlert('Please enter a hashtag to analyze', 'warning');
        return;
    }

    // Mock analytics data
    const analytics = {
        posts: Math.floor(Math.random() * 1000000),
        engagement: Math.floor(Math.random() * 100),
        growth: Math.floor(Math.random() * 200 - 100),
        avgLikes: Math.floor(Math.random() * 10000),
        topTime: ['10:00', '15:00', '19:00']
    };

    const resultsContainer = document.getElementById('analyticsResults');
    resultsContainer.innerHTML = `
        <div class="alert alert-light">
            <h6 class="mb-3">#${hashtag}</h6>
            <div class="mb-2">
                <span class="engagement-indicator ${getEngagementClass(analytics.engagement)}"></span>
                Engagement Rate: ${analytics.engagement}%
            </div>
            <div class="mb-2">
                <i class="bi bi-graph-up text-success me-2"></i>
                Total Posts: ${formatNumber(analytics.posts)}
            </div>
            <div class="mb-2">
                <i class="bi bi-arrow-${analytics.growth >= 0 ? 'up' : 'down'} 
                   text-${analytics.growth >= 0 ? 'success' : 'danger'} me-2"></i>
                Growth Rate: ${analytics.growth}%
            </div>
            <div class="mb-2">
                <i class="bi bi-heart text-danger me-2"></i>
                Avg. Likes: ${formatNumber(analytics.avgLikes)}
            </div>
            <div>
                <i class="bi bi-clock text-primary me-2"></i>
                Best Times: ${analytics.topTime.join(', ')}
            </div>
        </div>
    `;
    resultsContainer.style.display = 'block';
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('Copied to clipboard!', 'success');
    }).catch(() => {
        showAlert('Failed to copy to clipboard', 'error');
    });
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