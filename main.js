// Sticky Header & Search Focus
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
        header.classList.add('sticky-active');
        header.style.boxShadow = 'var(--shadow-strong)';
    } else {
        header.classList.remove('sticky-active');
        header.style.boxShadow = 'none';
        header.style.borderBottom = '1px solid var(--border-light)';
    }
});

const searchInput = document.getElementById('main-search');
const searchResults = document.getElementById('search-results');

if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
        if (e.target.value.length > 2) {
            searchResults.classList.add('active');
        } else {
            searchResults.classList.remove('active');
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

// Comparison Engine (Change 2)
const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
const compToolbar = document.getElementById('comp-toolbar');
const compNum = document.getElementById('comp-num');
const compClear = document.getElementById('comp-clear');
const compareBtn = document.querySelector('.compare-btn');
const compModal = document.getElementById('comparison-modal');
const closeComp = document.getElementById('close-comp');
const compTableContainer = document.getElementById('comparison-table-container');

let selectedItems = [];

const updateComparison = () => {
    selectedItems = Array.from(compareCheckboxes).filter(cb => cb.checked);
    if (selectedItems.length > 0) {
        compToolbar.classList.add('active');
        compNum.innerText = selectedItems.length;
    } else {
        compToolbar.classList.remove('active');
    }
};

compareCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
        const card = cb.closest('.product-card');
        if (cb.checked) {
            card.style.borderColor = 'var(--primary-red)';
            card.style.boxShadow = 'var(--shadow-soft)';
        } else {
            card.style.borderColor = '';
            card.style.boxShadow = '';
        }
        updateComparison();
    });
});

if (compClear) {
    compClear.addEventListener('click', () => {
        compareCheckboxes.forEach(cb => {
            cb.checked = false;
            const card = cb.closest('.product-card');
            if (card) {
                card.style.borderColor = '';
                card.style.boxShadow = '';
            }
        });
        updateComparison();
    });
}

// Comparison Modal Logic
if (compareBtn && compModal) {
    compareBtn.addEventListener('click', () => {
        const selectedCards = Array.from(compareCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.closest('.product-card'));

        if (selectedCards.length === 0) return;

        let tableHtml = `<table class="comp-table">
            <thead>
                <tr>
                    <th>Product</th>
                    ${selectedCards.map(card => `
                        <td>
                            <div class="comp-product-card">
                                <div class="comp-product-image">
                                    ${card.querySelector('.product-img').innerHTML}
                                </div>
                                <div class="comp-product-name">${card.querySelector('h3').innerText}</div>
                                <div class="comp-product-price">${card.querySelector('.price-new').innerText}</div>
                                <button class="comp-btn-cart">Add to Cart</button>
                            </div>
                        </td>
                    `).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>Brand</th>
                    ${selectedCards.map(() => `<td>OMCAN / EastFair</td>`).join('')}
                </tr>
                <tr>
                    <th>Material</th>
                    ${selectedCards.map(() => `<td>Stainless Steel 304</td>`).join('')}
                </tr>
                <tr>
                    <th>Power Source</th>
                    ${selectedCards.map(() => `<td>Gas / Electric</td>`).join('')}
                </tr>
                <tr>
                    <th>Warranty</th>
                    ${selectedCards.map(() => `<td>1 Year Parts & Labor</td>`).join('')}
                </tr>
                <tr>
                    <th>NSF Certified</th>
                    ${selectedCards.map(() => `<td><i class="fas fa-check" style="color: green;"></i> Yes</td>`).join('')}
                </tr>
            </tbody>
        </table>`;

        compTableContainer.innerHTML = tableHtml;
        compModal.classList.add('active');
    });
}

if (closeComp) {
    closeComp.addEventListener('click', () => {
        compModal.classList.remove('active');
    });
}

// Close on background click
if (compModal) {
    compModal.addEventListener('click', (e) => {
        if (e.target === compModal) {
            compModal.classList.remove('active');
        }
    });
}

// Product Detail Tabs (Change 4)
const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

tabLinks.forEach(link => {
    link.addEventListener('click', () => {
        const target = link.getAttribute('data-tab');
        
        tabLinks.forEach(l => l.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        link.classList.add('active');
        document.getElementById(target).classList.add('active');
    });
});

// Gallery Interactions
const thumbnails = document.querySelectorAll('.thumbnail');
if (thumbnails.length > 0) {
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            // Mock main image change
        });
    });
}

// Quick Add To Cart Simulation
const cartBadge = document.querySelector('.cart-count');
document.querySelectorAll('.quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        let currentCount = parseInt(cartBadge.innerText);
        cartBadge.innerText = currentCount + 1;
        
        const originalText = btn.innerText;
        btn.innerText = '✓ Added to Cart';
        btn.style.background = '#4CAF50';
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
        }, 2000);
    });
});

console.log('EastFair Redesign Mockup Interactions Initialized.');
