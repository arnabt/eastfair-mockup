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

// --- Cart System Implementation ---
const Cart = {
    items: JSON.parse(localStorage.getItem('eastfair_cart')) || [],

    save() {
        localStorage.setItem('eastfair_cart', JSON.stringify(this.items));
        this.updateUI();
    },

    addItem(product) {
        const id = product.id || product.name.toLowerCase().replace(/\s+/g, '-');
        const existing = this.items.find(item => item.id === id);
        if (existing) {
            existing.quantity += (product.quantity || 1);
        } else {
            this.items.push({ quantity: 1, ...product, id });
        }
        this.save();
        this.openDrawer();
    },

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
    },

    updateQuantity(id, delta) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.save();
            }
        }
    },

    clear() {
        this.items = [];
        this.save();
    },

    get totalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    get subtotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    updateUI() {
        const badges = document.querySelectorAll('.cart-count');
        badges.forEach(badge => {
            badge.innerText = this.totalItems;
            badge.style.display = this.totalItems > 0 ? 'flex' : 'none';
        });

        const subtotalEl = document.getElementById('checkout-subtotal');
        if (subtotalEl) {
            subtotalEl.innerText = `$${this.subtotal.toLocaleString()}`;
            const taxEl = document.getElementById('checkout-tax');
            const totalEl = document.getElementById('checkout-total');
            if (taxEl) taxEl.innerText = `$${(this.subtotal * 0.13).toLocaleString()}`;
            if (totalEl) totalEl.innerText = `$${(this.subtotal * 1.13).toLocaleString()}`;
        }
        
        this.renderDrawer();
    },

    openDrawer() {
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('drawer-overlay');
        if (drawer && overlay) {
            drawer.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.renderDrawer();
        }
    },

    closeDrawer() {
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('drawer-overlay');
        if (drawer && overlay) {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    renderDrawer() {
        const container = document.getElementById('cart-items-container');
        const footer = document.getElementById('cart-footer');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart-msg" style="text-align: center; padding: 40px 20px;">
                    <i class="fas fa-shopping-basket" style="font-size: 48px; color: #DDD; margin-bottom: 20px;"></i>
                    <p style="color: var(--text-gray);">Your cart is empty.</p>
                    <button class="btn" style="margin-top: 20px; width: 100%; border:none; cursor:pointer;" onclick="Cart.closeDrawer()">Start Shopping</button>
                </div>
            `;
            if (footer) footer.style.display = 'none';
            return;
        }

        if (footer) footer.style.display = 'block';
        container.innerHTML = this.items.map(item => `
            <div class="cart-drawer-item" style="display: flex; gap: 15px; padding: 15px 0; border-bottom: 1px solid var(--border-light); position: relative;">
                <div class="cart-item-icon" style="width: 60px; height: 60px; background: var(--cream-bg); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #CCC;">
                    <i class="${item.icon || 'fas fa-box'}"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${item.name}</div>
                    <div style="color: var(--primary-red); font-weight: 800; font-size: 14px; margin-bottom: 8px;">$${item.price.toLocaleString()}</div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="display: flex; border: 1px solid var(--border-medium); border-radius: 4px; overflow: hidden;">
                            <button onclick="Cart.updateQuantity('${item.id}', -1)" style="padding: 2px 8px; border: none; background: #f8f8f8; cursor: pointer;">-</button>
                            <span style="padding: 2px 10px; font-weight: 600; font-size: 12px; background: white;">${item.quantity}</span>
                            <button onclick="Cart.updateQuantity('${item.id}', 1)" style="padding: 2px 8px; border: none; background: #f8f8f8; cursor: pointer;">+</button>
                        </div>
                        <span onclick="Cart.removeItem('${item.id}')" style="font-size: 12px; color: var(--text-gray); cursor: pointer; text-decoration: underline;">Remove</span>
                    </div>
                </div>
            </div>
        `).join('');

        const subtotalEl = document.getElementById('cart-subtotal');
        if (subtotalEl) subtotalEl.innerText = `$${this.subtotal.toLocaleString()}`;
    }
};

// Search Functionality
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

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

// --- Wishlist System ---
const Wishlist = {
    items: JSON.parse(localStorage.getItem('eastfair_wishlist')) || [],

    save() {
        localStorage.setItem('eastfair_wishlist', JSON.stringify(this.items));
        this.render();
    },

    toggle(product) {
        const id = product.id || product.name.toLowerCase().replace(/\s+/g, '-');
        const index = this.items.findIndex(item => item.id === id);
        
        if (index > -1) {
            this.items.splice(index, 1);
            this.showToast('Removed from Wishlist');
        } else {
            this.items.push({ ...product, id });
            this.showToast('Added to Wishlist');
        }
        this.save();
    },

    showToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; background: var(--dark-gray);
            color: white; padding: 12px 24px; border-radius: 4px; box-shadow: var(--shadow-strong);
            z-index: 10000; animation: slideUp 0.3s ease;
        `;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    },

    render() {
        const container = document.getElementById('wishlist-container');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div style="grid-column: span 2; text-align: center; padding: 40px; color: var(--text-gray);">
                    <i class="far fa-heart" style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;"></i>
                    <p>Your wishlist is empty.</p>
                    <a href="category.html" class="btn" style="margin-top: 20px; display: inline-block;">Browse Products</a>
                </div>
            `;
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div style="border: 1px solid var(--border-light); border-radius: 8px; padding: 15px; display: flex; gap: 15px; position: relative;">
                <div style="width: 80px; height: 80px; background: var(--cream-bg); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #CCC;">
                    <i class="${item.icon || 'fas fa-box'}"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${item.name}</div>
                    <div style="color: var(--primary-red); font-weight: 800; font-size: 14px; margin-bottom: 10px;">$${item.price.toLocaleString()}</div>
                    <button class="btn" style="padding: 8px 15px; font-size: 12px; border: none;" onclick="Cart.addItem({name: '${item.name}', price: ${item.price}, icon: '${item.icon}'})">Add to Cart</button>
                </div>
                <i class="fas fa-times" style="position: absolute; top: 10px; right: 10px; color: #CCC; cursor: pointer;" onclick="Wishlist.toggle({name: '${item.name}'})"></i>
            </div>
        `).join('');
    }
};

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    Cart.updateUI();
    Wishlist.render();

    // --- Dynamic Mockup Category Routing ---
    document.querySelectorAll('a[href="category.html"], a[href="/category"]').forEach(link => {
        let categoryName = '';
        if (link.classList.contains('category-card')) {
            const h3 = link.querySelector('h3');
            if (h3) categoryName = h3.textContent.trim();
        } else if (link.classList.contains('quick-view') || link.classList.contains('btn')) {
            return;
        } else {
            const textNodes = Array.from(link.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim().length > 0);
            if (textNodes.length > 0) {
                categoryName = textNodes[0].textContent.trim();
            } else {
                categoryName = link.textContent.trim();
            }
        }

        const ignores = ['Shop Now', 'Browse Products', 'Clear All'];
        if (categoryName && !ignores.includes(categoryName)) {
            // Preserve the original path requested (handles both `serve` clean URLs and direct file URLs)
            const basePath = window.location.pathname.endsWith('/') 
                ? 'category.html' 
                : link.getAttribute('href').split('?')[0].split('#')[0];
            link.href = `${basePath}#cat=${encodeURIComponent(categoryName)}`;
        }
    });

    // ----------------------------------------

    // Side Drawer Toggles
    const overlay = document.getElementById('drawer-overlay');
    const cartToggles = document.querySelectorAll('.header-actions a:last-child, .cart-trigger');

    cartToggles.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            Cart.openDrawer();
        });
    });

    if (overlay) overlay.addEventListener('click', () => {
        Cart.closeDrawer();
        document.getElementById('mobile-nav').classList.remove('active');
    });
    const closeBtn = document.getElementById('close-drawer');
    if (closeBtn) closeBtn.addEventListener('click', () => Cart.closeDrawer());

    // Mobile Menu Toggle
    const mobileMenuOpen = document.getElementById('mobile-menu-open');
    const mobileMenuClose = document.getElementById('mobile-nav-close');
    const mobileNav = document.getElementById('mobile-nav');

    if (mobileMenuOpen && mobileNav) {
        mobileMenuOpen.addEventListener('click', () => {
            mobileNav.classList.add('active');
            if (overlay) {
                overlay.style.display = 'block';
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
            }
        });
    }

    const closeMobileNav = () => {
        if (mobileNav) mobileNav.classList.remove('active');
        // Only hide overlay if cart is NOT open
        const cartDrawer = document.getElementById('cart-drawer');
        if (overlay && (!cartDrawer || !cartDrawer.classList.contains('active'))) {
            overlay.style.display = 'none';
        }
    };

    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileNav);
    if (overlay) overlay.addEventListener('click', closeMobileNav);

    // Account Navigation
    const accountNavLinks = document.querySelectorAll('.account-nav-link');
    const switchAccountSection = (sectionId) => {
        if (!sectionId) return;
        const targetSec = document.getElementById(`section-${sectionId}`);
        if (!targetSec) return;

        // Update active link
        accountNavLinks.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('data-section') === sectionId) l.classList.add('active');
        });

        // Update active section
        document.querySelectorAll('.account-section').forEach(sec => sec.classList.remove('active'));
        targetSec.classList.add('active');
        
        if (sectionId === 'wishlist') Wishlist.render();
    };

    accountNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            switchAccountSection(sectionId);
        });
    });

    // Handle initial hash
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        switchAccountSection(hash);
    }

    // Page Specific Initializations
    initGlobalAddToCart();
    initProductPage();
    initComparison();
    initTabs();
    initGallery();
});

