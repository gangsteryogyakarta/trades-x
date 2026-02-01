// TradeX Mockup Script - Robust Version

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Safe DOM Helpers ---
    function setContent(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
        else console.warn(`Element #${id} not found`);
    }

    // --- 1. Ticker Tape ---
    const tickerData = [
        { symbol: 'IHSG', price: 7245.12, chg: 0.45 },
        { symbol: 'LQ45', price: 982.10, chg: -0.12 },
        { symbol: 'BBCA', price: 9850, chg: 1.25 },
        { symbol: 'BBRI', price: 5450, chg: -0.50 },
        { symbol: 'GOTO', price: 84, chg: 2.10 },
        { symbol: 'TLKM', price: 3980, chg: 0.00 },
        { symbol: 'BMRI', price: 6200, chg: 0.75 },
        { symbol: 'UNTR', price: 23000, chg: 1.50 },
        { symbol: 'ADRO', price: 2450, chg: -1.2 },
        { symbol: 'BBNI', price: 5600, chg: 0.45 },
    ];

    function renderTicker() {
        const items = [...tickerData, ...tickerData]; 
        const html = items.map(item => {
            const colorClass = item.chg > 0 ? 'text-buy' : (item.chg < 0 ? 'text-sell' : 'text-secondary');
            const icon = item.chg > 0 ? '<i class="fas fa-caret-up"></i>' : (item.chg < 0 ? '<i class="fas fa-caret-down"></i>' : '');
            const sign = item.chg > 0 ? '+' : '';
            return `
                <div class="ticker-item">
                    <span>${item.symbol}</span> 
                    <strong class="${colorClass}">${item.price.toLocaleString()} (${sign}${item.chg}%) ${icon}</strong>
                </div>
            `;
        }).join('');
        setContent('tickerContent', html);
    }
    renderTicker();

    // --- 2. Watchlist ---
