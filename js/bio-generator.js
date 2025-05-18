// Bio Generator functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeEmojiPicker();
    setupPlatformSelection();
    setupBioTemplates();
    setupFormattingTools();
    setupCharacterCounter();
    setupActionButtons();
});

// Platform-specific character limits
const platformLimits = {
    instagram: 150,
    twitter: 160,
    linkedin: 220,
    tiktok: 80
};

// Common emojis for bio generation
const commonEmojis = [
    '👋', '👨‍💻', '👩‍💻', '📈', '💡', '🎯', '✨', '🌟', '💪', '🚀',
    '📱', '💻', '🎨', '📸', '🎥', '🎬', '📊', '📝', '✅', '⭐',
    '❤️', '🔥', '💫', '🌍', '📍', '🎯', '🎮', '🎵', '📚', '✍️',
    '🎓', '🏆', '💼', '🤝', '📧', '🔗', '💭', '💪', '🌱', '🎉'
];

// Initialize emoji picker
function initializeEmojiPicker() {
    const picker = document.getElementById('emojiPicker');
    if (!picker) return;

    picker.innerHTML = commonEmojis.map(emoji => `
        <div class="emoji-item" onclick="insertEmoji('${emoji}')">${emoji}</div>
    `).join('');
}

// Setup platform selection
function setupPlatformSelection() {
    const platforms = document.querySelectorAll('input[name="platform"]');
    platforms.forEach(platform => {
        platform.addEventListener('change', () => {
            updateCharacterLimit(platform.id);
            updateBioPreview();
        });
    });
}

// Setup bio templates
function setupBioTemplates() {
    const templates = document.querySelectorAll('.bio-template');
    templates.forEach(template => {
        template.addEventListener('click', () => {
            applyTemplate(template.dataset.template);
        });
    });
}

// Setup formatting tools
function setupFormattingTools() {
    const tools = document.querySelectorAll('.formatting-btn');
    tools.forEach(tool => {
        tool.addEventListener('click', () => {
            applyFormatting(tool.dataset.format);
        });
    });
}

// Setup character counter
function setupCharacterCounter() {
    const bioDescription = document.getElementById('bioDescription');
    if (!bioDescription) return;

    bioDescription.addEventListener('input', () => {
        updateCharacterCount();
        updateBioPreview();
    });

    // Setup other input fields
    ['name', 'profession', 'location', 'website', 'tags'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateBioPreview);
    });
}

// Setup action buttons
function setupActionButtons() {
    // Reset button
    document.getElementById('resetBtn')?.addEventListener('click', resetForm);

    // Copy button
    document.getElementById('copyBtn')?.addEventListener('click', copyBioToClipboard);

    // Generate button
    document.getElementById('generateBtn')?.addEventListener('click', generateAIBio);
}

// Apply template
function applyTemplate(templateName) {
    const templates = {
        professional: {
            name: '[Your Name]',
            profession: '[Role] at [Company]',
            bio: '📈 Helping businesses achieve [goal]\n💡 [Expertise] specialist\n🔗 [Website]',
            website: 'https://yourwebsite.com'
        },
        creative: {
            name: '[Your Name]',
            profession: '[Creative Profession]',
            bio: '✨ Creating [what you create]\n🎨 Available for collaborations\n👉 Check out my latest work',
            location: '[City, Country]'
        },
        personal: {
            name: '[Your Name]',
            bio: '👋 Hey there!\n❤️ Passionate about [interests]\n🌟 [Personal motto]\n📲 Let\'s connect!',
            tags: '@yoursocial'
        },
        minimalist: {
            name: '[Name]',
            profession: '[Profession]',
            bio: '[One-line description]',
            website: '[Link]'
        }
    };

    const template = templates[templateName];
    if (!template) return;

    // Fill form with template data
    Object.keys(template).forEach(key => {
        const element = document.getElementById(key);
        if (element) element.value = template[key];
    });

    updateBioPreview();
    updateCharacterCount();
}

