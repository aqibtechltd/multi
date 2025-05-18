document.addEventListener('DOMContentLoaded', () => {
    initializeColorPicker();
    setupEventListeners();
    setupRangeInputs();
    setupPresetWatermarks();
    setupPositionButtons();
});

let originalImage = null;

// Initialize color picker
function initializeColorPicker() {
    $('#watermarkColor').spectrum({
        type: 'component',
        showAlpha: true,
        showInput: true,
        preferredFormat: 'hex',
        change: updateWatermark
    });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('imageInput').addEventListener('change', handleImageUpload);
    document.getElementById('watermarkOptions').addEventListener('submit', applyWatermark);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    document.getElementById('watermarkText').addEventListener('input', updateWatermark);
    document.getElementById('fontFamily').addEventListener('change', updateWatermark);
}

// Setup range inputs
function setupRangeInputs() {
    const ranges = {
        fontSize: 'px',
        opacity: '%',
        rotation: '°',
        quality: '%'
    };

    Object.entries(ranges).forEach(([id, unit]) => {
        const input = document.getElementById(id);
        const value = document.getElementById(`${id}Value`);
        
        input.addEventListener('input', () => {
            value.textContent = input.value + unit;
            updateWatermark();
        });
    });
}

// Setup preset watermarks
function setupPresetWatermarks() {
    document.querySelectorAll('.preset-watermark').forEach(preset => {
        preset.addEventListener('click', () => {
            document.querySelectorAll('.preset-watermark').forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
            
            const type = preset.dataset.type;
            switch (type) {
                case 'text':
                    setWatermarkOptions({
                        text: '© Your Brand',
                        font: 'Arial',
                        size: '24',
                        color: '#000000',
                        opacity: '50',
                        rotation: '0'
                    });
                    break;
                case 'logo':
                    setWatermarkOptions({
                        text: '©',
                        font: 'Arial',
                        size: '48',
                        color: '#000000',
                        opacity: '30',
                        rotation: '0'
                    });
                    break;
                case 'signature':
                    setWatermarkOptions({
                        text: 'Your Signature',
                        font: 'cursive',
                        size: '36',
                        color: '#000000',
                        opacity: '70',
                        rotation: '-15'
                    });
                    break;
            }
        });
    });
}

// Setup position buttons
function setupPositionButtons() {
    document.querySelectorAll('.position-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.position-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateWatermark();
        });
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
        
        img.onload = () => {
            originalImage = img;
            updateWatermark();
        };
    };
    reader.readAsDataURL(file);
}

// Set watermark options
function setWatermarkOptions(options) {
    document.getElementById('watermarkText').value = options.text;
    document.getElementById('fontFamily').value = options.font;
    document.getElementById('fontSize').value = options.size;
    document.getElementById('fontSizeValue').textContent = options.size + 'px';
    $('#watermarkColor').spectrum('set', options.color);
    document.getElementById('opacity').value = options.opacity;
    document.getElementById('opacityValue').textContent = options.opacity + '%';
    document.getElementById('rotation').value = options.rotation;
    document.getElementById('rotationValue').textContent = options.rotation + '°';
    
    updateWatermark();
}

// Update watermark preview
function updateWatermark() {
    if (!originalImage) return;

    const watermark = document.getElementById('watermarkPreview');
    const options = getWatermarkOptions();

    watermark.style.color = options.color;
    watermark.style.fontFamily = options.fontFamily;
    watermark.style.fontSize = options.fontSize + 'px';
    watermark.style.opacity = options.opacity / 100;
    watermark.style.transform = `rotate(${options.rotation}deg)`;
    watermark.textContent = options.text;

    positionWatermark(watermark, options.position);
}

// Get current watermark options
function getWatermarkOptions() {
    return {
        text: document.getElementById('watermarkText').value,
        fontFamily: document.getElementById('fontFamily').value,
        fontSize: parseInt(document.getElementById('fontSize').value),
        color: $('#watermarkColor').spectrum('get').toRgbString(),
        opacity: parseInt(document.getElementById('opacity').value),
        rotation: parseInt(document.getElementById('rotation').value),
        position: document.querySelector('.position-btn.active').dataset.position
    };
}

// Position watermark
function positionWatermark(watermark, position) {
    const [vertical, horizontal] = position.split('-');
    
    // Reset styles
    watermark.style.top = '';
    watermark.style.bottom = '';
    watermark.style.left = '';
    watermark.style.right = '';
    watermark.style.transform = `rotate(${getWatermarkOptions().rotation}deg)`;
    
    // Set vertical position
    if (vertical === 'top') {
        watermark.style.top = '20px';
    } else if (vertical === 'bottom') {
        watermark.style.bottom = '20px';
    } else {
        watermark.style.top = '50%';
        watermark.style.transform += ' translateY(-50%)';
    }
    
    // Set horizontal position
    if (horizontal === 'left') {
        watermark.style.left = '20px';
    } else if (horizontal === 'right') {
        watermark.style.right = '20px';
    } else {
        watermark.style.left = '50%';
        watermark.style.transform += ' translateX(-50%)';
    }
}

// Apply watermark
function applyWatermark(e) {
    e.preventDefault();
    if (!originalImage) {
        showAlert('Please upload an image first', 'warning');
        return;
    }
    updateWatermark();
}

// Download image
function downloadImage() {
    if (!originalImage) {
        showAlert('Please upload an image first', 'warning');
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match original image
    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;
    
    // Draw original image
    ctx.drawImage(originalImage, 0, 0);
    
    // Get watermark options
    const options = getWatermarkOptions();
    
    // Apply watermark
    ctx.save();
    
    // Set watermark styles
    ctx.fillStyle = options.color;
    ctx.font = `${options.fontSize}px ${options.fontFamily}`;
    ctx.globalAlpha = options.opacity / 100;
    
    // Calculate watermark position
    const metrics = ctx.measureText(options.text);
    const [vertical, horizontal] = options.position.split('-');
    
    let x, y;
    
    // Set horizontal position
    if (horizontal === 'left') {
        x = 20;
    } else if (horizontal === 'right') {
        x = canvas.width - metrics.width - 20;
    } else {
        x = (canvas.width - metrics.width) / 2;
    }
    
    // Set vertical position
    if (vertical === 'top') {
        y = options.fontSize + 20;
    } else if (vertical === 'bottom') {
        y = canvas.height - 20;
    } else {
        y = canvas.height / 2;
    }
    
    // Apply rotation
    ctx.translate(x + metrics.width / 2, y - options.fontSize / 2);
    ctx.rotate(options.rotation * Math.PI / 180);
    ctx.translate(-(x + metrics.width / 2), -(y - options.fontSize / 2));
    
    // Draw watermark
    ctx.fillText(options.text, x, y);
    
    ctx.restore();
    
    // Download image
    const format = document.getElementById('format').value;
    const quality = parseInt(document.getElementById('quality').value) / 100;
    
    const link = document.createElement('a');
    link.download = `watermarked-image.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, quality);
    link.click();
    
    showAlert('Image downloaded successfully!', 'success');
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