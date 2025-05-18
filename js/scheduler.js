// Social Media Scheduler functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeScheduler();
    setupEventListeners();
    loadSavedData();
});

let calendar = null;
let scheduledPosts = [];
let drafts = [];

// Initialize scheduler
function initializeScheduler() {
    setupCalendar();
    setupEmojiPicker();
    setupMediaPreview();
}

// Setup calendar
function setupCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,
        eventClick: handleEventClick,
        eventDrop: handleEventDrop,
        events: scheduledPosts
    });

    calendar.render();
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('postForm')?.addEventListener('submit', handlePostSubmit);

    // View buttons
    document.getElementById('monthView')?.addEventListener('click', () => changeView('dayGridMonth'));
    document.getElementById('weekView')?.addEventListener('click', () => changeView('timeGridWeek'));
    document.getElementById('dayView')?.addEventListener('click', () => changeView('timeGridDay'));

    // Emoji button
    document.getElementById('emojiBtn')?.addEventListener('click', toggleEmojiPicker);

    // Media upload
    document.getElementById('mediaUpload')?.addEventListener('change', handleMediaUpload);

    // Optimal time button
    document.getElementById('optimalTimeBtn')?.addEventListener('click', findOptimalTime);

    // Save draft button
    document.getElementById('saveDraftBtn')?.addEventListener('click', saveDraft);

    // Platform selection
    document.querySelectorAll('input[name="platforms"]').forEach(input => {
        input.addEventListener('change', validatePlatformSelection);
    });
}

// Handle post submission
function handlePostSubmit(e) {
    e.preventDefault();

    const formData = getFormData();
    if (!validateFormData(formData)) return;

    schedulePost(formData);
    resetForm();
    showAlert('Post scheduled successfully!', 'success');
}

// Get form data
function getFormData() {
    return {
        platforms: Array.from(document.querySelectorAll('input[name="platforms"]:checked')).map(input => input.id),
        content: document.getElementById('postContent').value,
        media: Array.from(document.getElementById('mediaUpload').files),
        scheduleTime: document.getElementById('scheduleTime').value
    };
}

// Validate form data
function validateFormData(data) {
    if (data.platforms.length === 0) {
        showAlert('Please select at least one platform', 'warning');
        return false;
    }

    if (!data.content.trim()) {
        showAlert('Please enter post content', 'warning');
        return false;
    }

    if (!data.scheduleTime) {
        showAlert('Please select a schedule time', 'warning');
        return false;
    }

    return true;
}

// Schedule post
function schedulePost(data) {
    const post = {
        id: Date.now(),
        title: data.content.substring(0, 30) + '...',
        start: data.scheduleTime,
        platforms: data.platforms,
        content: data.content,
        media: data.media
    };

    scheduledPosts.push(post);
    calendar.addEvent(post);
    updateScheduledPostsUI();
    saveData();
}