// Helper for All "Add to Cart" Buttons
function initGlobalAddToCart() {
    document.querySelectorAll('.quick-view, .comp-btn-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.product-card') || btn.closest('.comp-product-card');
            if (!card) return;

            const name = card.querySelector('h3, .comp-product-name').innerText;
            const priceStr = card.querySelector('.price-new, .comp-product-price').innerText;
            const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
            const iconEl = card.querySelector('.product-img i, .comp-product-image i');
            const icon = iconEl ? iconEl.className : 'fas fa-box';

            Cart.addItem({ name, price, icon });
            
            // Feedback
            const originalText = btn.innerText;
            btn.innerText = '✓ Added';
            btn.style.background = '#4CAF50';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
            }, 1500);
        });
    });
}

// Product Page Specific Logic
function initProductPage() {
    const addBtn = document.querySelector('.product-add-to-cart');
    if (!addBtn) return;

    const qtySpan = addBtn.parentElement.querySelector('span'); // The quantity number
    const minusBtn = addBtn.parentElement.querySelector('.fa-minus');
    const plusBtn = addBtn.parentElement.querySelector('.fa-plus');
    
    let currentQty = 1;

    if (minusBtn && plusBtn && qtySpan) {
        minusBtn.addEventListener('click', () => {
            if (currentQty > 1) {
                currentQty--;
                qtySpan.innerText = currentQty;
            }
        });
        plusBtn.addEventListener('click', () => {
            currentQty++;
            qtySpan.innerText = currentQty;
        });
    }

    const wishlistBtn = document.querySelector('.product-add-to-wishlist');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = document.querySelector('h1').innerText;
            const priceStr = document.querySelector('.price-main').innerText;
            const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
            const icon = document.querySelector('.main-image i').className;
            Wishlist.toggle({ name, price, icon });
        });
    }

    addBtn.addEventListener('click', () => {
        const name = document.querySelector('h1').innerText;
        const priceStr = document.querySelector('.price-main').innerText;
        const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
        const icon = document.querySelector('.main-image i').className;

        Cart.addItem({ name, price, icon, quantity: currentQty });
        
        addBtn.innerText = '✓ Added to Cart';
        addBtn.style.background = '#4CAF50';
        setTimeout(() => {
            addBtn.innerText = `Add to Cart - $${(price * currentQty).toLocaleString()}`;
            addBtn.style.background = '';
        }, 1500);
    });
}

