// Link Tree Creator functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeLinkTree();
    setupEventListeners();
    initializeAnalytics();
    loadSavedLinkTree();
});

let linkTree = {
    profile: {
        name: '',
        bio: ''
    },
    theme: 'gradient',
    colors: {
        background: '#ffffff',
        text: '#000000',
        button: '#6366f1'
    },
    links: [],
    socialIcons: {
        instagram: false,
        twitter: false,
        facebook: false,
        linkedin: false
    }
};

// Initialize link tree
function initializeLinkTree() {
    setupColorPickers();
    setupSortableLinks();
    generateQRCode();
    updatePreview();
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('linkTreeForm')?.addEventListener('submit', handleFormSubmit);

    // Profile info changes
    document.getElementById('profileName')?.addEventListener('input', updatePreview);
    document.getElementById('profileBio')?.addEventListener('input', updatePreview);

    // Color changes
    document.getElementById('bgColor')?.addEventListener('input', handleColorChange);
    document.getElementById('textColor')?.addEventListener('input', handleColorChange);
    document.getElementById('buttonColor')?.addEventListener('input', handleColorChange);

    // Social icons changes
    document.querySelectorAll('#socialIcons input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            linkTree.socialIcons[checkbox.id] = checkbox.checked;
            updatePreview();
        });
    });
}

// Setup color pickers
function setupColorPickers() {
    document.getElementById('bgColor').value = linkTree.colors.background;
    document.getElementById('textColor').value = linkTree.colors.text;
    document.getElementById('buttonColor').value = linkTree.colors.button;
}

// Handle color change
function handleColorChange(e) {
    const type = e.target.id.replace('Color', '');
    linkTree.colors[type] = e.target.value;
    updatePreview();
}

// Setup sortable links
function setupSortableLinks() {
    // Initialize Sortable.js here if needed
    // For now, we'll just handle basic link ordering
}

