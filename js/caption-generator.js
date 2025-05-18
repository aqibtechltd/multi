// Caption Generator functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeToneSelection();
    loadRecentSearches();
    setupEventListeners();
});

let savedCaptions = [];

// Initialize tone selection
function initializeToneSelection() {
    document.querySelectorAll('.tone-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('.tone-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
        });
    });
}

// Load recent searches from localStorage
function loadRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const container = document.getElementById('recentSearches');
    container.innerHTML = recentSearches.map(search => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="text-truncate">${search.topic}</span>
            <button class="btn btn-sm btn-outline-primary" onclick="reloadSearch('${search.id}')">
                <i class="fas fa-redo"></i>
            </button>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('captionForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('exportBtn').addEventListener('click', exportCaptions);
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        topic: document.getElementById('topic').value,
        keywords: document.getElementById('keywords').value.split(',').map(k => k.trim()),
        tone: document.querySelector('.tone-tag.active')?.dataset.tone || 'casual',
        platforms: getPlatformSelection()
    };

    if (!validateFormData(formData)) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }

    showLoader();
    await generateCaptions(formData);
    saveRecentSearch(formData);
    hideLoader();
}

// Get selected platforms
function getPlatformSelection() {
    const platforms = {};
    ['instagram', 'facebook', 'twitter', 'linkedin'].forEach(platform => {
        platforms[platform] = document.getElementById(platform).checked;
    });
    return platforms;
}

// Validate form data
function validateFormData(data) {
    if (!data.topic || !data.keywords.length) return false;
    if (!Object.values(data.platforms).some(v => v)) return false;
    return true;
}

// Generate captions
async function generateCaptions(data) {
    // In a real implementation, this would call an AI service
    // For demo purposes, we'll use template-based generation
    const captions = generateTemplateCaptions(data);
    displayCaptions(captions);
}

// Generate template-based captions
function generateTemplateCaptions(data) {
    const templates = {
        professional: [
            "Elevate your {topic} game with these expert insights. {keywords} #Professional",
            "Discover the latest trends in {topic}. {keywords} #Innovation",
            "Leading the way in {topic} excellence. {keywords} #Leadership"
        ],
        casual: [
            "Just vibing with some {topic} today! {keywords} #GoodVibes",
            "Can't get enough of {topic}! {keywords} #Love",
            "Living my best {topic} life! {keywords} #Lifestyle"
        ],
        funny: [
            "When {topic} meets humor 😂 {keywords} #LOL",
            "Who else is obsessed with {topic}? 🙋‍♂️ {keywords} #Funny",
            "Plot twist: {topic} is actually hilarious! {keywords} #Comedy"
        ],
        inspirational: [
            "Transform your {topic} journey today. {keywords} #Motivation",
            "Your {topic} success story starts here. {keywords} #Inspiration",
            "Believe in your {topic} dreams. {keywords} #Goals"
        ],
        promotional: [
            "🔥 Special {topic} offer inside! {keywords} #Deal",
            "Don't miss out on this amazing {topic}! {keywords} #Limited",
            "Your perfect {topic} awaits. {keywords} #Shop"
        ]
    };

    return templates[data.tone].map(template => {
        let caption = template
            .replace('{topic}', data.topic)
            .replace('{keywords}', data.keywords.map(k => `#${k.replace(/\s+/g, '')}`).join(' '));
        
        return {
            text: caption,
            platforms: data.platforms
        };
    });
}

// Display generated captions
function displayCaptions(captions) {
    const container = document.getElementById('generatedCaptions');
    container.innerHTML = captions.map((caption, index) => `
        <div class="col-md-6">
            <div class="caption-card p-3 border">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="platform-icons">
                        ${Object.entries(caption.platforms)
                            .filter(([_, enabled]) => enabled)
                            .map(([platform]) => `
                                <span class="platform-icon ${platform}">
                                    <i class="fab fa-${platform}"></i>
                                </span>
                            `).join('')}
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="copyCaption(${index})">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary" onclick="editCaption(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
                <p class="mb-0">${caption.text}</p>
            </div>
        </div>
    `).join('');
}

// Save recent search
function saveRecentSearch(data) {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const search = {
        id: Date.now(),
        topic: data.topic,
        keywords: data.keywords,
        tone: data.tone,
        platforms: data.platforms
    };
    
    recentSearches.unshift(search);
    if (recentSearches.length > 5) recentSearches.pop();
    
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    loadRecentSearches();
}

// Reload search
function reloadSearch(id) {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const search = recentSearches.find(s => s.id === parseInt(id));
    
    if (search) {
        document.getElementById('topic').value = search.topic;
        document.getElementById('keywords').value = search.keywords.join(', ');
        
        document.querySelectorAll('.tone-tag').forEach(tag => {
            tag.classList.toggle('active', tag.dataset.tone === search.tone);
        });
        
        Object.entries(search.platforms).forEach(([platform, enabled]) => {
            document.getElementById(platform).checked = enabled;
        });
        
        handleFormSubmit(new Event('submit'));
    }
}

// Copy caption
function copyCaption(index) {
    const caption = document.querySelectorAll('.caption-card p')[index];
    navigator.clipboard.writeText(caption.textContent)
        .then(() => showAlert('Caption copied to clipboard!', 'success'))
        .catch(() => showAlert('Failed to copy caption', 'error'));
}

// Edit caption
function editCaption(index) {
    const caption = document.querySelectorAll('.caption-card p')[index];
    const newText = prompt('Edit caption:', caption.textContent);
    if (newText) {
        caption.textContent = newText;
    }
}

// Export captions
function exportCaptions() {
    const captions = Array.from(document.querySelectorAll('.caption-card p'))
        .map(p => p.textContent);
    
    const blob = new Blob([captions.join('\n\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'captions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Show loader
function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75';
    loader.innerHTML = '<div class="spinner-border text-primary" role="status"></div>';
    document.body.appendChild(loader);
}

// Hide loader
function hideLoader() {
    document.getElementById('loader')?.remove();
}

// Show alert
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
} 