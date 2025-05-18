// Poll Creator functionality
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupTemplates();
    initializeChart();
});

let pollChart = null;

// Setup event listeners
function setupEventListeners() {
    document.getElementById('pollForm').addEventListener('submit', handlePollCreation);
    document.getElementById('addOptionBtn').addEventListener('click', addPollOption);
    document.getElementById('exportBtn').addEventListener('click', exportPoll);
    document.getElementById('copyBtn').addEventListener('click', copyPoll);
    document.getElementById('pollSettings').addEventListener('change', updatePreview);
    
    // Setup option removal
    document.querySelectorAll('.remove-option').forEach(btn => {
        btn.addEventListener('click', removeOption);
    });
}

// Setup templates
function setupTemplates() {
    document.querySelectorAll('.template-card').forEach(template => {
        template.addEventListener('click', () => {
            document.querySelectorAll('.template-card').forEach(t => t.classList.remove('active'));
            template.classList.add('active');
            
            const type = template.dataset.template;
            loadTemplate(type);
        });
    });
}

// Initialize chart
function initializeChart() {
    const ctx = document.getElementById('pollChart').getContext('2d');
    pollChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Votes',
                data: [],
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderColor: 'rgb(79, 70, 229)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Handle poll creation
function handlePollCreation(e) {
    e.preventDefault();
    
    const question = document.getElementById('pollQuestion').value;
    const options = Array.from(document.querySelectorAll('#pollOptions input')).map(input => input.value);
    const duration = document.getElementById('pollDuration').value;
    const platforms = getPlatformSelection();
    
    if (!validatePoll(question, options)) {
        showAlert('Please fill in all fields and add at least 2 options', 'warning');
        return;
    }
    
    updatePreview(question, options);
    showAlert('Poll created successfully!', 'success');
}

// Add poll option
function addPollOption() {
    const container = document.getElementById('pollOptions');
    const optionCount = container.children.length + 1;
    
    if (optionCount > 6) {
        showAlert('Maximum 6 options allowed', 'warning');
        return;
    }
    
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option-input mb-2';
    optionDiv.innerHTML = `
        <input type="text" class="form-control" placeholder="Option ${optionCount}">
        <i class="fas fa-times remove-option"></i>
    `;
    
    optionDiv.querySelector('.remove-option').addEventListener('click', removeOption);
    container.appendChild(optionDiv);
}

// Remove poll option
function removeOption(e) {
    const container = document.getElementById('pollOptions');
    if (container.children.length <= 2) {
        showAlert('Minimum 2 options required', 'warning');
        return;
    }
    
    e.target.closest('.option-input').remove();
    updateOptionPlaceholders();
}

// Update option placeholders
function updateOptionPlaceholders() {
    document.querySelectorAll('#pollOptions input').forEach((input, index) => {
        input.placeholder = `Option ${index + 1}`;
    });
}

// Get platform selection
function getPlatformSelection() {
    const platforms = {};
    ['instagram', 'facebook', 'twitter', 'linkedin'].forEach(platform => {
        platforms[platform] = document.getElementById(platform).checked;
    });
    return platforms;
}

// Validate poll
function validatePoll(question, options) {
    if (!question) return false;
    if (options.length < 2) return false;
    if (options.some(option => !option)) return false;
    return true;
}

// Update preview
function updatePreview(question, options) {
    // Update poll preview
    const preview = document.getElementById('pollPreview');
    const style = document.getElementById('pollStyle').value;
    const colorScheme = document.getElementById('colorScheme').value;
    
    preview.innerHTML = `
        <div class="mb-4">
            <h5 class="mb-3">${question}</h5>
            <div class="poll-options">
                ${options.map((option, index) => `
                    <div class="poll-option" onclick="vote(${index})">
                        ${option}
                    </div>
                `).join('')}
            </div>
            <div class="text-muted mt-2">
                <small>Duration: ${document.getElementById('pollDuration').value} days</small>
            </div>
        </div>
    `;
    
    // Apply styles
    applyStyle(style, colorScheme);
    
    // Update chart
    updateChart(options);
}

// Apply style
function applyStyle(style, colorScheme) {
    const options = document.querySelectorAll('.poll-option');
    
    options.forEach(option => {
        option.className = 'poll-option mb-2';
        
        switch (style) {
            case 'modern':
                option.classList.add('shadow-sm');
                break;
            case 'classic':
                option.style.border = '1px solid #dee2e6';
                break;
            case 'minimal':
                option.classList.add('border-bottom');
                break;
        }
        
        switch (colorScheme) {
            case 'gradient':
                option.style.background = 'linear-gradient(45deg, #4f46e5, #6366f1)';
                option.style.color = 'white';
                break;
            case 'monochrome':
                option.style.background = '#f8f9fa';
                option.style.color = '#212529';
                break;
        }
    });
}

// Update chart
function updateChart(options) {
    pollChart.data.labels = options;
    pollChart.data.datasets[0].data = options.map(() => Math.floor(Math.random() * 100));
    pollChart.update();
}

// Vote function
function vote(index) {
    if (!document.getElementById('showResults').checked) {
        showAlert('Voting is disabled in preview mode', 'info');
        return;
    }
    
    const options = document.querySelectorAll('.poll-option');
    const allowMultiple = document.getElementById('allowMultiple').checked;
    
    if (!allowMultiple) {
        options.forEach(option => option.classList.remove('selected'));
    }
    
    options[index].classList.toggle('selected');
    
    // Update chart
    pollChart.data.datasets[0].data[index]++;
    pollChart.update();
}

// Load template
function loadTemplate(type) {
    const templates = {
        feedback: {
            question: 'How satisfied are you with our service?',
            options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied']
        },
        preference: {
            question: 'Which feature would you like to see next?',
            options: ['Feature A', 'Feature B', 'Feature C']
        },
        engagement: {
            question: 'What content do you enjoy most?',
            options: ['Photos', 'Videos', 'Stories', 'Live Streams']
        }
    };
    
    const template = templates[type];
    document.getElementById('pollQuestion').value = template.question;
    
    const container = document.getElementById('pollOptions');
    container.innerHTML = template.options.map((option, index) => `
        <div class="option-input mb-2">
            <input type="text" class="form-control" placeholder="Option ${index + 1}" value="${option}">
            <i class="fas fa-times remove-option"></i>
        </div>
    `).join('');
    
    document.querySelectorAll('.remove-option').forEach(btn => {
        btn.addEventListener('click', removeOption);
    });
    
    updatePreview(template.question, template.options);
}

// Export poll
function exportPoll() {
    const pollData = {
        question: document.getElementById('pollQuestion').value,
        options: Array.from(document.querySelectorAll('#pollOptions input')).map(input => input.value),
        settings: {
            duration: document.getElementById('pollDuration').value,
            platforms: getPlatformSelection(),
            style: document.getElementById('pollStyle').value,
            colorScheme: document.getElementById('colorScheme').value,
            showResults: document.getElementById('showResults').checked,
            allowMultiple: document.getElementById('allowMultiple').checked,
            requireLogin: document.getElementById('requireLogin').checked
        }
    };
    
    const blob = new Blob([JSON.stringify(pollData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'poll-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('Poll data exported successfully!', 'success');
}

// Copy poll
function copyPoll() {
    const pollData = {
        question: document.getElementById('pollQuestion').value,
        options: Array.from(document.querySelectorAll('#pollOptions input')).map(input => input.value),
        duration: document.getElementById('pollDuration').value
    };
    
    const text = `📊 ${pollData.question}\n\n${pollData.options.map((option, index) => `${index + 1}. ${option}`).join('\n')}\n\nDuration: ${pollData.duration} days`;
    
    navigator.clipboard.writeText(text)
        .then(() => showAlert('Poll copied to clipboard!', 'success'))
        .catch(() => showAlert('Failed to copy poll', 'error'));
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