// Story Creator functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeStoryCreator();
    setupEventListeners();
});

let storyElements = [];
let undoStack = [];
let redoStack = [];

// Initialize story creator
function initializeStoryCreator() {
    setupTemplates();
    setupDragAndDrop();
    setupAnimations();
}

// Setup event listeners
function setupEventListeners() {
    // Text addition
    document.getElementById('addTextBtn')?.addEventListener('click', addTextElement);
    document.getElementById('textInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTextElement();
    });

    // Sticker addition
    document.querySelectorAll('.sticker-item').forEach(sticker => {
        sticker.addEventListener('click', () => addStickerElement(sticker.querySelector('img').src));
    });

    // Undo/Redo
    document.getElementById('undoBtn')?.addEventListener('click', undo);
    document.getElementById('redoBtn')?.addEventListener('click', redo);

    // Download and Share
    document.getElementById('downloadBtn')?.addEventListener('click', downloadStory);
    document.getElementById('shareBtn')?.addEventListener('click', shareStory);

    // Platform change
    document.getElementById('platform')?.addEventListener('change', updatePlatformSettings);
}

// Setup templates
function setupTemplates() {
    document.querySelectorAll('.template-card').forEach(template => {
        template.addEventListener('click', () => {
            const backgroundUrl = template.querySelector('.template-preview').style.backgroundImage;
            document.getElementById('storyCanvas').style.backgroundImage = backgroundUrl;
            saveState();
        });
    });
}

// Setup drag and drop
function setupDragAndDrop() {
    let activeElement = null;
    let initialX = 0;
    let initialY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        if (e.target.classList.contains('story-element')) {
            activeElement = e.target;
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
        }
    }

    function drag(e) {
        if (activeElement) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            setTranslate(currentX, currentY, activeElement);
        }
    }

    function stopDragging() {
        if (activeElement) {
            saveState();
            activeElement = null;
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }
}

// Add text element
function addTextElement() {
    const textInput = document.getElementById('textInput');
    const text = textInput.value.trim();
    if (!text) return;

    const fontSelector = document.querySelector('.font-selector');
    const colorPicker = document.querySelector('.color-picker');

    const element = document.createElement('div');
    element.className = 'story-element story-text';
    element.textContent = text;
    element.style.fontFamily = fontSelector.value;
    element.style.color = colorPicker.value;

    addElement(element);
    textInput.value = '';
}

// Add sticker element
function addStickerElement(src) {
    const element = document.createElement('img');
    element.className = 'story-element story-sticker';
    element.src = src;
    element.draggable = false;

    addElement(element);
}

// Add element to canvas
function addElement(element) {
    const toolbar = createElementToolbar();
    element.appendChild(toolbar);
    
    document.getElementById('storyCanvas').appendChild(element);
    storyElements.push(element);
    saveState();
}

// Create element toolbar
function createElementToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'element-toolbar';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-danger me-1';
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    deleteBtn.onclick = function(e) {
        e.stopPropagation();
        this.closest('.story-element').remove();
        saveState();
    };

    const rotateBtn = document.createElement('button');
    rotateBtn.className = 'btn btn-sm btn-light me-1';
    rotateBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
    rotateBtn.onclick = function(e) {
        e.stopPropagation();
        const element = this.closest('.story-element');
        const currentRotation = element.style.transform?.match(/rotate\(([^)]+)\)/) || [0, '0deg'];
        const newRotation = parseInt(currentRotation[1]) + 45;
        element.style.transform += ` rotate(${newRotation}deg)`;
        saveState();
    };

    toolbar.appendChild(deleteBtn);
    toolbar.appendChild(rotateBtn);
    return toolbar;
}

// Setup animations
function setupAnimations() {
    document.querySelectorAll('.animation-selector').forEach(selector => {
        selector.addEventListener('click', () => {
            document.querySelectorAll('.animation-selector').forEach(s => s.classList.remove('active'));
            selector.classList.add('active');
            applyAnimation(selector.textContent.toLowerCase());
        });
    });
}

// Apply animation
function applyAnimation(type) {
    const selectedElement = document.querySelector('.story-element.selected');
    if (!selectedElement) return;

    selectedElement.style.animation = `${type} 1s`;
    saveState();
}

// Save state for undo/redo
function saveState() {
    const canvas = document.getElementById('storyCanvas');
    undoStack.push(canvas.innerHTML);
    redoStack = [];
    updateUndoRedoButtons();
}

// Undo action
function undo() {
    if (undoStack.length <= 1) return;
    
    const canvas = document.getElementById('storyCanvas');
    redoStack.push(undoStack.pop());
    canvas.innerHTML = undoStack[undoStack.length - 1];
    updateUndoRedoButtons();
}

// Redo action
function redo() {
    if (redoStack.length === 0) return;

    const canvas = document.getElementById('storyCanvas');
    undoStack.push(redoStack[redoStack.length - 1]);
    canvas.innerHTML = redoStack.pop();
    updateUndoRedoButtons();
}

// Update undo/redo buttons state
function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');

    if (undoBtn) undoBtn.disabled = undoStack.length <= 1;
    if (redoBtn) redoBtn.disabled = redoStack.length === 0;
}

// Download story
function downloadStory() {
    // In a real implementation, this would use html2canvas or similar
    // to convert the story canvas to an image
    alert('Story downloaded successfully!');
}

// Share story
function shareStory() {
    const platform = document.getElementById('platform').value;
    // In a real implementation, this would integrate with social media APIs
    alert(`Story ready to share on ${platform}!`);
}

// Update platform settings
function updatePlatformSettings() {
    const platform = document.getElementById('platform').value;
    const canvas = document.getElementById('storyCanvas');

    // Adjust canvas dimensions based on platform
    switch (platform) {
        case 'instagram':
            canvas.style.width = '360px';
            canvas.style.height = '640px';
            break;
        case 'facebook':
            canvas.style.width = '360px';
            canvas.style.height = '640px';
            break;
        case 'snapchat':
            canvas.style.width = '380px';
            canvas.style.height = '670px';
            break;
        case 'whatsapp':
            canvas.style.width = '360px';
            canvas.style.height = '640px';
            break;
    }
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