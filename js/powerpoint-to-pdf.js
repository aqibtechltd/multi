// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

let selectedFile = null;
let slideImages = [];

// Setup event listeners
function setupEventListeners() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

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
    const file = e.target.files[0];
    
    if (!file) return;

    // Check file type
    if (!file.name.match(/\.(ppt|pptx)$/i)) {
        showAlert('Please select a valid PowerPoint presentation (PPT/PPTX)', 'warning');
        return;
    }

    // Check file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
        showAlert('File size should not exceed 20MB', 'warning');
        return;
    }

    selectedFile = file;
    updateFileInfo();
    processPresentation();
    document.getElementById('convertButton').disabled = false;
}

// Update file information
function updateFileInfo() {
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');

    fileName.textContent = selectedFile.name;
    fileSize.textContent = formatFileSize(selectedFile.size);
    fileInfo.classList.remove('d-none');
}

// Process PowerPoint presentation
async function processPresentation() {
    const previewArea = document.getElementById('previewArea');
    const previewContainer = document.getElementById('previewContainer');
    const progressBar = document.getElementById('progressBar');

    progressBar.classList.remove('d-none');
    updateProgress(20);

    try {
        const arrayBuffer = await readFileAsArrayBuffer(selectedFile);
        updateProgress(40);

        // Clear previous preview
        previewContainer.innerHTML = '';
        slideImages = [];

        // Use pptxjs to process the presentation
        const pptx = new PptxGenJS();
        await pptx.load(arrayBuffer);
        
        // Get slides
        const slides = pptx.getSlides();
        updateProgress(60);

        // Generate preview for each slide
        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i];
            const slideImage = await generateSlidePreview(slide, i + 1);
            slideImages.push(slideImage);

            const slidePreview = document.createElement('div');
            slidePreview.className = 'slide-preview';
            slidePreview.innerHTML = `
                <img src="${slideImage}" alt="Slide ${i + 1}">
                <div class="slide-number">Slide ${i + 1}</div>
            `;
            previewContainer.appendChild(slidePreview);
        }

        previewArea.classList.remove('d-none');
        updateProgress(100);

        // Hide progress bar after completion
        setTimeout(() => {
            progressBar.classList.add('d-none');
            updateProgress(0);
        }, 500);
    } catch (error) {
        console.error('Error processing presentation:', error);
        showAlert('Error processing presentation. Please try again.', 'error');
        progressBar.classList.add('d-none');
    }
}

// Generate preview for a slide
async function generateSlidePreview(slide, index) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size based on slide aspect ratio
        canvas.width = 1280;
        canvas.height = 720;

        // Draw slide content
        slide.render(ctx);

        // Convert to image
        resolve(canvas.toDataURL('image/jpeg', 0.7));
    });
}

// Convert to PDF
async function convertToPDF() {
    if (!selectedFile || slideImages.length === 0) {
        showAlert('Please select a PowerPoint presentation', 'warning');
        return;
    }

    const convertButton = document.getElementById('convertButton');
    const progressBar = document.getElementById('progressBar');
    
    convertButton.disabled = true;
    convertButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
    progressBar.classList.remove('d-none');
    updateProgress(20);

    try {
        // Get PDF options
        const pageSize = document.getElementById('pageSize').value;
        const quality = document.getElementById('quality').value;
        const includeNotes = document.getElementById('includeNotes').value;
        const showSlideNumbers = document.getElementById('slideNumbers').value === 'show';

        // Create PDF
        const pdf = new jsPDF({
            orientation: pageSize === 'a4' || pageSize === 'letter' ? 'portrait' : 'landscape',
            unit: 'mm',
            format: pageSize === '16:9' ? [297, 167] : 
                   pageSize === '4:3' ? [297, 223] :
                   pageSize
        });

        // Add each slide to PDF
        for (let i = 0; i < slideImages.length; i++) {
            if (i > 0) pdf.addPage();

            // Add slide
            const img = slideImages[i];
            pdf.addImage(img, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());

            // Add slide number if enabled
            if (showSlideNumbers) {
                pdf.setFontSize(10);
                pdf.setTextColor(100);
                pdf.text(`${i + 1}/${slideImages.length}`, 
                    pdf.internal.pageSize.getWidth() - 20, 
                    pdf.internal.pageSize.getHeight() - 10
                );
            }

            updateProgress(20 + (60 * (i + 1) / slideImages.length));
        }

        // Save PDF
        pdf.save(selectedFile.name.replace(/\.(ppt|pptx)$/i, '.pdf'));
        updateProgress(100);

        showAlert('PDF created successfully!', 'success');
    } catch (error) {
        console.error('Error converting to PDF:', error);
        showAlert('Error creating PDF. Please try again.', 'error');
    } finally {
        convertButton.disabled = false;
        convertButton.innerHTML = '<i class="fas fa-file-pdf"></i> Convert to PDF';
        progressBar.classList.add('d-none');
        updateProgress(0);
    }
}

// Read file as ArrayBuffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Update progress bar
function updateProgress(percent) {
    const progressBar = document.querySelector('#progressBar .progress-bar');
    progressBar.style.width = `${percent}%`;
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