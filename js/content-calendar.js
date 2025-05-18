// Content Calendar functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    setupEventListeners();
    initializeAnalytics();
    loadSavedContent();
});

let contentCalendar = {
    events: [],
    campaigns: new Set(),
    analytics: {
        views: {},
        engagement: {},
        platforms: {
            instagram: 0,
            facebook: 0,
            twitter: 0,
            linkedin: 0
        }
    }
};

// Initialize calendar
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,
        droppable: true,
        eventClick: handleEventClick,
        eventDrop: handleEventDrop,
        events: contentCalendar.events
    });
    calendar.render();
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('contentForm')?.addEventListener('submit', handleFormSubmit);

    // Content type change
    document.getElementById('contentType')?.addEventListener('change', updateFormFields);

    // Platform changes
    document.querySelectorAll('#platforms input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', validatePlatformSelection);
    });
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        type: document.getElementById('contentType').value,
        platforms: getPlatformSelection(),
        schedule: document.getElementById('scheduleTime').value,
        campaign: document.getElementById('campaign').value,
        content: document.getElementById('content').value,
        media: document.getElementById('media').files
    };

    if (!validateFormData(formData)) {
        return;
    }

    addContentToCalendar(formData);
    updateAnalytics(formData);
    resetForm();
    showAlert('Content added to calendar successfully!', 'success');
}

// Get platform selection
function getPlatformSelection() {
    const platforms = {};
    document.querySelectorAll('#platforms input[type="checkbox"]').forEach(checkbox => {
        platforms[checkbox.id] = checkbox.checked;
    });
    return platforms;
}

// Validate form data
function validateFormData(data) {
    if (!Object.values(data.platforms).some(v => v)) {
        showAlert('Please select at least one platform', 'warning');
        return false;
    }

    if (!data.schedule) {
        showAlert('Please select a schedule time', 'warning');
        return false;
    }

    if (!data.content.trim()) {
        showAlert('Please add some content', 'warning');
        return false;
    }

    return true;
}

// Add content to calendar
function addContentToCalendar(data) {
    const event = {
        id: Date.now(),
        title: `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} - ${getPlatformIcons(data.platforms)}`,
        start: data.schedule,
        content: data.content,
        platforms: data.platforms,
        campaign: data.campaign,
        type: data.type,
        backgroundColor: getEventColor(data.type)
    };

    contentCalendar.events.push(event);
    if (data.campaign) {
        contentCalendar.campaigns.add(data.campaign);
    }

    const calendar = document.querySelector('#calendar').FullCalendar;
    calendar.addEvent(event);
    addToContentQueue(event);
    saveCalendar();
}

// Get platform icons
function getPlatformIcons(platforms) {
    return Object.entries(platforms)
        .filter(([_, enabled]) => enabled)
        .map(([platform]) => `<i class="fab fa-${platform}"></i>`)
        .join(' ');
}

// Get event color
function getEventColor(type) {
    const colors = {
        post: '#4f46e5',
        story: '#7c3aed',
        reel: '#ec4899',
        video: '#f59e0b'
    };
    return colors[type] || '#6b7280';
}

