document.addEventListener('DOMContentLoaded', () => {
    initializePlatformSelection();
    setupEventListeners();
    setupQualitySlider();
});

let cropper = null;
let selectedPlatforms = new Set();

const platformDimensions = {
    instagram: { width: 1080, height: 1080 },
    facebook: { width: 1200, height: 630 },
    twitter: { width: 1600, height: 900 },
    linkedin: { width: 1200, height: 627 }
};

// Initialize platform selection
function initializePlatformSelection() {
    document.querySelectorAll('.platform-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('active');
            const platform = card.dataset.platform;
            if (selectedPlatforms.has(platform)) {
                selectedPlatforms.delete(platform);
            } else {
                selectedPlatforms.add(platform);
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('imageInput').addEventListener('change', handleImageUpload);
    document.getElementById('imageOptions').addEventListener('submit', handleImageGeneration);
    document.getElementById('downloadAllBtn').addEventListener('click', downloadAllImages);
    document.getElementById('maintainAspectRatio').addEventListener('change', updateCropper);
    document.getElementById('format').addEventListener('change', updatePreview);
}

// Setup quality slider
function setupQualitySlider() {
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    
    quality.addEventListener('input', () => {
        qualityValue.textContent = quality.value + '%';
        updatePreview();
    });
}

// Handle image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = document.getElementById('imagePreview');
        img.src = event.target.result;
        
        if (cropper) {
            cropper.destroy();
        }
        
        cropper = new Cropper(img, {
            aspectRatio: NaN,
            viewMode: 2,
            autoCropArea: 1,
            responsive: true,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false
        });
    };
    reader.readAsDataURL(file);
}

// Handle image generation
async function handleImageGeneration(e) {
    e.preventDefault();
    
    if (!cropper) {
        showAlert('Please upload an image first', 'warning');
        return;
    }
    
    if (selectedPlatforms.size === 0) {
        showAlert('Please select at least one platform', 'warning');
        return;
    }

    showLoader();
    const container = document.getElementById('generatedImages');
    container.innerHTML = '';

    try {
        for (const platform of selectedPlatforms) {
            const dimensions = platformDimensions[platform];
            const resizedImage = await resizeImage(dimensions, platform);
            addGeneratedImage(resizedImage, platform);
        }
        showAlert('Images generated successfully!', 'success');
    } catch (error) {
        showAlert('Error generating images', 'error');
        console.error(error);
    }
    
    hideLoader();
}

// Resize image for platform
async function resizeImage(dimensions, platform) {
    const maintainAspectRatio = document.getElementById('maintainAspectRatio').checked;
    const format = document.getElementById('format').value;
    const quality = parseInt(document.getElementById('quality').value) / 100;

    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const croppedCanvas = cropper.getCroppedCanvas();
    
    if (maintainAspectRatio) {
        const scale = Math.min(
            dimensions.width / croppedCanvas.width,
            dimensions.height / croppedCanvas.height
        );
        const newWidth = croppedCanvas.width * scale;
        const newHeight = croppedCanvas.height * scale;
        const x = (dimensions.width - newWidth) / 2;
        const y = (dimensions.height - newHeight) / 2;
        
        ctx.drawImage(croppedCanvas, x, y, newWidth, newHeight);
    } else {
        ctx.drawImage(croppedCanvas, 0, 0, dimensions.width, dimensions.height);
    }

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve({
                url: URL.createObjectURL(blob),
                blob: blob,
                platform: platform,
                dimensions: dimensions
            });
        }, `image/${format}`, quality);
    });
}

// Add generated image to container
function addGeneratedImage(image, platform) {
    const container = document.getElementById('generatedImages');
    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.innerHTML = `
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                    <i class="fab fa-${platform}"></i> ${platform.charAt(0).toUpperCase() + platform.slice(1)}
                </h6>
                <small class="text-muted">${image.dimensions.width}x${image.dimensions.height}</small>
            </div>
            <div class="aspect-ratio-box">
                <img src="${image.url}" alt="${platform} image">
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
                <button class="btn btn-sm btn-outline-primary" onclick="downloadImage('${image.url}', '${platform}')">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="btn btn-sm btn-outline-secondary" onclick="previewImage('${image.url}')">
                    <i class="fas fa-eye"></i> Preview
                </button>
            </div>
        </div>
    `;
    container.appendChild(col);
}

// Download single image
function downloadImage(url, platform) {
    const format = document.getElementById('format').value;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${platform}-image.${format}`;
    link.click();
}

// Download all images
async function downloadAllImages() {
    const images = document.querySelectorAll('#generatedImages img');
    if (images.length === 0) {
        showAlert('No images to download', 'warning');
        return;
    }

    showLoader();
    try {
        const zip = new JSZip();
        const format = document.getElementById('format').value;

        const promises = Array.from(images).map(async (img, index) => {
            const response = await fetch(img.src);
            const blob = await response.blob();
            const platform = img.closest('.card').querySelector('h6').textContent.trim().toLowerCase();
            zip.file(`${platform}-image.${format}`, blob);
        });

        await Promise.all(promises);
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'social-media-images.zip';
        link.click();
        
        URL.revokeObjectURL(url);
        showAlert('Images downloaded successfully!', 'success');
    } catch (error) {
        showAlert('Error downloading images', 'error');
        console.error(error);
    }
    hideLoader();
}

// Preview image in modal
function previewImage(url) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Image Preview</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <img src="${url}" class="img-fluid" alt="Preview">
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    modal.addEventListener('hidden.bs.modal', () => {
        modal.remove();
    });
}

// Update cropper settings
function updateCropper() {
    if (!cropper) return;
    
    const maintainAspectRatio = document.getElementById('maintainAspectRatio').checked;
    cropper.setAspectRatio(maintainAspectRatio ? NaN : 1);
}

// Update preview when options change
function updatePreview() {
    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        document.getElementById('imagePreview').src = url;
    });
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