// Update scheduled posts UI
function updateScheduledPostsUI() {
    const container = document.getElementById('scheduledPosts');
    if (!container) return;

    container.innerHTML = scheduledPosts
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .map(post => `
            <div class="col-md-6">
                <div class="card post-preview">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                ${post.platforms.map(platform => `
                                    <span class="platform-badge ${platform}-badge me-1">
                                        <i class="bi bi-${platform}"></i>
                                    </span>
                                `).join('')}
                            </div>
                            <small class="text-muted">
                                ${new Date(post.start).toLocaleString()}
                            </small>
                        </div>
                        <p class="card-text">${post.content}</p>
                        ${post.media.length ? `
                            <div class="media-container">
                                <img src="${URL.createObjectURL(post.media[0])}" class="img-fluid rounded" alt="Media preview">
                            </div>
                        ` : ''}
                        <div class="mt-2">
                            <button class="btn btn-sm btn-outline-danger" onclick="deletePost(${post.id})">
                                Delete
                            </button>
                            <button class="btn btn-sm btn-outline-primary" onclick="editPost(${post.id})">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
}

// Handle event click
function handleEventClick(info) {
    const post = scheduledPosts.find(p => p.id === parseInt(info.event.id));
    if (!post) return;

    // Show post details modal
    // In a real implementation, this would open a modal with post details
    console.log('Post clicked:', post);
}

// Handle event drop
function handleEventDrop(info) {
    const post = scheduledPosts.find(p => p.id === parseInt(info.event.id));
    if (!post) return;

    post.start = info.event.start;
    saveData();
    showAlert('Post rescheduled successfully!', 'success');
}

// Setup emoji picker
function setupEmojiPicker() {
    const emojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯'];
    const grid = document.querySelector('.emoji-grid');
    if (!grid) return;

    grid.innerHTML = emojis.map(emoji => `
        <div class="emoji-item" onclick="insertEmoji('${emoji}')">${emoji}</div>
    `).join('');
}

// Toggle emoji picker
function toggleEmojiPicker() {
    const picker = document.getElementById('emojiPicker');
    picker.classList.toggle('show');
}

// Insert emoji
function insertEmoji(emoji) {
    const textarea = document.getElementById('postContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    textarea.value = text.substring(0, start) + emoji + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    
    toggleEmojiPicker();
}

// Setup media preview
function setupMediaPreview() {
    const mediaUpload = document.getElementById('mediaUpload');
    const mediaPreview = document.getElementById('mediaPreview');
    if (!mediaUpload || !mediaPreview) return;

    mediaUpload.addEventListener('change', () => {
        mediaPreview.innerHTML = Array.from(mediaUpload.files)
            .map(file => {
                const url = URL.createObjectURL(file);
                return `<img src="${url}" class="media-preview me-2 mb-2" alt="Media preview">`;
            }).join('');
    });
}

// Find optimal time
function findOptimalTime() {
    const platforms = Array.from(document.querySelectorAll('input[name="platforms"]:checked')).map(input => input.id);
    if (platforms.length === 0) {
        showAlert('Please select at least one platform', 'warning');
        return;
    }

    const optimalTimes = getOptimalTimes(platforms);
    showOptimalTimes(optimalTimes);
}

// Get optimal times for platforms
function getOptimalTimes(platforms) {
    // In a real implementation, this would use platform-specific analytics
    const times = {
        instagram: ['10:00', '13:00', '15:00', '19:00'],
        facebook: ['09:00', '13:00', '15:00', '19:00'],
        twitter: ['08:00', '12:00', '17:00', '20:00'],
        linkedin: ['08:00', '10:00', '12:00', '17:00']
    };

    return platforms.flatMap(platform => 
        times[platform].map(time => ({
            platform,
            time,
            score: Math.random() * 100 // In a real implementation, this would be engagement score
        }))
    ).sort((a, b) => b.score - a.score);
}

// Show optimal times
function showOptimalTimes(times) {
    const container = document.getElementById('optimalTimes');
    const list = container.querySelector('.list-group');
    
    list.innerHTML = times.slice(0, 5).map(slot => `
        <button type="button" class="list-group-item list-group-item-action time-slot ${slot.score > 70 ? 'optimal' : ''}"
                onclick="selectTime('${slot.time}')">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <i class="bi bi-${slot.platform} me-2"></i>
                    ${slot.time}
                </div>
                <span class="badge bg-primary rounded-pill">${Math.round(slot.score)}% optimal</span>
            </div>
        </button>
    `).join('');

    container.style.display = 'block';
}

// Select time
function selectTime(time) {
    const today = new Date();
    today.setHours(...time.split(':'), 0);
    
    const input = document.getElementById('scheduleTime');
    input.value = today.toISOString().slice(0, 16);
}

// Save draft
function saveDraft() {
    const formData = getFormData();
    if (!formData.content.trim()) {
        showAlert('Please enter post content to save as draft', 'warning');
        return;
    }

    const draft = {
        id: Date.now(),
        ...formData
    };

    drafts.push(draft);
    updateDraftsUI();
    saveData();
    resetForm();
    showAlert('Draft saved successfully!', 'success');
}

// Update drafts UI
function updateDraftsUI() {
    const container = document.getElementById('drafts');
    if (!container) return;

    container.innerHTML = drafts.map(draft => `
        <div class="card draft-card mb-3">
            <div class="card-body">
                <p class="card-text small">${draft.content.substring(0, 100)}...</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">
                        ${draft.platforms.length} platform(s)
                    </small>
                    <div>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteDraft(${draft.id})">
                            Delete
                        </button>
                        <button class="btn btn-sm btn-outline-primary" onclick="loadDraft(${draft.id})">
                            Load
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load draft
function loadDraft(id) {
    const draft = drafts.find(d => d.id === id);
    if (!draft) return;

    // Load draft data into form
    draft.platforms.forEach(platform => {
        document.getElementById(platform).checked = true;
    });
    document.getElementById('postContent').value = draft.content;
    if (draft.scheduleTime) {
        document.getElementById('scheduleTime').value = draft.scheduleTime;
    }

    // Remove draft
    drafts = drafts.filter(d => d.id !== id);
    updateDraftsUI();
    saveData();
}

// Delete draft
function deleteDraft(id) {
    drafts = drafts.filter(d => d.id !== id);
    updateDraftsUI();
    saveData();
}

// Delete post
function deletePost(id) {
    scheduledPosts = scheduledPosts.filter(p => p.id !== id);
    calendar.getEventById(id)?.remove();
    updateScheduledPostsUI();
    saveData();
}

// Edit post
function editPost(id) {
    const post = scheduledPosts.find(p => p.id === id);
    if (!post) return;

    // Load post data into form
    post.platforms.forEach(platform => {
        document.getElementById(platform).checked = true;
    });
    document.getElementById('postContent').value = post.content;
    document.getElementById('scheduleTime').value = post.start;

    // Remove post
    deletePost(id);
}

// Reset form
function resetForm() {
    document.getElementById('postForm').reset();
    document.getElementById('mediaPreview').innerHTML = '';
    document.getElementById('optimalTimes').style.display = 'none';
}

// Change calendar view
function changeView(view) {
    calendar.changeView(view);
}

// Validate platform selection
function validatePlatformSelection() {
    const selected = document.querySelectorAll('input[name="platforms"]:checked').length;
    document.querySelector('button[type="submit"]').disabled = selected === 0;
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('scheduledPosts', JSON.stringify(scheduledPosts));
    localStorage.setItem('drafts', JSON.stringify(drafts));
}

// Load saved data from localStorage
function loadSavedData() {
    const savedPosts = localStorage.getItem('scheduledPosts');
    const savedDrafts = localStorage.getItem('drafts');

    if (savedPosts) {
        scheduledPosts = JSON.parse(savedPosts);
        updateScheduledPostsUI();
    }

    if (savedDrafts) {
        drafts = JSON.parse(savedDrafts);
        updateDraftsUI();
    }
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