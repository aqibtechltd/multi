// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

let selectedFile = null;

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
    if (!file.name.match(/\.(doc|docx)$/i)) {
        showAlert('Please select a valid Word document (DOC/DOCX)', 'warning');
        return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        showAlert('File size should not exceed 10MB', 'warning');
        return;
    }

    selectedFile = file;
    updateFileInfo();
    previewDocument();
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

// Preview document
async function previewDocument() {
    const previewArea = document.getElementById('previewArea');
    const previewContent = document.getElementById('previewContent');
    const progressBar = document.getElementById('progressBar');

    progressBar.classList.remove('d-none');
    updateProgress(20);

    try {
        const arrayBuffer = await readFileAsArrayBuffer(selectedFile);
        updateProgress(40);

        const result = await mammoth.convertToHtml({ arrayBuffer });
        updateProgress(80);

        previewContent.innerHTML = result.value;
        previewArea.classList.remove('d-none');
        updateProgress(100);

        // Hide progress bar after completion
        setTimeout(() => {
            progressBar.classList.add('d-none');
            updateProgress(0);
        }, 500);
    } catch (error) {
        console.error('Error previewing document:', error);
        showAlert('Error previewing document. Please try again.', 'error');
        progressBar.classList.add('d-none');
    }
}

// Convert to PDF
async function convertToPDF() {
    if (!selectedFile) {
        showAlert('Please select a Word document', 'warning');
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
        const fontSize = document.getElementById('fontSize').value;
        const margins = document.getElementById('margins').value;
        const quality = document.getElementById('quality').value;

        // Convert Word to HTML
        const arrayBuffer = await readFileAsArrayBuffer(selectedFile);
        updateProgress(40);
        
        const result = await mammoth.convertToHtml({ arrayBuffer });
        updateProgress(60);

        // Apply styles based on options
        const styledHtml = applyStyles(result.value, fontSize, margins);
        document.getElementById('previewContent').innerHTML = styledHtml;
        updateProgress(80);

        // Convert HTML to PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: pageSize
        });

        // Calculate margins in mm
        const marginSizes = {
            narrow: 12.7,
            normal: 25.4,
            wide: 31.8
        };
        const margin = marginSizes[margins];

        const element = document.getElementById('previewContent');
        const pdfOptions = {
            margin: [margin, margin, margin, margin],
            html2canvas: {
                scale: quality === 'high' ? 2 : quality === 'medium' ? 1.5 : 1
            }
        };

        // Convert HTML content to PDF
        await html2pdf().from(element).set(pdfOptions).save(selectedFile.name.replace(/\.(doc|docx)$/i, '.pdf'));
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

// Apply styles based on selected options
function applyStyles(html, fontSize, margins) {
    const fontSizes = {
        small: '12pt',
        medium: '14pt',
        large: '16pt',
        original: 'inherit'
    };

    const marginSizes = {
        narrow: '1.27cm',
        normal: '2.54cm',
        wide: '3.18cm'
    };

    const styledHtml = `
        <div style="
            font-size: ${fontSizes[fontSize]};
            margin: ${marginSizes[margins]};
            font-family: Arial, sans-serif;
            line-height: 1.6;
        ">
            ${html}
        </div>
    `;

    return styledHtml;
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