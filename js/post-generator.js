// Social Media Post Generator functionality
document.addEventListener('DOMContentLoaded', () => {
    initializePostGenerator();
});

// Platform-specific settings
const platformSettings = {
    instagram: {
        charLimit: 2200,
        hashtagLimit: 30,
        mediaTypes: ['image', 'video'],
        mediaLimit: 10
    },
    twitter: {
        charLimit: 280,
        hashtagLimit: 5,
        mediaTypes: ['image', 'video', 'gif'],
        mediaLimit: 4
    },
    facebook: {
        charLimit: 63206,
        hashtagLimit: 10,
        mediaTypes: ['image', 'video'],
        mediaLimit: 10
    },
    linkedin: {
        charLimit: 3000,
        hashtagLimit: 10,
        mediaTypes: ['image', 'video'],
        mediaLimit: 9
    }
};

// Post templates
const postTemplates = [
    {
        name: 'Product Launch',
        template: '🎉 Exciting News! We're thrilled to announce [Product Name]!\n\n' +
                 '✨ Key Features:\n' +
                 '• [Feature 1]\n' +
                 '• [Feature 2]\n' +
                 '• [Feature 3]\n\n' +
                 '🔥 Limited time offer: [Discount/Offer]\n\n' +
                 '👉 Link in bio to learn more!\n\n' +
                 '#launch #newproduct #[industry]'
    },
    {
        name: 'Tips & Tricks',
        template: '💡 Quick Tip: [Topic]\n\n' +
                 'Did you know? [Interesting fact]\n\n' +
                 'Here's how to [achieve goal]:\n' +
                 '1️⃣ [Step 1]\n' +
                 '2️⃣ [Step 2]\n' +
                 '3️⃣ [Step 3]\n\n' +
                 '💬 Share your experience below!\n\n' +
                 '#tips #howto #[industry]'
    },
    {
        name: 'Behind the Scenes',
        template: '🎬 Behind the Scenes at [Company/Event]\n\n' +
                 'Take a peek into [activity/process]!\n\n' +
                 '👥 Meet our amazing team\n' +
                 '📍 [Location]\n' +
                 '🎯 [Current project/goal]\n\n' +
                 '❤️ Like and follow for more updates!\n\n' +
                 '#behindthescenes #team #[industry]'
    }
];

// Common emojis
const commonEmojis = [
    '❤️', '🔥', '✨', '💡', '🎉', '👉', '🚀', '💪',
    '🎯', '📈', '💬', '🙌', '👋', '🎨', '📱', '💻',
    '📸', '🎥', '🎬', '📊', '📝', '✅', '⭐', '🌟'
];

function initializePostGenerator() {
    // Set up event listeners
    setupPlatformSelectors();
    setupContentListeners();
    setupMediaUpload();
    setupHashtagGenerator();
    setupTemplates();
    setupEmojiPicker();
    setupActionButtons();

    // Initialize with default platform (Instagram)
    updatePlatformSettings('instagram');
}

function setupPlatformSelectors() {
    const selectors = document.querySelectorAll('.platform-selector');
    selectors.forEach(selector => {
        selector.addEventListener('click', () => {
            // Remove active class from all selectors
            selectors.forEach(s => s.classList.remove('active'));
            // Add active class to clicked selector
            selector.classList.add('active');
            // Update settings for selected platform
            const platform = selector.dataset.platform;
            updatePlatformSettings(platform);
        });
    });
}

function setupContentListeners() {
    const postContent = document.getElementById('postContent');
    postContent?.addEventListener('input', () => {
        updateCharacterCount();
        updatePostPreview();
    });
}

function setupMediaUpload() {
    const mediaUpload = document.getElementById('mediaUpload');
    mediaUpload?.addEventListener('change', handleMediaUpload);
}

function setupHashtagGenerator() {
    const customHashtag = document.getElementById('customHashtag');
    customHashtag?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCustomHashtag();
        }
    });
}

function setupTemplates() {
    const templateList = document.getElementById('templateList');
    if (templateList) {
        templateList.innerHTML = postTemplates.map(template => `
            <div class="post-template" onclick="applyTemplate('${template.name}')">
                <h6>${template.name}</h6>
                <small class="text-muted">${template.template.substring(0, 50)}...</small>
            </div>
        `).join('');
    }
}

function setupEmojiPicker() {
    const emojiPicker = document.getElementById('emojiPicker');
    if (emojiPicker) {
        emojiPicker.innerHTML = commonEmojis.map(emoji => `
            <div class="emoji-item" onclick="insertEmoji('${emoji}')">${emoji}</div>
        `).join('');
    }
}

