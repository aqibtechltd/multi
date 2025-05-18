// Analytics Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    setupPlatformButtons();
    setupDateRangeSelector();
    loadDashboardData();
});

// Initialize all charts
function initializeCharts() {
    createEngagementChart();
    createGrowthChart();
    createGenderChart();
}

// Create engagement overview chart
function createEngagementChart() {
    const ctx = document.getElementById('engagementChart')?.getContext('2d');
    if (!ctx) return;

    const dates = getLast7Days();
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Likes',
                    data: [1200, 1350, 1250, 1420, 1550, 1350, 1480],
                    borderColor: '#dc3545',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Comments',
                    data: [250, 280, 260, 310, 320, 280, 290],
                    borderColor: '#0d6efd',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Shares',
                    data: [80, 95, 87, 110, 105, 90, 98],
                    borderColor: '#198754',
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create audience growth chart
function createGrowthChart() {
    const ctx = document.getElementById('growthChart')?.getContext('2d');
    if (!ctx) return;

    const dates = getLast7Days();
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'New Followers',
                data: [45, 52, 38, 65, 42, 48, 55],
                backgroundColor: '#0d6efd',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create gender distribution chart
function createGenderChart() {
    const ctx = document.getElementById('genderChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Female', 'Male', 'Other'],
            datasets: [{
                data: [58, 35, 7],
                backgroundColor: ['#ff6b6b', '#4dabf7', '#fab005'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    });
}

// Setup platform selection buttons
function setupPlatformButtons() {
    const buttons = document.querySelectorAll('.btn-group .btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            loadPlatformData(button.textContent.trim());
        });
    });
}

// Setup date range selector
function setupDateRangeSelector() {
    const selector = document.querySelector('.date-range-selector select');
    selector?.addEventListener('change', () => {
        loadDateRangeData(selector.value);
    });
}

// Load dashboard data based on selected platform and date range
function loadDashboardData() {
    // Simulate API call and data loading
    updateMetricCards();
    updateTopPosts();
}

// Update metric cards with new data
function updateMetricCards() {
    // In a real app, this would fetch data from an API
    animateMetricValue('totalFollowers', 12458);
    animateMetricValue('engagementRate', 4.2);
    animateMetricValue('postReach', 45300);
    animateMetricValue('profileVisits', 8924);
}

// Animate metric value changes
function animateMetricValue(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1000;
    const startValue = parseInt(element.textContent) || 0;
    const startTime = performance.now();

    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
        element.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }

    requestAnimationFrame(updateValue);
}

// Update top posts section
function updateTopPosts() {
    // In a real app, this would fetch data from an API
    const posts = [
        {
            title: 'Summer Collection Launch',
            time: '2 days ago',
            likes: 1200,
            comments: 234,
            shares: 89
        },
        {
            title: 'Behind the Scenes',
            time: '4 days ago',
            likes: 956,
            comments: 178,
            shares: 67
        },
        {
            title: 'Customer Success Story',
            time: '5 days ago',
            likes: 845,
            comments: 156,
            shares: 45
        }
    ];

    const container = document.querySelector('.top-posts');
    if (!container) return;

    container.innerHTML = posts.map(post => `
        <div class="top-post">
            <div class="d-flex align-items-center mb-2">
                <img src="https://via.placeholder.com/50" class="rounded me-3" alt="Post thumbnail">
                <div>
                    <h6 class="mb-1">${post.title}</h6>
                    <small class="text-muted">Posted ${post.time}</small>
                </div>
            </div>
            <div class="d-flex justify-content-between">
                <span><i class="bi bi-heart-fill text-danger"></i> ${post.likes} likes</span>
                <span><i class="bi bi-chat-fill text-primary"></i> ${post.comments} comments</span>
                <span><i class="bi bi-share-fill text-success"></i> ${post.shares} shares</span>
            </div>
        </div>
    `).join('');
}

// Load data for selected platform
function loadPlatformData(platform) {
    // Simulate API call and data loading
    console.log(`Loading data for ${platform}...`);
    loadDashboardData();
}

// Load data for selected date range
function loadDateRangeData(range) {
    // Simulate API call and data loading
    console.log(`Loading data for ${range}...`);
    loadDashboardData();
}

// Helper function to get last 7 days
function getLast7Days() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return dates;
}

// Helper function to format numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
} 