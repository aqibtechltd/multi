document.addEventListener('DOMContentLoaded', () => {
    initializeDateRangePicker();
    initializeGrowthChart();
    setupEventListeners();
    generateDummyData();
});

let growthChart = null;
let currentData = {
    instagram: [],
    facebook: [],
    twitter: [],
    linkedin: []
};

// Initialize date range picker
function initializeDateRangePicker() {
    $('#dateRange').daterangepicker({
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, (start, end) => {
        updateChartData(start, end);
    });
}

// Initialize growth chart
function initializeGrowthChart() {
    const ctx = document.getElementById('growthChart').getContext('2d');
    growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Instagram',
                    borderColor: '#E1306C',
                    backgroundColor: 'rgba(225, 48, 108, 0.1)',
                    data: []
                },
                {
                    label: 'Facebook',
                    borderColor: '#1877F2',
                    backgroundColor: 'rgba(24, 119, 242, 0.1)',
                    data: []
                },
                {
                    label: 'Twitter',
                    borderColor: '#1DA1F2',
                    backgroundColor: 'rgba(29, 161, 242, 0.1)',
                    data: []
                },
                {
                    label: 'LinkedIn',
                    borderColor: '#0A66C2',
                    backgroundColor: 'rgba(10, 102, 194, 0.1)',
                    data: []
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
                    beginAtZero: false,
                    ticks: {
                        callback: value => formatNumber(value)
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.4
                }
            }
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Time range buttons
    document.querySelectorAll('[data-range]').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-range]').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateTimeRange(button.dataset.range);
        });
    });

    // Export buttons
    document.getElementById('exportCSV').addEventListener('click', exportCSV);
    document.getElementById('exportPDF').addEventListener('click', exportPDF);
    document.getElementById('exportJSON').addEventListener('click', exportJSON);
}

// Generate dummy data
function generateDummyData() {
    const platforms = ['instagram', 'facebook', 'twitter', 'linkedin'];
    const startDate = moment().subtract(365, 'days');
    
    platforms.forEach(platform => {
        let followers = getInitialFollowers(platform);
        currentData[platform] = [];
        
        for (let i = 0; i < 365; i++) {
            const date = moment(startDate).add(i, 'days');
            const change = Math.floor(Math.random() * 200) - 50;
            followers += change;
            
            currentData[platform].push({
                date: date.format('YYYY-MM-DD'),
                followers: followers
            });
        }
    });
    
    updateChartData(moment().subtract(29, 'days'), moment());
}

// Get initial followers for each platform
function getInitialFollowers(platform) {
    const initialFollowers = {
        instagram: 15000,
        facebook: 8500,
        twitter: 12000,
        linkedin: 5500
    };
    return initialFollowers[platform];
}

// Update chart data based on date range
function updateChartData(start, end) {
    const labels = [];
    const datasets = growthChart.data.datasets;
    
    // Clear existing data
    datasets.forEach(dataset => dataset.data = []);
    
    // Generate dates between start and end
    const current = moment(start);
    while (current <= end) {
        labels.push(current.format('MMM D'));
        
        Object.keys(currentData).forEach((platform, index) => {
            const data = currentData[platform].find(d => d.date === current.format('YYYY-MM-DD'));
            if (data) {
                datasets[index].data.push(data.followers);
            }
        });
        
        current.add(1, 'days');
    }
    
    growthChart.data.labels = labels;
    growthChart.update();
}

// Update time range
function updateTimeRange(range) {
    const end = moment();
    let start;
    
    switch (range) {
        case 'week':
            start = moment().subtract(6, 'days');
            break;
        case 'month':
            start = moment().subtract(29, 'days');
            break;
        case 'year':
            start = moment().subtract(364, 'days');
            break;
    }
    
    $('#dateRange').data('daterangepicker').setStartDate(start);
    $('#dateRange').data('daterangepicker').setEndDate(end);
    updateChartData(start, end);
}

// Export functions
function exportCSV() {
    const data = prepareExportData();
    const csv = convertToCSV(data);
    downloadFile(csv, 'follower-growth.csv', 'text/csv');
}

function exportPDF() {
    showAlert('PDF export feature coming soon!', 'info');
}

function exportJSON() {
    const data = prepareExportData();
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, 'follower-growth.json', 'application/json');
}

// Helper functions
function prepareExportData() {
    const data = [];
    const platforms = Object.keys(currentData);
    
    currentData[platforms[0]].forEach(item => {
        const row = { date: item.date };
        platforms.forEach(platform => {
            const platformData = currentData[platform].find(d => d.date === item.date);
            row[platform] = platformData ? platformData.followers : 0;
        });
        data.push(row);
    });
    
    return data;
}

function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const rows = [headers.join(',')];
    
    data.forEach(item => {
        const row = headers.map(header => item[header]);
        rows.push(row.join(','));
    });
    
    return rows.join('\n');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function formatNumber(value) {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
    }
    return value;
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