// Sticky Header Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 100) {
        header.classList.add('sticky-active');
        header.style.boxShadow = 'var(--shadow-strong)';
    } else {
        header.classList.remove('sticky-active');
        header.style.boxShadow = 'none';
        header.style.borderBottom = '1px solid var(--border-light)';
    }
});

// Search Bar Focus Effect
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('focus', () => {
        document.querySelector('.search-bar').classList.add('is-focused');
    });
    searchInput.addEventListener('blur', () => {
        document.querySelector('.search-bar').classList.remove('is-focused');
    });
}

// Quick Add To Cart Simulation
const quickAddButtons = document.querySelectorAll('.quick-view');
quickAddButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cartBadge = document.querySelector('.header-actions .fas.fa-shopping-cart + span');
        let currentCount = parseInt(cartBadge.innerText);
        cartBadge.innerText = currentCount + 1;
        
        // Simple Feedback
        const originalText = btn.innerText;
        btn.innerText = '✓ Added to Cart';
        btn.style.background = '#4CAF50';
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = 'var(--text-black)';
        }, 2000);
    });
});

console.log('EastFair Redesign Mockup Loaded Successfully.');
