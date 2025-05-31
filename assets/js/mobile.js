// Mobile-specific functionality

// Mobile menu functionality
function initializeMobileMenu() {
    // Create mobile menu toggle button
    const headerLeft = document.querySelector('.header-left');
    if (headerLeft && window.innerWidth <= 768) {
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '☰';
        mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
        headerLeft.insertBefore(mobileToggle, headerLeft.firstChild);
        
        // Create mobile sidebar overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-sidebar-overlay';
        document.body.appendChild(overlay);
        
        // Clone sidebar content for mobile
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            const mobileSidebar = document.createElement('div');
            mobileSidebar.className = 'mobile-sidebar';
            
            const header = document.createElement('div');
            header.className = 'mobile-sidebar-header';
            header.innerHTML = `
                <h3>Navigation</h3>
                <button class="mobile-close-btn" aria-label="Close menu">&times;</button>
            `;
            
            mobileSidebar.appendChild(header);
            mobileSidebar.appendChild(sidebar.cloneNode(true));
            document.body.appendChild(mobileSidebar);
            
            // Event listeners
            mobileToggle.addEventListener('click', () => {
                mobileSidebar.classList.add('open');
                overlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
            
            const closeBtn = mobileSidebar.querySelector('.mobile-close-btn');
            const closeMobileMenu = () => {
                mobileSidebar.classList.remove('open');
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            };
            
            closeBtn.addEventListener('click', closeMobileMenu);
            overlay.addEventListener('click', closeMobileMenu);
            
            // Close on navigation
            const mobileNavItems = mobileSidebar.querySelectorAll('.nav-item, .category-item, .quick-link');
            mobileNavItems.forEach(item => {
                item.addEventListener('click', closeMobileMenu);
            });
        }
    }
}

// Touch gesture support
function initializeTouchGestures() {
    let startX, startY, startTime;
    
    // Swipe to close mobile menu
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    if (mobileSidebar) {
        mobileSidebar.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        mobileSidebar.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const deltaX = startX - endX;
            const deltaY = Math.abs(startY - endY);
            const deltaTime = endTime - startTime;
            
            // Swipe left to close (quick swipe)
            if (deltaX > 50 && deltaY < 100 && deltaTime < 300) {
                const closeBtn = mobileSidebar.querySelector('.mobile-close-btn');
                if (closeBtn) closeBtn.click();
            }
            
            startX = startY = null;
        }, { passive: true });
    }
}

// Pull to refresh simulation
function initializePullToRefresh() {
    if (!('ontouchstart' in window)) return;
    
    let startY = 0;
    let pulling = false;
    const threshold = 100;
    
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    mainContent.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        pulling = mainContent.scrollTop === 0;
    }, { passive: true });
    
    mainContent.addEventListener('touchmove', (e) => {
        if (!pulling) return;
        
        const currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;
        
        if (pullDistance > threshold) {
            // Visual feedback for pull to refresh
            mainContent.style.transform = `translateY(${Math.min(pullDistance / 3, 30)}px)`;
        }
    }, { passive: true });
    
    mainContent.addEventListener('touchend', (e) => {
        if (!pulling) return;
        
        const endY = e.changedTouches[0].clientY;
        const pullDistance = endY - startY;
        
        mainContent.style.transform = '';
        
        if (pullDistance > threshold) {
            // Trigger refresh
            if (typeof resetAndLoadDiscussions === 'function') {
                resetAndLoadDiscussions();
            }
        }
        
        pulling = false;
    }, { passive: true });
}

// Improved scroll behavior
function initializeScrollBehavior() {
    // Smooth scroll for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Hide/show header on scroll (mobile)
    if (window.innerWidth <= 768) {
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    }
}

// Keyboard navigation improvements
function initializeKeyboardNavigation() {
    // Focus management for mobile menu
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    
    if (mobileToggle && mobileSidebar) {
        mobileToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mobileToggle.click();
            }
        });
        
        // Trap focus in mobile menu when open
        const focusableElements = mobileSidebar.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        mobileSidebar.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            } else if (e.key === 'Escape') {
                const closeBtn = mobileSidebar.querySelector('.mobile-close-btn');
                if (closeBtn) closeBtn.click();
            }
        });
    }
}

// Optimize for different screen sizes
function handleResponsiveLayout() {
    const checkLayout = () => {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
        // Update discussion card layout
        const discussionCards = document.querySelectorAll('.discussion-card');
        discussionCards.forEach(card => {
            if (isMobile) {
                card.classList.add('mobile-layout');
            } else {
                card.classList.remove('mobile-layout');
            }
        });
        
        // Update navigation visibility
        const sidebar = document.querySelector('.sidebar');
        const rightSidebar = document.querySelector('.right-sidebar');
        
        if (isMobile) {
            if (sidebar) sidebar.style.display = 'none';
            if (rightSidebar) rightSidebar.style.display = 'none';
        } else {
            if (sidebar) sidebar.style.display = 'block';
            if (rightSidebar) rightSidebar.style.display = 'block';
        }
    };
    
    // Check on load and resize
    checkLayout();
    window.addEventListener('resize', checkLayout);
}

// Performance optimizations for mobile
function initializeMobileOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) originalScrollHandler();
        }, 16); // ~60fps
    }, { passive: true });
}

// Initialize all mobile functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    initializeTouchGestures();
    initializePullToRefresh();
    initializeScrollBehavior();
    initializeKeyboardNavigation();
    handleResponsiveLayout();
    initializeMobileOptimizations();
});

// Re-initialize on window resize
window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        handleResponsiveLayout();
    }, 250);
});

// Export functions for global access
if (typeof window !== 'undefined') {
    window.mobileUtils = {
        initializeMobileMenu,
        initializeTouchGestures,
        initializePullToRefresh,
        handleResponsiveLayout
    };
}