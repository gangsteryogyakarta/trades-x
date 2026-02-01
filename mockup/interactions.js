/**
 * TradeX Interactive Components System
 * Comprehensive interactivity for all UI elements
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initTooltips();
    initModals();
    initTabs();
    initDropdowns();
    initButtons();
    initForms();
    initNotifications();
    initCharts();
    initAnimations();
    initKeyboardNav();
    console.log('TradeX Interactions System Initialized');
});

// ============================================
// TOOLTIP SYSTEM
// ============================================
function initTooltips() {
    // Create tooltip container
    const tooltipEl = document.createElement('div');
    tooltipEl.className = 'tx-tooltip';
    tooltipEl.innerHTML = '<div class="tx-tooltip-content"></div><div class="tx-tooltip-arrow"></div>';
    document.body.appendChild(tooltipEl);

    // Add tooltips to elements with data-tooltip
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
        el.addEventListener('focus', showTooltip);
        el.addEventListener('blur', hideTooltip);
    });

    function showTooltip(e) {
        const target = e.currentTarget;
        const text = target.dataset.tooltip;
        const position = target.dataset.tooltipPos || 'top';
        
        tooltipEl.querySelector('.tx-tooltip-content').textContent = text;
        tooltipEl.className = `tx-tooltip tx-tooltip-${position} active`;
        
        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltipEl.getBoundingClientRect();
        
        let top, left;
        switch(position) {
            case 'bottom':
                top = rect.bottom + 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + 8;
                break;
            default: // top
                top = rect.top - tooltipRect.height - 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
        }
        
        tooltipEl.style.top = `${Math.max(5, top)}px`;
        tooltipEl.style.left = `${Math.max(5, left)}px`;
    }

    function hideTooltip() {
        tooltipEl.classList.remove('active');
    }
}

// ============================================
// MODAL SYSTEM
// ============================================
function initModals() {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.id = 'tx-modal-container';
    modalContainer.innerHTML = `
        <div class="tx-modal-overlay"></div>
        <div class="tx-modal">
            <div class="tx-modal-header">
                <h3 class="tx-modal-title"></h3>
                <button class="tx-modal-close">&times;</button>
            </div>
            <div class="tx-modal-body"></div>
            <div class="tx-modal-footer"></div>
        </div>
    `;
    document.body.appendChild(modalContainer);

    // Close modal on overlay click or close button
    modalContainer.querySelector('.tx-modal-overlay').addEventListener('click', closeModal);
    modalContainer.querySelector('.tx-modal-close').addEventListener('click', closeModal);

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Initialize modal triggers
    document.querySelectorAll('[data-modal]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const modalType = el.dataset.modal;
            const modalData = el.dataset.modalData ? JSON.parse(el.dataset.modalData) : {};
            openModal(modalType, modalData, el);
        });
    });
}

window.openModal = function(type, data = {}, trigger = null) {
    const container = document.getElementById('tx-modal-container');
    const title = container.querySelector('.tx-modal-title');
    const body = container.querySelector('.tx-modal-body');
    const footer = container.querySelector('.tx-modal-footer');
    
    // Clear previous content
    body.innerHTML = '';
    footer.innerHTML = '';
    
    // Set modal content based on type
    switch(type) {
        case 'stock-detail':
            title.textContent = data.symbol || 'Detail Saham';
            body.innerHTML = getStockDetailContent(data);
            footer.innerHTML = `
                <button class="btn-sm" onclick="closeModal()">Tutup</button>
                <button class="btn-sm btn-accent" onclick="addToWatchlist('${data.symbol}')">Tambah ke Watchlist</button>
            `;
            break;
            
        case 'trade-confirm':
            title.textContent = 'Konfirmasi Transaksi';
            body.innerHTML = getTradeConfirmContent(data);
            footer.innerHTML = `
                <button class="btn-sm" onclick="closeModal()">Batal</button>
                <button class="btn-sm ${data.side === 'buy' ? 'btn-buy' : 'btn-sell'}" onclick="executeTrade()">
                    Konfirmasi ${data.side === 'buy' ? 'Beli' : 'Jual'}
                </button>
            `;
            break;
            
        case 'alert-create':
            title.textContent = 'Buat Notifikasi Harga';
            body.innerHTML = getAlertCreateContent(data);
            footer.innerHTML = `
                <button class="btn-sm" onclick="closeModal()">Batal</button>
                <button class="btn-sm btn-accent" onclick="saveAlert()">Buat Notifikasi</button>
            `;
            break;
            
        case 'trader-profile':
            title.textContent = data.name || 'Profil Trader';
            body.innerHTML = getTraderProfileContent(data);
            footer.innerHTML = `
                <button class="btn-sm" onclick="closeModal()">Tutup</button>
                <button class="btn-sm btn-accent" onclick="copyTrader('${data.id}')">Salin Trader Ini</button>
            `;
            break;

        case 'course-detail':
            title.textContent = data.title || 'Detail Kursus';
            body.innerHTML = getCourseDetailContent(data);
            footer.innerHTML = `
                <button class="btn-sm" onclick="closeModal()">Tutup</button>
                <button class="btn-sm btn-accent" onclick="startCourse('${data.id}')">Mulai Belajar</button>
            `;
            break;

        case 'news-detail':
            title.textContent = 'Artikel Berita';
            body.innerHTML = getNewsDetailContent(data);
            footer.innerHTML = `
                <button class="btn-sm" onclick="closeModal()">Tutup</button>
                <button class="btn-sm btn-accent" onclick="shareNews('${data.id}')">Bagikan</button>
            `;
            break;

        case 'success':
            title.textContent = '✓ Berhasil';
            body.innerHTML = `<div class="tx-modal-message success">${data.message || 'Operasi berhasil!'}</div>`;
            footer.innerHTML = `<button class="btn-sm btn-accent" onclick="closeModal()">OKE</button>`;
            break;

        case 'error':
            title.textContent = '✗ Error';
            body.innerHTML = `<div class="tx-modal-message error">${data.message || 'Terjadi kesalahan.'}</div>`;
            footer.innerHTML = `<button class="btn-sm btn-accent" onclick="closeModal()">OKE</button>`;
            break;

        case 'confirm':
            title.textContent = data.title || 'Konfirmasi Aksi';
            body.innerHTML = `<div class="tx-modal-message">${data.message || 'Anda yakin?'}</div>`;
            footer.innerHTML = `
                <button class="btn-sm" onclick="closeModal()">Batal</button>
                <button class="btn-sm btn-accent" onclick="if(window.confirmCallback) window.confirmCallback(); closeModal();">Konfirmasi</button>
            `;
            window.confirmCallback = data.onConfirm;
            break;
            
        default:
            title.textContent = 'Informasi';
            body.innerHTML = `<p>${data.message || 'Konten tidak tersedia.'}</p>`;
            footer.innerHTML = `<button class="btn-sm btn-accent" onclick="closeModal()">Tutup</button>`;
    }
    
    container.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus trap
    container.querySelector('.tx-modal').focus();
};

window.closeModal = function() {
    const container = document.getElementById('tx-modal-container');
    container.classList.remove('active');
    document.body.style.overflow = '';
};

// Modal Content Templates
function getStockDetailContent(data) {
    return `
        <div class="stock-detail-modal">
            <div class="stock-header-row">
                <div class="stock-icon ${data.type || 'stocks'}">${data.symbol?.[0] || 'S'}</div>
                <div class="stock-info">
                    <div class="stock-symbol">${data.symbol || 'SIMBOL'}</div>
                    <div class="stock-name">${data.name || 'Nama Perusahaan'}</div>
                </div>
                <div class="stock-price">
                    <div class="price-current">${data.price || '0'}</div>
                    <div class="price-change ${data.change >= 0 ? 'positive' : 'negative'}">
                        ${data.change >= 0 ? '+' : ''}${data.change || '0'}%
                    </div>
                </div>
            </div>
            <div class="stock-stats-grid">
                <div class="stat-item">
                    <span class="stat-label">Pembukaan</span>
                    <span class="stat-value">${data.open || '-'}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Tertinggi</span>
                    <span class="stat-value">${data.high || '-'}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Terendah</span>
                    <span class="stat-value">${data.low || '-'}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Volume</span>
                    <span class="stat-value">${data.volume || '-'}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Kapitalisasi Pasar</span>
                    <span class="stat-value">${data.marketCap || '-'}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Rasio PER</span>
                    <span class="stat-value">${data.pe || '-'}</span>
                </div>
            </div>
            <div class="ai-signal-box">
                <i class="fas fa-robot"></i>
                <span>Sinyal AI: <strong class="${data.signal === 'buy' ? 'text-buy' : 'text-sell'}">${data.signal === 'buy' ? 'BELI' : (data.signal === 'sell' ? 'JUAL' : 'TAHAN')}</strong></span>
                <span class="confidence">Keyakinan: ${data.confidence || '75'}%</span>
            </div>
        </div>
    `;
}

function getTradeConfirmContent(data) {
    return `
        <div class="trade-confirm-modal">
            <div class="trade-action ${data.side}">${data.side === 'buy' ? 'BELI' : 'JUAL'}</div>
            <div class="trade-details">
                <div class="trade-row">
                    <span>Simbol</span>
                    <strong>${data.symbol || 'BBCA'}</strong>
                </div>
                <div class="trade-row">
                    <span>Harga</span>
                    <strong>${data.price || '0'}</strong>
                </div>
                <div class="trade-row">
                    <span>Lot</span>
                    <strong>${data.quantity || '0'} lot</strong>
                </div>
                <div class="trade-row">
                    <span>Nilai</span>
                    <strong>${(data.value || '').replace('IDR', 'Rp') || 'Rp 0'}</strong>
                </div>
                <div class="trade-row">
                    <span>Biaya</span>
                    <strong>${(data.fee || '').replace('IDR', 'Rp') || 'Rp 0'}</strong>
                </div>
                <div class="trade-row total">
                    <span>Total</span>
                    <strong>${(data.total || '').replace('IDR', 'Rp') || 'Rp 0'}</strong>
                </div>
            </div>
        </div>
    `;
}

function getAlertCreateContent(data) {
    return `
        <div class="alert-create-modal">
            <div class="form-group">
                <label>Simbol</label>
                <input type="text" class="form-control" value="${data.symbol || ''}" placeholder="cth. BBCA">
            </div>
            <div class="form-group">
                <label>Kondisi</label>
                <select class="form-control">
                    <option value="above">Harga naik di atas</option>
                    <option value="below">Harga turun di bawah</option>
                    <option value="change">Harga berubah %</option>
                </select>
            </div>
            <div class="form-group">
                <label>Nilai</label>
                <input type="number" class="form-control" placeholder="Masukkan harga atau persentase">
            </div>
            <div class="form-group">
                <label>Saluran Notifikasi</label>
                <div class="channel-options">
                    <label class="checkbox-label"><input type="checkbox" checked> Notifikasi Push</label>
                    <label class="checkbox-label"><input type="checkbox" checked> Email</label>
                    <label class="checkbox-label"><input type="checkbox"> SMS</label>
                    <label class="checkbox-label"><input type="checkbox"> Telegram</label>
                </div>
            </div>
        </div>
    `;
}

function getTraderProfileContent(data) {
    return `
        <div class="trader-profile-modal">
            <div class="trader-header">
                <img src="${data.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}" class="trader-avatar-lg">
                <div class="trader-info">
                    <div class="trader-name">${data.name || 'Nama Trader'}</div>
                    <div class="trader-title">${data.title || 'Trader Terverifikasi'}</div>
                </div>
            </div>
            <div class="trader-stats-grid">
                <div class="stat-box">
                    <div class="stat-value text-buy">${data.return || '+0'}%</div>
                    <div class="stat-label">Return</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.winRate || '0'}%</div>
                    <div class="stat-label">Win Rate</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.followers || '0'}</div>
                    <div class="stat-label">Pengikut</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.trades || '0'}</div>
                    <div class="stat-label">Trade</div>
                </div>
            </div>
            <div class="trader-bio">
                <h4>Tentang</h4>
                <p>${data.bio || 'Bio tidak tersedia.'}</p>
            </div>
            <div class="recent-trades">
                <h4>Trade Terbaru</h4>
                <div class="mini-trades-list">
                    <div class="mini-trade"><span class="side buy">BELI</span> BBCA @ 9,800</div>
                    <div class="mini-trade"><span class="side sell">JUAL</span> GOTO @ 88</div>
                    <div class="mini-trade"><span class="side buy">BELI</span> BTC @ $65,000</div>
                </div>
            </div>
        </div>
    `;
}

function getCourseDetailContent(data) {
    return `
        <div class="course-detail-modal">
            <div class="course-header">
                <div class="course-icon"><i class="${data.icon || 'fas fa-book'}"></i></div>
                <div class="course-meta">
                    <span class="course-level ${data.level || 'beginner'}">${data.level === 'intermediate' ? 'MENENGAH' : (data.level === 'advanced' ? 'LANJUTAN' : 'PEMULA')}</span>
                    <span class="course-duration"><i class="fas fa-clock"></i> ${data.duration || '4 jam'}</span>
                </div>
            </div>
            <h3 class="course-title">${data.title || 'Judul Kursus'}</h3>
            <p class="course-description">${data.description || 'Deskripsi kursus...'}</p>
            <div class="course-curriculum">
                <h4>Kurikulum</h4>
                <ul class="curriculum-list">
                    <li><i class="fas fa-play-circle"></i> Pengantar Trading</li>
                    <li><i class="fas fa-play-circle"></i> Memahami Pasar</li>
                    <li><i class="fas fa-play-circle"></i> Analisis Teknikal Dasar</li>
                    <li><i class="fas fa-play-circle"></i> Manajemen Risiko</li>
                    <li><i class="fas fa-file-alt"></i> Kuis Akhir</li>
                </ul>
            </div>
        </div>
    `;
}

function getNewsDetailContent(data) {
    return `
        <div class="news-detail-modal">
            <div class="news-meta">
                <span class="news-source">${data.source || 'Reuters'}</span>
                <span class="news-time">${data.time || '1 jam yang lalu'}</span>
                <span class="sentiment-tag ${data.sentiment || 'neutral'}">${data.sentimentText || 'Netral'}</span>
            </div>
            <h3 class="news-title">${data.title || 'Judul Berita'}</h3>
            <div class="news-body">
                <p>${data.content || 'Konten berita lengkap akan muncul di sini...'}</p>
            </div>
            <div class="news-impact-section">
                <h4>Analisis Dampak Portofolio</h4>
                <div class="impact-list">
                    <div class="impact-item positive"><span>BBCA</span> <span>+2.1%</span></div>
                    <div class="impact-item positive"><span>BBRI</span> <span>+1.8%</span></div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// TAB SYSTEM
// ============================================
function initTabs() {
    document.querySelectorAll('.tabs, .tab-group, .order-type-tabs').forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll('.tab, .type-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.classList.remove('active', 'active-buy', 'active-sell');
                });
                tab.classList.add('active');
                
                // Handle buy/sell tabs specially
                if (tab.textContent.toLowerCase().includes('buy')) {
                    tab.classList.add('active-buy');
                } else if (tab.textContent.toLowerCase().includes('sell')) {
                    tab.classList.add('active-sell');
                }
                
                // Trigger associated content change
                const tabId = tab.dataset.tab;
                if (tabId) {
                    const container = tab.closest('[data-tab-container]') || document;
                    container.querySelectorAll('[data-tab-content]').forEach(content => {
                        content.classList.toggle('active', content.dataset.tabContent === tabId);
                    });
                }
                
                // Ripple effect
                createRipple(tab, event);
            });
        });
    });
}

// ============================================
// DROPDOWN SYSTEM
// ============================================
function initDropdowns() {
    document.querySelectorAll('.dropdown-trigger, .filter-select').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = trigger.nextElementSibling;
            if (dropdown?.classList.contains('dropdown-menu')) {
                closeAllDropdowns();
                dropdown.classList.add('active');
                trigger.classList.add('active');
            }
        });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', closeAllDropdowns);
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu.active').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.dropdown-trigger.active').forEach(t => t.classList.remove('active'));
}

// ============================================
// BUTTON INTERACTIONS
// ============================================
function initButtons() {
    // All buttons with ripple effect
    document.querySelectorAll('button, .btn-sm, .btn-accent, .btn-order, .btn-copy, .btn-action, .quick-action-btn, .menu-item').forEach(btn => {
        btn.addEventListener('click', function(e) {
            createRipple(this, e);
        });
    });

    // Copy buttons
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Mengikuti';
            this.classList.add('copied');
            showToast('Berhasil! Anda sekarang menyalin trader ini.', 'success');
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('copied');
            }, 3000);
        });
    });

    // Order buttons
    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const isBuy = this.classList.contains('btn-buy-action');
            
            // Get values from inputs
            const inputs = document.querySelectorAll('.order-entry input[type="number"]');
            const price = parseFloat(inputs[0]?.value) || 9850;
            const lots = parseFloat(inputs[1]?.value) || 10;
            const value = price * lots * 100; // Assuming 100 shares per lot
            const fee = value * 0.0015;
            const total = value + fee;

            openModal('trade-confirm', {
                side: isBuy ? 'buy' : 'sell',
                symbol: 'BBCA',
                price: price.toLocaleString(),
                quantity: lots.toLocaleString() + ' lot',
                value: 'Rp ' + value.toLocaleString(),
                fee: 'Rp ' + fee.toLocaleString(),
                total: 'Rp ' + total.toLocaleString()
            });
        });
    });

    // Action buttons (edit, delete, etc.)
    document.querySelectorAll('.btn-action').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (this.querySelector('.fa-trash, .fa-times')) {
                openModal('confirm', {
                    title: 'Konfirmasi Hapus',
                    message: 'Anda yakin ingin menghapus item ini?',
                    onConfirm: () => {
                        this.closest('tr, .alert-item, .position-item')?.remove();
                        showToast('Item berhasil dihapus.', 'success');
                    }
                });
            } else if (this.querySelector('.fa-edit')) {
                showToast('Mode edit diaktifkan.', 'info');
            }
        });
    });
}

// Create ripple effect
function createRipple(element, event) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// ============================================
// FORM INTERACTIONS
// ============================================
function initForms() {
    // Input steppers
    document.querySelectorAll('.input-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (!input) return;
            
            let value = parseFloat(input.value) || 0;
            const step = parseFloat(input.step) || 1;
            const min = parseFloat(input.min) || 0;
            const max = parseFloat(input.max) || Infinity;
            
            if (this.querySelector('.fa-plus')) {
                value = Math.min(max, value + step);
            } else if (this.querySelector('.fa-minus')) {
                value = Math.max(min, value - step);
            }
            
            input.value = value;
            input.dispatchEvent(new Event('change'));
            
            // Update related calculations
            updateOrderCalculations();
        });
    });

    // Quick amount buttons
    document.querySelectorAll('.quick-btn, .lot-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Toggle active state
            this.parentElement.querySelectorAll('.quick-btn, .lot-btn').forEach(b => 
                b.classList.remove('active')
            );
            this.classList.add('active');
            
            // Calculate and set value
            const percentage = parseInt(this.textContent) || 100;
            showToast(`Memilih ${percentage}% dari saldo tersedia`, 'info');
        });
    });

    // Form validation visual feedback
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement?.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement?.classList.remove('focused');
            
            // Validation
            if (this.required && !this.value) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
        
        input.addEventListener('change', function() {
            updateOrderCalculations();
        });
    });

    // Toggle switches
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const label = this.closest('.risk-header, .setting-row')?.querySelector('span');
            showToast(`${label?.textContent || 'Pengaturan'} ${this.checked ? 'diaktifkan' : 'dinonaktifkan'}`, 'info');
        });
    });
}

function updateOrderCalculations() {
    const priceInput = document.querySelector('.order-entry input[type="number"], .order-form-grid input[type="number"]');
    const qtyInput = document.querySelectorAll('.order-entry input[type="number"], .order-form-grid input[type="number"]')[1];
    
    if (priceInput && qtyInput) {
        const price = parseFloat(priceInput.value) || 0;
        const qty = parseFloat(qtyInput.value) || 0;
        const value = price * qty * 100;
        const fee = value * 0.0015;
        const total = value + fee;
        
        // Update displays
        const summaryRows = document.querySelectorAll('.order-summary-mini .summary-row span:last-child, .summary-row .value');
        if (summaryRows.length >= 3) {
            summaryRows[0].textContent = `Rp ${value.toLocaleString()}`;
            summaryRows[1].textContent = `Rp ${fee.toLocaleString()}`;
            summaryRows[2].textContent = `Rp ${total.toLocaleString()}`;
        }
    }
}

// ============================================
// NOTIFICATION SYSTEM (TOAST)
// ============================================
function initNotifications() {
    // Create toast container
    const toastContainer = document.createElement('div');
    toastContainer.id = 'tx-toast-container';
    document.body.appendChild(toastContainer);
}

window.showToast = function(message, type = 'info', duration = 3000) {
    const container = document.getElementById('tx-toast-container');
    const toast = document.createElement('div');
    toast.className = `tx-toast tx-toast-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('active'), 10);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
    
    // Auto remove
    setTimeout(() => removeToast(toast), duration);
};

function removeToast(toast) {
    toast.classList.remove('active');
    setTimeout(() => toast.remove(), 300);
}

// ============================================
// CHART INTERACTIONS
// ============================================
function initCharts() {
    // Timeframe buttons
    document.querySelectorAll('.tf-btn, .timeframe-btns button').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.tf-btn, button').forEach(b => 
                b.classList.remove('active')
            );
            this.classList.add('active');
            showToast(`Beralih ke timeframe ${this.textContent}`, 'info');
        });
    });

    // Chart type buttons
    document.querySelectorAll('.chart-btn, .chart-type-btns button').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.chart-btn, button').forEach(b => 
                b.classList.remove('active')
            );
            this.classList.add('active');
        });
    });
}

// ============================================
// ANIMATIONS
// ============================================
function initAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-panel, .summary-card, .trader-card, .course-card, .news-item').forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });

    // Stagger animation for lists
    document.querySelectorAll('.predictions-table tbody tr, .leaderboard-grid .trader-card, .courses-grid .course-card').forEach((el, i) => {
        el.style.animationDelay = `${i * 50}ms`;
    });

    // Live price flash animation
    setInterval(() => {
        document.querySelectorAll('.live-price, .current-price').forEach(el => {
            if (Math.random() > 0.7) {
                const isUp = Math.random() > 0.5;
                el.classList.add(isUp ? 'flash-up' : 'flash-down');
                setTimeout(() => el.classList.remove('flash-up', 'flash-down'), 500);
            }
        });
    }, 2000);
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // ESC closes modals
        if (e.key === 'Escape') {
            closeModal();
            closeAllDropdowns();
        }
        
        // Ctrl+K for search
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            showToast('Pencarian diaktifkan (Ctrl+K)', 'info');
        }
        
        // Arrow keys for navigation in lists
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const focusable = document.querySelectorAll('.watchlist-item, .menu-item, tr');
            // Handle focus navigation
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
window.addToWatchlist = function(symbol) {
    closeModal();
    showToast(`${symbol} ditambahkan ke watchlist!`, 'success');
};

window.executeTrade = function() {
    closeModal();
    showToast('Trade berhasil dieksekusi!', 'success');
};

window.saveAlert = function() {
    closeModal();
    showToast('Notifikasi berhasil dibuat!', 'success');
};

window.copyTrader = function(id) {
    closeModal();
    showToast('Anda sekarang menyalin trader ini!', 'success');
};

window.startCourse = function(id) {
    closeModal();
    window.location.href = 'education.html';
};

window.shareNews = function(id) {
    closeModal();
    showToast('Link disalin ke clipboard!', 'success');
};
