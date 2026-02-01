// TradeX Pages - Shared Scripts

document.addEventListener('DOMContentLoaded', () => {
    
    // Tab functionality
    const tabs = document.querySelectorAll('.type-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Order side toggle
    const sideBtns = document.querySelectorAll('.side-btn');
    const orderBtn = document.querySelector('.btn-order');
    
    sideBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sideBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (orderBtn) {
                if (btn.classList.contains('buy')) {
                    orderBtn.classList.remove('btn-sell-action');
                    orderBtn.classList.add('btn-buy-action');
                    orderBtn.innerHTML = '<i class="fas fa-check"></i> Pasang Order Beli';
                } else {
                    orderBtn.classList.remove('btn-buy-action');
                    orderBtn.classList.add('btn-sell-action');
                    orderBtn.innerHTML = '<i class="fas fa-check"></i> Pasang Order Jual';
                }
            }
        });
    });

    // Quick amount buttons
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            quickBtns.forEach(b => b.style.background = 'rgba(255, 255, 255, 0.05)');
            btn.style.background = 'var(--accent-color)';
        });
    });

    // Simulate live price updates
    function simulatePriceUpdates() {
        const priceElements = document.querySelectorAll('.price-value, .live-price');
        priceElements.forEach(el => {
            if (Math.random() > 0.7) {
                el.classList.add('flash-up');
                setTimeout(() => el.classList.remove('flash-up'), 500);
            }
        });
    }

    // Run price simulation every 2 seconds
    setInterval(simulatePriceUpdates, 2000);

    // Notification bell animation
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        setInterval(() => {
            notificationBell.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                notificationBell.style.animation = '';
            }, 500);
        }, 10000);
    }

    // Alert dismissal
    const dismissBtns = document.querySelectorAll('.alert-item .btn-sm');
    dismissBtns.forEach(btn => {
        // Handle both English 'Dismiss' and Indonesian 'Tutup'
        if (btn.textContent.includes('Dismiss') || btn.textContent.includes('Tutup')) {
            btn.addEventListener('click', () => {
                const alertItem = btn.closest('.alert-item');
                alertItem.style.opacity = '0';
                alertItem.style.transform = 'translateX(20px)';
                setTimeout(() => alertItem.remove(), 300);
            });
        }
    });

    // Copy trader button
    const copyBtns = document.querySelectorAll('.btn-copy');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Mengikuti';
            btn.style.background = 'var(--buy-color)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        });
    });

    // Course card hover effects
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.cursor = 'pointer';
        });
    });

    // Webinar registration
    const registerBtns = document.querySelectorAll('.webinar-item .btn-sm');
    registerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.textContent = 'Terdaftar ✓';
            btn.style.background = 'var(--buy-color)';
            btn.style.borderColor = 'var(--buy-color)';
            btn.disabled = true;
        });
    });

    // Smooth scroll for menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Input stepper buttons
    const inputBtns = document.querySelectorAll('.input-btn');
    inputBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            if (!input) return;
            
            let value = parseFloat(input.value) || 0;
            if (btn.querySelector('.fa-plus')) {
                value += 1;
            } else if (btn.querySelector('.fa-minus')) {
                value = Math.max(0, value - 1);
            }
            input.value = value;
            
            // Trigger order value recalculation
            updateOrderSummary();
        });
    });

    // Update order summary
    function updateOrderSummary() {
        const priceInput = document.querySelector('.order-form-grid input[type="number"]');
        const qtyInput = document.querySelectorAll('.order-form-grid input[type="number"]')[1];
        
        if (priceInput && qtyInput) {
            const price = parseFloat(priceInput.value) || 0;
            const qty = parseFloat(qtyInput.value) || 0;
            const value = price * qty * 100; // Assuming lots
            
            const summaryValueEl = document.querySelector('.summary-row .value');
            if (summaryValueEl) {
                summaryValueEl.textContent = `Rp ${value.toLocaleString()}`;
            }
        }
    }

    // Leaderboard card animations
    const traderCards = document.querySelectorAll('.trader-card');
    traderCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 100}ms`;
    });

    // Discussion likes
    const likeIcons = document.querySelectorAll('.discussion-stats span');
    likeIcons.forEach(span => {
        if (span.querySelector('.fa-heart')) {
            span.style.cursor = 'pointer';
            span.addEventListener('click', () => {
                const count = parseInt(span.textContent.match(/\d+/)[0]);
                span.innerHTML = `<i class="fas fa-heart" style="color: #ef4444;"></i> ${count + 1}`;
            });
        }
    });

    // Progress ring animation
    const progressRings = document.querySelectorAll('.progress-fill, .circle');
    progressRings.forEach(ring => {
        ring.style.transition = 'stroke-dasharray 1s ease-in-out';
    });

    console.log('TradeX Pages Scripts Loaded');
});

// Shake animation for notification bell
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px) rotate(-5deg); }
        75% { transform: translateX(3px) rotate(5deg); }
    }
    
    .flash-up {
        animation: flash-green 0.5s ease-out;
    }
    
    @keyframes flash-green {
        0% { background-color: rgba(0, 200, 83, 0.3); }
        100% { background-color: transparent; }
    }
    
    .trader-card {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(styleSheet);
