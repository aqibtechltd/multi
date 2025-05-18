// Load header and footer
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    setupThemeToggle();
    setupAnalytics();
});

// Load header
async function loadHeader() {
    try {
        const response = await fetch('/components/header.html');
        const html = await response.text();
        document.getElementById('header-placeholder').innerHTML = html;
        
        // Setup mobile menu toggle
        const menuToggle = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (menuToggle && navbarCollapse) {
            menuToggle.addEventListener('click', () => {
                navbarCollapse.classList.toggle('show');
            });
        }

        // Highlight active nav item
        highlightActiveNavItem();
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

// Load footer
async function loadFooter() {
    try {
        const response = await fetch('/components/footer.html');
        const html = await response.text();
        document.getElementById('footer-placeholder').innerHTML = html;
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Setup theme toggle
function setupThemeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);

    document.addEventListener('click', (e) => {
        if (e.target.matches('#theme-toggle')) {
            const currentTheme = document.documentElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update toggle button icon
            const icon = e.target.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'light' ? 'bi bi-sun' : 'bi bi-moon';
            }
        }
    });
}

// Highlight active nav item
function highlightActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Setup analytics
function setupAnalytics() {
    // Track page views
    logPageView();

    // Track tool usage
    document.addEventListener('click', (e) => {
        if (e.target.matches('button[type="submit"], button.btn-primary')) {
            logToolUsage(window.location.pathname);
        }
    });
}

// Log page view
function logPageView() {
    const pageData = {
        path: window.location.pathname,
        title: document.title,
        timestamp: new Date().toISOString()
    };
    
    // In a real implementation, this would send data to an analytics service
    console.log('Page View:', pageData);
}

// Log tool usage
function logToolUsage(toolPath) {
    const usageData = {
        tool: toolPath,
        timestamp: new Date().toISOString()
    };
    
    // In a real implementation, this would send data to an analytics service
    console.log('Tool Usage:', usageData);
}

// Utility function to format numbers
function formatNumber(number, decimals = 2) {
    return Number(number).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Utility function to copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy text:', error);
        return false;
    }
}

// Utility function to download text as file
function downloadTextFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Utility function to validate input
function validateInput(value, min, max, type = 'number') {
    if (type === 'number') {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    }
    return true;
}

// Export common functions
window.utils = {
    formatNumber,
    copyToClipboard,
    downloadTextFile,
    validateInput
};

// Search functionality
const toolSearch = document.getElementById('toolSearch');
if (toolSearch) {
    toolSearch.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
            const toolName = card.querySelector('.tool-name').textContent.toLowerCase();
            const toolDescription = card.querySelector('.tool-description').textContent.toLowerCase();
            
            if (toolName.includes(searchTerm) || toolDescription.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Tool card animation on scroll
function animateToolCards() {
    const cards = document.querySelectorAll('.tool-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        observer.observe(card);
    });
}

// Initialize animations
if ('IntersectionObserver' in window) {
    animateToolCards();
}

// Ad loading function
function loadAds() {
    // Initialize Google AdSense
    (adsbygoogle = window.adsbygoogle || []).push({});
}

// Credit footer
console.log('Built by Aqib Chaudhary - Multi-Tools Website');

// Load navigation
document.addEventListener('DOMContentLoaded', function() {
    const nav = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="/">Multi Tools</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                AI Tools
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/tools/ai/text-generator.html">Text Generator</a></li>
                                <li><a class="dropdown-item" href="/tools/ai/summarizer.html">Text Summarizer</a></li>
                                <li><a class="dropdown-item" href="/tools/ai/paraphraser.html">Paraphrasing Tool</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Image Tools
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/tools/image/compress.html">Image Compressor</a></li>
                                <li><a class="dropdown-item" href="/tools/image/resize.html">Image Resizer</a></li>
                                <li><a class="dropdown-item" href="/tools/image/convert.html">Image Converter</a></li>
                                <li><a class="dropdown-item" href="/tools/image/crop.html">Image Cropper</a></li>
                                <li><a class="dropdown-item" href="/tools/image/filter.html">Image Filter</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Text Tools
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/tools/text/word-counter.html">Word Counter</a></li>
                                <li><a class="dropdown-item" href="/tools/text/case-converter.html">Case Converter</a></li>
                                <li><a class="dropdown-item" href="/tools/text/lorem-ipsum.html">Lorem Ipsum Generator</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Developer Tools
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/tools/developer/json-formatter.html">JSON Formatter</a></li>
                                <li><a class="dropdown-item" href="/tools/developer/html-formatter.html">HTML Formatter</a></li>
                                <li><a class="dropdown-item" href="/tools/developer/css-minifier.html">CSS Minifier</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
    document.getElementById('nav-placeholder').innerHTML = nav;
});

// Load footer
document.addEventListener('DOMContentLoaded', function() {
    const footer = `
        <footer class="bg-light py-4 mt-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-4">
                        <h5>About Multi Tools</h5>
                        <p>A comprehensive collection of online tools for various needs - from AI-powered content generation to image manipulation and developer utilities.</p>
                    </div>
                    <div class="col-md-4">
                        <h5>Quick Links</h5>
                        <ul class="list-unstyled">
                            <li><a href="/about.html" class="text-decoration-none">About Us</a></li>
                            <li><a href="/contact.html" class="text-decoration-none">Contact</a></li>
                            <li><a href="/privacy.html" class="text-decoration-none">Privacy Policy</a></li>
                            <li><a href="/terms.html" class="text-decoration-none">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div class="col-md-4">
                        <h5>Follow Us</h5>
                        <div class="social-links">
                            <a href="#" class="text-decoration-none me-2"><i class="bi bi-twitter"></i></a>
                            <a href="#" class="text-decoration-none me-2"><i class="bi bi-facebook"></i></a>
                            <a href="#" class="text-decoration-none me-2"><i class="bi bi-linkedin"></i></a>
                            <a href="#" class="text-decoration-none"><i class="bi bi-github"></i></a>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="text-center">
                    <p class="mb-0">&copy; ${new Date().getFullYear()} Multi Tools. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
    document.getElementById('footer-placeholder').innerHTML = footer;
}); 