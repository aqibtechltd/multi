// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

let selectedFiles = [];

// Setup event listeners
function setupEventListeners() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewArea = document.getElementById('previewArea');
    const previewContainer = document.getElementById('previewContainer');
    const convertButton = document.getElementById('convertButton');

    // Setup drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFiles);
}

// Prevent default drag behaviors
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop zone when dragging over it
function highlight(e) {
    document.getElementById('dropZone').classList.add('dragover');
}

// Remove highlight
function unhighlight(e) {
    document.getElementById('dropZone').classList.remove('dragover');
}

// Handle dropped files
function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files } });
}

// Handle file selection
function handleFiles(e) {
    const newFiles = Array.from(e.target.files).filter(file => {
        // Check file type
        if (!file.type.match('image/jpeg')) {
            showAlert('Only JPG/JPEG images are supported', 'warning');
            return false;
        }
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            showAlert('File size should not exceed 10MB', 'warning');
            return false;
        }
        return true;
    });

    if (newFiles.length === 0) return;

    selectedFiles = [...selectedFiles, ...newFiles];
    updatePreview();
    document.getElementById('previewArea').classList.remove('d-none');
    document.getElementById('convertButton').disabled = false;
}

// Update preview
function updatePreview() {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.createElement('div');
            preview.className = 'preview-item';
            preview.innerHTML = `
                <button class="btn btn-sm btn-outline-danger remove-button" onclick="removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="text-center">
                    <img src="${e.target.result}" alt="${file.name}" class="mb-2">
                    <h6 class="mb-1">${file.name}</h6>
                    <p class="text-muted small mb-0">${formatFileSize(file.size)}</p>
                    <div class="progress mt-2 d-none">
                        <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                    </div>
                </div>
            `;
            previewContainer.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
}

// Remove file
function removeFile(index) {
    selectedFiles.splice(index, 1);
    updatePreview();
    if (selectedFiles.length === 0) {
        document.getElementById('previewArea').classList.add('d-none');
        document.getElementById('convertButton').disabled = true;
    }
}

// Convert images to PDF
async function convertToPDF() {
    if (selectedFiles.length === 0) {
        showAlert('Please select at least one image', 'warning');
        return;
    }

    const pageSize = document.getElementById('pageSize').value;
    const orientation = document.getElementById('orientation').value;
    const quality = document.getElementById('quality').value;
    const imagesPerPage = parseInt(document.getElementById('imagesPerPage').value);

    // Disable convert button
    const convertButton = document.getElementById('convertButton');
    convertButton.disabled = true;
    convertButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';

    try {
        // Create PDF document
        const pdf = new jsPDF({
            orientation: orientation === 'auto' ? 'portrait' : orientation,
            unit: 'mm',
            format: pageSize === 'auto' ? [210, 297] : pageSize // Default to A4 if auto
        });

        // Calculate image dimensions based on page size and orientation
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Calculate image dimensions based on images per page
        const imageWidth = pageWidth / (imagesPerPage === 4 ? 2 : 1);
        const imageHeight = pageHeight / (imagesPerPage >= 2 ? 2 : 1);

        let currentPage = 1;
        let currentPosition = 0;

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const img = await loadImage(file);
            
            // Update progress
            const progressBar = document.querySelectorAll('.progress')[i];
            const progressBarInner = progressBar.querySelector('.progress-bar');
            progressBar.classList.remove('d-none');
            progressBarInner.style.width = '50%';

            // Calculate position on page
            const x = (currentPosition % 2) * imageWidth;
            const y = Math.floor((currentPosition % 4) / 2) * imageHeight;

            // Add new page if needed
            if (currentPosition > 0 && currentPosition % imagesPerPage === 0) {
                pdf.addPage();
                currentPage++;
            }

            // Add image to PDF
            pdf.addImage(
                img,
                'JPEG',
                x,
                y,
                imageWidth,
                imageHeight,
                '',
                quality === 'low' ? 'FAST' : quality === 'high' ? 'SLOW' : 'MEDIUM'
            );

            currentPosition++;
            progressBarInner.style.width = '100%';
        }

        // Save PDF
        pdf.save('converted-images.pdf');
        showAlert('PDF created successfully!', 'success');
    } catch (error) {
        console.error(error);
        showAlert('Error creating PDF. Please try again.', 'error');
    }

    // Reset convert button
    convertButton.disabled = false;
    convertButton.innerHTML = '<i class="fas fa-file-pdf"></i> Convert to PDF';
}

// Load image as promise
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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