// Comparison logic
function initComparison() {
    const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
    const compToolbar = document.getElementById('comp-toolbar');
    const compNum = document.getElementById('comp-num');
    const compClear = document.getElementById('comp-clear');
    const compareBtn = document.querySelector('.compare-btn');
    const compModal = document.getElementById('comparison-modal');
    const closeComp = document.getElementById('close-comp');
    const compTableContainer = document.getElementById('comparison-table-container');

    if (!compareCheckboxes.length) return;

    const updateComparison = () => {
        const selectedCount = Array.from(compareCheckboxes).filter(cb => cb.checked).length;
        if (selectedCount > 0) {
            compToolbar.classList.add('active');
            compNum.innerText = selectedCount;
        } else {
            compToolbar.classList.remove('active');
        }
    };

    compareCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const card = cb.closest('.product-card');
            if (cb.checked) {
                card.style.borderColor = 'var(--primary-red)';
            } else {
                card.style.borderColor = '';
            }
            updateComparison();
        });
    });

    if (compClear) {
        compClear.addEventListener('click', () => {
            compareCheckboxes.forEach(cb => {
                cb.checked = false;
                cb.closest('.product-card').style.borderColor = '';
            });
            updateComparison();
        });
    }

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
                                    <div class="comp-product-image">${card.querySelector('.product-img').innerHTML}</div>
                                    <div class="comp-product-name">${card.querySelector('h3').innerText}</div>
                                    <div class="comp-product-price">${card.querySelector('.price-new').innerText}</div>
                                    <button class="comp-btn-cart">Add to Cart</button>
                                </div>
                            </td>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr><th>NSF Certified</th>${selectedCards.map(() => `<td><i class="fas fa-check" style="color: green;"></i> Yes</td>`).join('')}</tr>
                </tbody>
            </table>`;

            compTableContainer.innerHTML = tableHtml;
            compModal.classList.add('active');
            initGlobalAddToCart(); // Re-init for new buttons
        });
    }

    if (closeComp) closeComp.addEventListener('click', () => compModal.classList.remove('active'));
}

// Tab Logic
function initTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('data-tab');
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            link.classList.add('active');
            const targetEl = document.getElementById(target);
            if (targetEl) targetEl.classList.add('active');
        });
    });
}

// Gallery logic
function initGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    if (thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }
}

console.log('EastFair Functional Mockup Ready.');
