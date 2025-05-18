// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

let selectedFile = null;
let workbook = null;

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
    if (!file.name.match(/\.(xls|xlsx)$/i)) {
        showAlert('Please select a valid Excel spreadsheet (XLS/XLSX)', 'warning');
        return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        showAlert('File size should not exceed 10MB', 'warning');
        return;
    }

    selectedFile = file;
    updateFileInfo();
    processSpreadsheet();
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

// Process Excel spreadsheet
async function processSpreadsheet() {
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

        // Parse Excel file
        workbook = XLSX.read(arrayBuffer, { type: 'array' });
        updateProgress(60);

        // Generate preview for each sheet
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const html = XLSX.utils.sheet_to_html(sheet);
            
            const sheetPreview = document.createElement('div');
            sheetPreview.className = 'sheet-preview';
            sheetPreview.innerHTML = `
                <div class="sheet-name">${sheetName}</div>
                <div class="table-responsive">
                    ${html}
                </div>
            `;
            previewContainer.appendChild(sheetPreview);
        });

        previewArea.classList.remove('d-none');
        updateProgress(100);

        // Hide progress bar after completion
        setTimeout(() => {
            progressBar.classList.add('d-none');
            updateProgress(0);
        }, 500);
    } catch (error) {
        console.error('Error processing spreadsheet:', error);
        showAlert('Error processing spreadsheet. Please try again.', 'error');
        progressBar.classList.add('d-none');
    }
}

// Convert to PDF
async function convertToPDF() {
    if (!selectedFile || !workbook) {
        showAlert('Please select an Excel spreadsheet', 'warning');
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
        const orientation = document.getElementById('orientation').value;
        const scale = document.getElementById('scale').value;
        const quality = document.getElementById('quality').value;

        // Create PDF
        const pdf = new jsPDF({
            orientation: orientation === 'landscape' ? 'landscape' : 'portrait',
            unit: 'mm',
            format: pageSize
        });

        // Process each sheet
        for (let i = 0; i < workbook.SheetNames.length; i++) {
            if (i > 0) pdf.addPage();

            const sheetName = workbook.SheetNames[i];
            const sheet = workbook.Sheets[sheetName];
            
            // Convert sheet to HTML
            const html = XLSX.utils.sheet_to_html(sheet);
            
            // Create temporary container
            const container = document.createElement('div');
            container.innerHTML = html;
            document.body.appendChild(container);

            // Convert to canvas
            const canvas = await html2canvas(container, {
                scale: quality === 'high' ? 2 : quality === 'medium' ? 1.5 : 1,
                useCORS: true,
                logging: false
            });

            // Add to PDF
            const imgData = canvas.toDataURL('image/jpeg', quality === 'high' ? 1 : quality === 'medium' ? 0.8 : 0.6);
            
            // Calculate dimensions
            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

            // Add sheet name
            pdf.setFontSize(12);
            pdf.setTextColor(100);
            pdf.text(sheetName, 10, 10);

            // Remove temporary container
            document.body.removeChild(container);

            updateProgress(20 + (60 * (i + 1) / workbook.SheetNames.length));
        }

        // Save PDF
        pdf.save(selectedFile.name.replace(/\.(xls|xlsx)$/i, '.pdf'));
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