// Add to content queue
function addToContentQueue(event) {
    const queue = document.getElementById('contentQueue');
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4';
    card.innerHTML = `
        <div class="post-card p-3 border position-relative">
            <span class="status-badge bg-primary">Scheduled</span>
            <div class="d-flex align-items-center mb-2">
                <div class="content-type-icon">
                    <i class="fas ${getTypeIcon(event.type)}"></i>
                </div>
                <div>
                    <h6 class="mb-0">${event.type.charAt(0).toUpperCase() + event.type.slice(1)}</h6>
                    <small class="text-muted">${new Date(event.start).toLocaleString()}</small>
                </div>
            </div>
            <p class="mb-2">${event.content.substring(0, 100)}...</p>
            <div class="d-flex flex-wrap gap-2 mb-2">
                ${Object.entries(event.platforms)
                    .filter(([_, enabled]) => enabled)
                    .map(([platform]) => `
                        <span class="platform-icon ${platform}">
                            <i class="fab fa-${platform} text-white"></i>
                        </span>
                    `).join('')}
            </div>
            ${event.campaign ? `
                <span class="campaign-tag bg-primary bg-opacity-10 text-primary">
                    ${event.campaign}
                </span>
            ` : ''}
            <div class="mt-3 d-flex justify-content-end gap-2">
                <button class="btn btn-sm btn-outline-primary" onclick="editContent(${event.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteContent(${event.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    queue.appendChild(card);
}

// Get type icon
function getTypeIcon(type) {
    const icons = {
        post: 'fa-image',
        story: 'fa-clock',
        reel: 'fa-video',
        video: 'fa-film'
    };
    return icons[type] || 'fa-file';
}

// Handle event click
function handleEventClick(info) {
    const event = info.event;
    // Show event details modal
    // Implementation depends on UI requirements
}

// Handle event drop
function handleEventDrop(info) {
    const event = info.event;
    const index = contentCalendar.events.findIndex(e => e.id === parseInt(event.id));
    if (index !== -1) {
        contentCalendar.events[index].start = event.start.toISOString();
        saveCalendar();
        showAlert('Event rescheduled successfully!', 'success');
    }
}

// Initialize analytics
function initializeAnalytics() {
    // Content Distribution Chart
    const contentCtx = document.getElementById('contentDistribution').getContext('2d');
    new Chart(contentCtx, {
        type: 'doughnut',
        data: {
            labels: ['Posts', 'Stories', 'Reels', 'Videos'],
            datasets: [{
                data: [40, 20, 25, 15],
                backgroundColor: ['#4f46e5', '#7c3aed', '#ec4899', '#f59e0b']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Platform Usage Chart
    const platformCtx = document.getElementById('platformUsage').getContext('2d');
    new Chart(platformCtx, {
        type: 'bar',
        data: {
            labels: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'],
            datasets: [{
                label: 'Posts',
                data: [30, 25, 20, 15],
                backgroundColor: '#4f46e5'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Campaign Performance Chart
    const campaignCtx = document.getElementById('campaignPerformance').getContext('2d');
    new Chart(campaignCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Engagement',
                data: [65, 59, 80, 81],
                borderColor: '#4f46e5',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Update analytics
function updateAnalytics(data) {
    // Update platform counts
    Object.entries(data.platforms).forEach(([platform, enabled]) => {
        if (enabled) {
            contentCalendar.analytics.platforms[platform]++;
        }
    });

    // Update charts
    // Implementation depends on chart library and requirements
}

// Save calendar
function saveCalendar() {
    localStorage.setItem('contentCalendar', JSON.stringify(contentCalendar));
}

// Load saved content
function loadSavedContent() {
    const saved = localStorage.getItem('contentCalendar');
    if (saved) {
        contentCalendar = JSON.parse(saved);
        contentCalendar.events.forEach(event => {
            const calendar = document.querySelector('#calendar').FullCalendar;
            calendar.addEvent(event);
            addToContentQueue(event);
        });
    }
}

// Reset form
function resetForm() {
    document.getElementById('contentForm').reset();
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

// Edit content
function editContent(id) {
    const event = contentCalendar.events.find(e => e.id === id);
    if (event) {
        document.getElementById('contentType').value = event.type;
        document.getElementById('scheduleTime').value = event.start;
        document.getElementById('campaign').value = event.campaign;
        document.getElementById('content').value = event.content;
        
        Object.entries(event.platforms).forEach(([platform, enabled]) => {
            document.getElementById(platform).checked = enabled;
        });

        deleteContent(id);
        showAlert('Content loaded for editing', 'info');
    }
}

// Delete content
function deleteContent(id) {
    const index = contentCalendar.events.findIndex(e => e.id === id);
    if (index !== -1) {
        contentCalendar.events.splice(index, 1);
        const calendar = document.querySelector('#calendar').FullCalendar;
        const event = calendar.getEventById(id);
        if (event) {
            event.remove();
        }
        document.querySelector(`[data-id="${id}"]`)?.closest('.col-md-6').remove();
        saveCalendar();
        showAlert('Content deleted successfully!', 'success');
    }
}

// Change calendar view
function changeView(view) {
    const calendar = document.querySelector('#calendar').FullCalendar;
    calendar.changeView(view);
} 