// Add new link
function addLink() {
    const linksList = document.getElementById('linksList');
    const linkId = Date.now();

    const linkCard = document.createElement('div');
    linkCard.className = 'link-card p-3 mb-3 border';
    linkCard.dataset.id = linkId;
    linkCard.innerHTML = `
        <div class="d-flex align-items-center mb-2">
            <div class="link-handle me-2">
                <i class="fas fa-grip-vertical text-muted"></i>
            </div>
            <input type="text" class="form-control" placeholder="Link Title" onchange="updateLink(${linkId}, 'title', this.value)">
        </div>
        <div class="input-group">
            <input type="url" class="form-control" placeholder="URL" onchange="updateLink(${linkId}, 'url', this.value)">
            <button class="btn btn-outline-danger" onclick="removeLink(${linkId})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    linksList.appendChild(linkCard);
    linkTree.links.push({ id: linkId, title: '', url: '' });
    updatePreview();
}

// Update link
function updateLink(id, field, value) {
    const link = linkTree.links.find(l => l.id === id);
    if (link) {
        link[field] = value;
        updatePreview();
    }
}

// Remove link
function removeLink(id) {
    const index = linkTree.links.findIndex(l => l.id === id);
    if (index !== -1) {
        linkTree.links.splice(index, 1);
        document.querySelector(`[data-id="${id}"]`).remove();
        updatePreview();
    }
}

// Select theme
function selectTheme(theme) {
    document.querySelectorAll('.theme-preview').forEach(preview => {
        preview.classList.remove('active');
    });
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
    linkTree.theme = theme;
    updatePreview();
}

// Generate QR code
function generateQRCode() {
    const qr = qrcode(0, 'M');
    const url = window.location.href;
    qr.addData(url);
    qr.make();
    
    document.getElementById('qrCode').innerHTML = qr.createImgTag(5);
    document.getElementById('shareUrl').value = url;
}

// Download QR code
function downloadQR() {
    const qrImg = document.querySelector('#qrCode img');
    const link = document.createElement('a');
    link.download = 'linktree-qr.png';
    link.href = qrImg.src;
    link.click();
}

// Copy share URL
function copyShareUrl() {
    const shareUrl = document.getElementById('shareUrl');
    shareUrl.select();
    document.execCommand('copy');
    showAlert('URL copied to clipboard!', 'success');
}

// Update preview
function updatePreview() {
    const preview = document.getElementById('previewContent');
    const { name, bio } = linkTree.profile;
    const { background, text, button } = linkTree.colors;

    preview.style.backgroundColor = background;
    preview.style.color = text;

    preview.innerHTML = `
        <div class="text-center mb-4">
            <h2 style="color: ${text}">${name || 'Your Name'}</h2>
            <p style="color: ${text}">${bio || 'Your Bio'}</p>
        </div>

        ${linkTree.links.map(link => `
            <a href="${link.url}" class="preview-link" style="background-color: ${button}; color: white">
                ${link.title || 'Untitled Link'}
            </a>
        `).join('')}

        <div class="d-flex justify-content-center gap-3 mt-4">
            ${Object.entries(linkTree.socialIcons)
                .filter(([_, enabled]) => enabled)
                .map(([platform]) => `
                    <a href="#" class="fs-4" style="color: ${text}">
                        <i class="fab fa-${platform}"></i>
                    </a>
                `).join('')}
        </div>
    `;

    saveLinkTree();
}

// Initialize analytics
function initializeAnalytics() {
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Views',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: 'rgb(99, 102, 241)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    linkTree.profile.name = document.getElementById('profileName').value;
    linkTree.profile.bio = document.getElementById('profileBio').value;

    saveLinkTree();
    showAlert('Link Tree saved successfully!', 'success');
}

// Save link tree
function saveLinkTree() {
    localStorage.setItem('linkTree', JSON.stringify(linkTree));
}

// Load saved link tree
function loadSavedLinkTree() {
    const saved = localStorage.getItem('linkTree');
    if (saved) {
        linkTree = JSON.parse(saved);
        
        // Restore profile info
        document.getElementById('profileName').value = linkTree.profile.name;
        document.getElementById('profileBio').value = linkTree.profile.bio;

        // Restore theme
        selectTheme(linkTree.theme);

        // Restore colors
        document.getElementById('bgColor').value = linkTree.colors.background;
        document.getElementById('textColor').value = linkTree.colors.text;
        document.getElementById('buttonColor').value = linkTree.colors.button;

        // Restore social icons
        Object.entries(linkTree.socialIcons).forEach(([platform, enabled]) => {
            document.getElementById(platform).checked = enabled;
        });

        // Restore links
        const linksList = document.getElementById('linksList');
        linksList.innerHTML = '';
        linkTree.links.forEach(link => {
            const linkCard = document.createElement('div');
            linkCard.className = 'link-card p-3 mb-3 border';
            linkCard.dataset.id = link.id;
            linkCard.innerHTML = `
                <div class="d-flex align-items-center mb-2">
                    <div class="link-handle me-2">
                        <i class="fas fa-grip-vertical text-muted"></i>
                    </div>
                    <input type="text" class="form-control" placeholder="Link Title" value="${link.title}" onchange="updateLink(${link.id}, 'title', this.value)">
                </div>
                <div class="input-group">
                    <input type="url" class="form-control" placeholder="URL" value="${link.url}" onchange="updateLink(${link.id}, 'url', this.value)">
                    <button class="btn btn-outline-danger" onclick="removeLink(${link.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            linksList.appendChild(linkCard);
        });

        updatePreview();
    }
}

// Export as HTML
function exportHTML() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${linkTree.profile.name} - Link Tree</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            font-family: system-ui, sans-serif;
            background-color: ${linkTree.colors.background};
            color: ${linkTree.colors.text};
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }
        .link {
            display: block;
            padding: 15px;
            margin-bottom: 10px;
            background-color: ${linkTree.colors.button};
            color: white;
            text-decoration: none;
            border-radius: 8px;
            text-align: center;
            transition: transform 0.2s;
        }
        .link:hover {
            transform: translateY(-2px);
        }
        .social-icons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1>${linkTree.profile.name}</h1>
            <p>${linkTree.profile.bio}</p>
        </div>

        ${linkTree.links.map(link => `
            <a href="${link.url}" class="link" target="_blank">
                ${link.title}
            </a>
        `).join('')}

        <div class="social-icons">
            ${Object.entries(linkTree.socialIcons)
                .filter(([_, enabled]) => enabled)
                .map(([platform]) => `
                    <a href="#" style="color: ${linkTree.colors.text}">
                        <i class="fab fa-${platform}"></i>
                    </a>
                `).join('')}
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'linktree.html';
    link.click();
}

// Export as JSON
function exportJSON() {
    const json = JSON.stringify(linkTree, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'linktree.json';
    link.click();
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