// Apply formatting
function applyFormatting(format) {
    const bioDescription = document.getElementById('bioDescription');
    if (!bioDescription) return;

    const start = bioDescription.selectionStart;
    const end = bioDescription.selectionEnd;
    const text = bioDescription.value;

    let formattedText = '';
    switch (format) {
        case 'bold':
            formattedText = text.slice(0, start) + '**' + text.slice(start, end) + '**' + text.slice(end);
            break;
        case 'italic':
            formattedText = text.slice(0, start) + '_' + text.slice(start, end) + '_' + text.slice(end);
            break;
        case 'link':
            formattedText = text.slice(0, start) + '[' + text.slice(start, end) + '](url)' + text.slice(end);
            break;
        case 'emoji':
            document.getElementById('emojiPicker').scrollIntoView({ behavior: 'smooth' });
            return;
    }

    bioDescription.value = formattedText;
    updateBioPreview();
    updateCharacterCount();
}

// Insert emoji
function insertEmoji(emoji) {
    const bioDescription = document.getElementById('bioDescription');
    if (!bioDescription) return;

    const start = bioDescription.selectionStart;
    bioDescription.value = bioDescription.value.slice(0, start) + emoji + bioDescription.value.slice(start);
    bioDescription.focus();
    
    updateBioPreview();
    updateCharacterCount();
}

// Update character count
function updateCharacterCount() {
    const bioDescription = document.getElementById('bioDescription');
    const charCount = document.getElementById('charCount');
    const charLimit = document.getElementById('charLimit');
    const characterCount = document.querySelector('.character-count');
    
    if (!bioDescription || !charCount || !charLimit || !characterCount) return;

    const platform = document.querySelector('input[name="platform"]:checked').id;
    const limit = platformLimits[platform];
    const current = bioDescription.value.length;

    charCount.textContent = current;
    charLimit.textContent = limit;

    // Update character count styling
    characterCount.classList.remove('warning', 'danger');
    if (current >= limit) {
        characterCount.classList.add('danger');
    } else if (current >= limit * 0.8) {
        characterCount.classList.add('warning');
    }
}

// Update character limit based on platform
function updateCharacterLimit(platform) {
    const charLimit = document.getElementById('charLimit');
    if (!charLimit) return;

    charLimit.textContent = platformLimits[platform];
    updateCharacterCount();
}

// Update bio preview
function updateBioPreview() {
    const preview = document.getElementById('bioPreview');
    if (!preview) return;

    const name = document.getElementById('name')?.value || '';
    const profession = document.getElementById('profession')?.value || '';
    const location = document.getElementById('location')?.value || '';
    const bio = document.getElementById('bioDescription')?.value || '';
    const website = document.getElementById('website')?.value || '';
    const tags = document.getElementById('tags')?.value || '';

    preview.innerHTML = `
        <div class="mb-2">
            <strong>${name}</strong>
            ${profession ? `<br>${profession}` : ''}
            ${location ? `<br>📍 ${location}` : ''}
        </div>
        <div class="mb-2">${formatBioText(bio)}</div>
        ${website ? `<div class="mb-2">🔗 ${website}</div>` : ''}
        ${tags ? `<div>${tags}</div>` : ''}
    `;
}

// Format bio text with markdown-like syntax
function formatBioText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
        .replace(/\n/g, '<br>');
}

// Reset form
function resetForm() {
    const form = document.querySelector('.card-body');
    const inputs = form.querySelectorAll('input[type="text"], textarea');
    inputs.forEach(input => input.value = '');
    updateBioPreview();
    updateCharacterCount();
}

// Copy bio to clipboard
function copyBioToClipboard() {
    const preview = document.getElementById('bioPreview');
    if (!preview) return;

    const bioText = preview.innerText;
    navigator.clipboard.writeText(bioText).then(() => {
        showAlert('Bio copied to clipboard!', 'success');
    }).catch(() => {
        showAlert('Failed to copy bio', 'danger');
    });
}

// Generate AI bio
function generateAIBio() {
    const name = document.getElementById('name')?.value;
    const profession = document.getElementById('profession')?.value;
    
    if (!name || !profession) {
        showAlert('Please enter your name and profession first', 'warning');
        return;
    }

    // Simulate AI generation with predefined templates
    const templates = [
        `👋 Hey! I'm ${name}\n🚀 ${profession}\n💡 Passionate about innovation\n🌟 Let's create something amazing!`,
        `✨ ${profession} | Creative mind\n🎯 Helping others succeed\n📍 Working globally\n🔗 Check out my work!`,
        `${name} | ${profession}\n🌟 Turning ideas into reality\n💪 Making an impact\n📲 Let's connect!`
    ];

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    document.getElementById('bioDescription').value = randomTemplate;
    
    updateBioPreview();
    updateCharacterCount();
    showAlert('Bio generated successfully!', 'success');
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