function renderWatchlist() {
    const watchlist = [
        { symbol: 'BBCA', name: 'Bank Central Asia', price: 9850, chg: 1.2 },
        { symbol: 'ASII', name: 'Astra International', price: 5125, chg: -0.8 },
        { symbol: 'GOTO', name: 'GoTo Gojek Tokopedia', price: 84, chg: 2.4 },
        { symbol: 'ANTM', name: 'Aneka Tambang', price: 1650, chg: -0.5 },
        { symbol: 'BRIS', name: 'Bank Syariah Ind', price: 2400, chg: 3.2 },
    ];

    const html = watchlist.map((item, idx) => {
        const colorClass = item.chg > 0 ? 'text-buy' : (item.chg < 0 ? 'text-sell' : 'text-secondary');
        const activeClass = idx === 0 ? 'active' : ''; // First item is active by default
        const sign = item.chg > 0 ? '+' : '';
        
        // Create data object for chart/orderbook
        const stockData = JSON.stringify({
            symbol: item.symbol, 
            name: item.name,
            price: item.price,
            change: item.chg
        }).replace(/"/g, "&quot;");

        return `
            <div class="watchlist-item ${activeClass}" data-symbol="${item.symbol}" onclick='selectStock(${JSON.stringify(item)})'>
                <div>
                    <div style="font-weight: 600;">${item.symbol}</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">${item.name}</div>
                </div>
                <div style="text-align: right;">
                    <div class="${colorClass} price-flash" id="wl-price-${item.symbol}">${item.price.toLocaleString()}</div>
                    <div class="${colorClass}" style="font-size: 0.75rem;">${sign}${item.chg}%</div>
                </div>
            </div>
        `;
    }).join('');
    setContent('watchlistContainer', html);
}

// Global function to select a stock from watchlist
function selectStock(stockData) {
    // Update active state
    document.querySelectorAll('.watchlist-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.symbol === stockData.symbol) {
            item.classList.add('active');
        }
    });
    
    // Update chart if available
    if (window.stockChart && typeof window.stockChart.setStock === 'function') {
        window.stockChart.setStock(stockData);
    }
    
    // Update order book if available
    if (window.orderBook && typeof window.orderBook.setStock === 'function') {
        window.orderBook.setStock(stockData);
    }
    
    // Update order entry form stock name
    const orderBtn = document.querySelector('.btn-order');
    if (orderBtn) {
        const action = orderBtn.classList.contains('btn-sell-action') ? 'Jual' : 'Beli';
        orderBtn.innerHTML = `<i class="fas fa-check"></i> ${action} ${stockData.symbol}`;
    }
}    
    renderWatchlist();

    // --- 3. Chart Integration ---
    const chartContainer = document.getElementById('tv-chart-container');
    if (chartContainer && typeof LightweightCharts !== 'undefined') {
        const chart = LightweightCharts.createChart(chartContainer, {
            width: chartContainer.clientWidth,
            height: chartContainer.clientHeight || 400,
            layout: {
                background: { type: 'solid', color: 'transparent' },
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0)' },
                horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
            },
            rightPriceScale: {
                borderColor: 'rgba(197, 203, 206, 0.8)',
            },
            timeScale: {
                borderColor: 'rgba(197, 203, 206, 0.8)',
                timeVisible: true,
            },
        });

        const candleSeries = chart.addCandlestickSeries({
            upColor: '#00C853',
            downColor: '#D50000',
            borderDownColor: '#D50000',
            borderUpColor: '#00C853',
            wickDownColor: '#D50000',
            wickUpColor: '#00C853',
        });

        // Initialize Data
        const initialData = [];
        let time = Math.floor(new Date().getTime() / 1000) - 6000;
        let lastClose = 84;

        for (let i = 0; i < 100; i++) {
            const open = lastClose;
            const high = open + Math.random() * 2;
            const low = open - Math.random() * 2;
            const close = Math.random() > 0.5 ? high - Math.random() : low + Math.random();
            const candle = { time: time + i * 60, open, high, low, close };
            // Ensure high/low are valid
            candle.high = Math.max(candle.high, candle.open, candle.close);
            candle.low = Math.min(candle.low, candle.open, candle.close);
            
            initialData.push(candle);
            lastClose = close;
        }
        candleSeries.setData(initialData);

        // Responsive Resize
        window.addEventListener('resize', () => {
            if(chartContainer) {
                chart.applyOptions({ width: chartContainer.clientWidth, height: chartContainer.clientHeight });
            }
        });

        // Live Update Simulation
        let lastCandle = initialData[initialData.length - 1];
        setInterval(() => {
            if (!lastCandle) return;
            
            const change = (Math.random() - 0.5) * 0.5;
            lastCandle.close += change;
            lastCandle.high = Math.max(lastCandle.high, lastCandle.close);
            lastCandle.low = Math.min(lastCandle.low, lastCandle.close);
            
            if (Math.random() > 0.9) {
                 lastCandle = {
                     time: lastCandle.time + 60,
                     open: lastCandle.close,
                     high: lastCandle.close,
                     low: lastCandle.close,
                     close: lastCandle.close
                 };
            }
            candleSeries.update(lastCandle);
        }, 500);

    } else {
        console.error('Chart container missing or LightweightCharts library not loaded.');
        if(chartContainer) chartContainer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;">Chart Library Not Loaded (Check Internet)</div>';
    }

    // --- 4. Order Book ---
    const orderBookBody = document.querySelector("#orderBookTable tbody");
    let currentPrice = 84;

    function renderOrderBook(sells, buys) {
        if (!orderBookBody) return;

        let html = '';
        // Sells
        sells.forEach(item => {
            html += `
                 <tr class="price-row sell">
                    <td></td>
                    <td></td>
                    <td class="text-sell animate-cell">${item.price}</td>
                    <td class="animate-cell">${item.vol.toLocaleString()}</td>
                </tr>
            `;
        });
        
        // Current
        html += `
            <tr style="border-top: 2px solid rgba(255,255,255,0.1); border-bottom: 2px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02);">
                <td colspan="4" style="text-align: center; font-weight: bold; font-size: 1rem;" id="currPrice">${currentPrice.toFixed(0)}</td>
            </tr>
        `;
        
        // Buys
        buys.forEach(item => {
            html += `
                 <tr class="price-row buy">
                    <td class="animate-cell">${item.vol.toLocaleString()}</td>
                    <td class="text-buy animate-cell">${item.price}</td>
                    <td></td>
                    <td></td>
                </tr>
            `;
        });
        orderBookBody.innerHTML = html;
    }

    function generateOrderBook() {
        const sells = [];
        const buys = [];
        for (let i = 4; i >= 1; i--) {
            sells.push({ price: currentPrice + i, vol: Math.floor(Math.random() * 50000) });
        }
        for (let i = 1; i <= 4; i++) {
            buys.push({ price: currentPrice - i, vol: Math.floor(Math.random() * 50000) });
        }
        renderOrderBook(sells, buys);
    }
    
    // Initial Render
    generateOrderBook();

    // Random Flash Simulation
    setInterval(() => {
        const rows = document.querySelectorAll('.animate-cell');
        if (rows.length === 0) return;

        const randomRow = rows[Math.floor(Math.random() * rows.length)];
        if (randomRow) {
            randomRow.classList.add('flash-up');
            setTimeout(() => randomRow.classList.remove('flash-up'), 300);
        }
        
        // Price Change Simulation
        if (Math.random() > 0.8) {
            currentPrice += (Math.random() > 0.5 ? 1 : -1);
            generateOrderBook();
            
            const priceEl = document.getElementById('currPrice');
            if(priceEl) {
                 priceEl.classList.add('flash-up');
                 setTimeout(() => priceEl.classList.remove('flash-up'), 500);
            }
        }
    }, 800);

    // --- 5. Tabs ---
    const tabs = document.querySelectorAll('.tab');
    const orderBtn = document.querySelector('.btn-order');
    if (tabs.length > 0 && orderBtn) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active-buy', 'active-sell'));
                if (tab.innerText === 'Buy') {
                    tab.classList.add('active-buy');
                    orderBtn.classList.remove('btn-sell-action');
                    orderBtn.classList.add('btn-buy-action');
                    orderBtn.innerText = 'Confirm Buy';
                } else {
                    tab.classList.add('active-sell');
                    orderBtn.classList.remove('btn-buy-action');
                    orderBtn.classList.add('btn-sell-action');
                    orderBtn.innerText = 'Confirm Sell';
                }
            });
        });
    }

});