function setupActionButtons() {
    document.getElementById('generateBtn')?.addEventListener('click', generatePost);
    document.getElementById('saveBtn')?.addEventListener('click', saveDraft);
    document.getElementById('clearBtn')?.addEventListener('click', clearPost);
}

function updatePlatformSettings(platform) {
    const settings = platformSettings[platform];
    document.getElementById('charLimit').textContent = settings.charLimit;
    updateCharacterCount();
}

function updateCharacterCount() {
    const content = document.getElementById('postContent').value;
    const charCount = content.length;
    const platform = document.querySelector('.platform-selector.active').dataset.platform;
    const limit = platformSettings[platform].charLimit;

    document.getElementById('charCount').textContent = charCount;
    
    // Visual feedback when approaching limit
    const charCountElement = document.querySelector('.character-count');
    if (charCount > limit) {
        charCountElement.style.color = 'var(--bs-danger)';
    } else if (charCount > limit * 0.9) {
        charCountElement.style.color = 'var(--bs-warning)';
    } else {
        charCountElement.style.color = 'var(--bs-gray)';
    }
}

function updatePostPreview() {
    const content = document.getElementById('postContent').value;
    const preview = document.getElementById('postPreview');
    
    // Convert line breaks and add hashtag links
    const formattedContent = content
        .replace(/\n/g, '<br>')
        .replace(/#(\w+)/g, '<a href="#" class="text-primary">#$1</a>');
    
    preview.innerHTML = formattedContent;
}

function handleMediaUpload(e) {
    const files = Array.from(e.target.files);
    const preview = document.getElementById('mediaPreview');
    const platform = document.querySelector('.platform-selector.active').dataset.platform;
    const settings = platformSettings[platform];

    if (files.length > settings.mediaLimit) {
        alert(`Maximum ${settings.mediaLimit} files allowed for ${platform}`);
        return;
    }

    preview.innerHTML = files.map(file => `
        <div class="position-relative d-inline-block me-2 mb-2">
            <img src="${URL.createObjectURL(file)}" 
                 alt="Media preview" 
                 style="height: 100px; width: 100px; object-fit: cover; border-radius: 0.5rem;">
            <button class="btn btn-sm btn-danger position-absolute top-0 end-0"
                    onclick="removeMedia(this)">×</button>
        </div>
    `).join('');
}

function removeMedia(button) {
    button.parentElement.remove();
}

function addCustomHashtag() {
    const input = document.getElementById('customHashtag');
    const hashtag = input.value.trim().replace(/[^a-zA-Z0-9]/g, '');
    
    if (hashtag) {
        const container = document.getElementById('hashtagSuggestions');
        container.innerHTML += `
            <span class="hashtag-badge" onclick="toggleHashtag(this)">#${hashtag}</span>
        `;
        input.value = '';
    }
}

function toggleHashtag(element) {
    element.classList.toggle('bg-primary');
    element.classList.toggle('text-white');
    
    const postContent = document.getElementById('postContent');
    const hashtag = element.textContent;
    
    if (element.classList.contains('bg-primary')) {
        postContent.value += `\n${hashtag}`;
    } else {
        postContent.value = postContent.value.replace(`\n${hashtag}`, '');
    }
    
    updateCharacterCount();
    updatePostPreview();
}

function applyTemplate(templateName) {
    const template = postTemplates.find(t => t.name === templateName);
    if (template) {
        document.getElementById('postContent').value = template.template;
        updateCharacterCount();
        updatePostPreview();
    }
}

function insertEmoji(emoji) {
    const postContent = document.getElementById('postContent');
    const cursorPos = postContent.selectionStart;
    const textBefore = postContent.value.substring(0, cursorPos);
    const textAfter = postContent.value.substring(cursorPos);
    
    postContent.value = textBefore + emoji + textAfter;
    postContent.focus();
    postContent.selectionStart = cursorPos + emoji.length;
    postContent.selectionEnd = cursorPos + emoji.length;
    
    updateCharacterCount();
    updatePostPreview();
}

function generatePost() {
    // Implement AI-powered post generation
    alert('Generating optimized post...');
}

function saveDraft() {
    const content = document.getElementById('postContent').value;
    const platform = document.querySelector('.platform-selector.active').dataset.platform;
    
    // Save to local storage
    const drafts = JSON.parse(localStorage.getItem('postDrafts') || '[]');
    drafts.push({
        content,
        platform,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('postDrafts', JSON.stringify(drafts));
    
    alert('Draft saved successfully!');
}

function clearPost() {
    document.getElementById('postContent').value = '';
    document.getElementById('mediaPreview').innerHTML = '';
    document.getElementById('hashtagSuggestions').innerHTML = '';
    document.getElementById('mediaUpload').value = '';
    updateCharacterCount();
    updatePostPreview();
} 