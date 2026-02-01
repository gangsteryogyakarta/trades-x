/**
 * TradeX - Order Book Component
 * Real-time order book with depth visualization
 */

class OrderBook {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        // Order book state
        this.bids = [];
        this.asks = [];
        this.maxVolume = 0;
        this.updateInterval = null;
        this.highlightQueue = [];
        
        // Current stock info
        this.stockSymbol = 'BBCA';
        this.currentPrice = 9850;
        
        // Colors (Midnight Gold theme)
        this.colors = {
            bid: '#00e676',
            bidBg: 'rgba(0, 230, 118, 0.15)',
            ask: '#ff1744',
            askBg: 'rgba(255, 23, 68, 0.15)',
            highlight: 'rgba(255, 215, 0, 0.3)'
        };
        
        this.init();
    }
    
    init() {
        this.generateInitialData();
        this.render();
        this.startRealTimeUpdates();
    }
    
    generateInitialData() {
        // Generate 10 levels of bids and asks
        this.bids = [];
        this.asks = [];
        
        let bidPrice = this.currentPrice - 5;
        let askPrice = this.currentPrice + 5;
        
        for (let i = 0; i < 10; i++) {
            const bidVolume = Math.floor(Math.random() * 5000) + 500;
            const askVolume = Math.floor(Math.random() * 5000) + 500;
            
            this.bids.push({
                price: bidPrice,
                volume: bidVolume,
                total: bidVolume * bidPrice,
                isNew: false,
                isUpdated: false
            });
            
            this.asks.push({
                price: askPrice,
                volume: askVolume,
                total: askVolume * askPrice,
                isNew: false,
                isUpdated: false
            });
            
            bidPrice -= Math.floor(Math.random() * 10) + 5;
            askPrice += Math.floor(Math.random() * 10) + 5;
        }
        
        this.calculateMaxVolume();
    }
    
    calculateMaxVolume() {
        const allVolumes = [...this.bids, ...this.asks].map(o => o.volume);
        this.maxVolume = Math.max(...allVolumes);
    }
    
    render() {
        const bidRows = this.bids.map((bid, i) => this.createRow(bid, 'bid', i)).join('');
        const askRows = this.asks.map((ask, i) => this.createRow(ask, 'ask', i)).join('');
        
        this.container.innerHTML = `
            <div class="orderbook-header">
                <span class="col-vol">Vol Beli</span>
                <span class="col-price">Beli</span>
                <span class="col-price">Jual</span>
                <span class="col-vol">Vol Jual</span>
            </div>
            <div class="orderbook-body">
                <div class="orderbook-side bids">
                    ${bidRows}
                </div>
                <div class="orderbook-side asks">
                    ${askRows}
                </div>
            </div>
            <div class="orderbook-spread">
                <span>Spread: Rp ${(this.asks[0].price - this.bids[0].price).toLocaleString()}</span>
            </div>
        `;
    }
    
    createRow(order, side, index) {
        const depthPercent = (order.volume / this.maxVolume) * 100;
        const highlightClass = order.isNew ? 'new' : (order.isUpdated ? 'updated' : '');
        const depthColor = side === 'bid' ? this.colors.bidBg : this.colors.askBg;
        const textColor = side === 'bid' ? this.colors.bid : this.colors.ask;
        
        if (side === 'bid') {
            return `
                <div class="order-row ${highlightClass}" data-side="bid" data-index="${index}">
                    <div class="depth-bar" style="width: ${depthPercent}%; background: ${depthColor}; right: 0;"></div>
                    <span class="order-vol">${this.formatVolume(order.volume)}</span>
                    <span class="order-price" style="color: ${textColor}">${order.price.toLocaleString()}</span>
                </div>
            `;
        } else {
            return `
                <div class="order-row ${highlightClass}" data-side="ask" data-index="${index}">
                    <div class="depth-bar" style="width: ${depthPercent}%; background: ${depthColor}; left: 0;"></div>
                    <span class="order-price" style="color: ${textColor}">${order.price.toLocaleString()}</span>
                    <span class="order-vol">${this.formatVolume(order.volume)}</span>
                </div>
            `;
        }
    }
    
    formatVolume(vol) {
        if (vol >= 1000) {
            return (vol / 1000).toFixed(1) + 'K';
        }
        return vol.toString();
    }
    
    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => this.simulateUpdate(), 1500);
    }
    
    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    simulateUpdate() {
        // Reset highlight flags
        this.bids.forEach(b => { b.isNew = false; b.isUpdated = false; });
        this.asks.forEach(a => { a.isNew = false; a.isUpdated = false; });
        
        // Randomly update some orders
        const updateCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < updateCount; i++) {
            const side = Math.random() > 0.5 ? 'bid' : 'ask';
            const orders = side === 'bid' ? this.bids : this.asks;
            const index = Math.floor(Math.random() * orders.length);
            
            // Randomly add, update, or remove
            const action = Math.random();
            
            if (action < 0.4) {
                // Update volume
                orders[index].volume = Math.floor(Math.random() * 5000) + 500;
                orders[index].total = orders[index].volume * orders[index].price;
                orders[index].isUpdated = true;
            } else if (action < 0.7) {
                // Add new order at a level
                const newPrice = side === 'bid' 
                    ? this.currentPrice - Math.floor(Math.random() * 50) - 5
                    : this.currentPrice + Math.floor(Math.random() * 50) + 5;
                    
                const newOrder = {
                    price: newPrice,
                    volume: Math.floor(Math.random() * 3000) + 200,
                    total: 0,
                    isNew: true,
                    isUpdated: false
                };
                newOrder.total = newOrder.volume * newOrder.price;
                
                // Insert in sorted position
                if (side === 'bid') {
                    orders.push(newOrder);
                    orders.sort((a, b) => b.price - a.price);
                    if (orders.length > 10) orders.pop();
                } else {
                    orders.push(newOrder);
                    orders.sort((a, b) => a.price - b.price);
                    if (orders.length > 10) orders.pop();
                }
            }
        }
        
        // Occasionally shift prices
        if (Math.random() < 0.3) {
            const priceChange = Math.floor(Math.random() * 20) - 10;
            this.currentPrice += priceChange;
            
            // Regenerate top levels
            if (this.bids.length > 0) {
                this.bids[0].price = this.currentPrice - 5;
                this.bids[0].isUpdated = true;
            }
            if (this.asks.length > 0) {
                this.asks[0].price = this.currentPrice + 5;
                this.asks[0].isUpdated = true;
            }
            
            // Update displayed price
            this.updatePriceDisplay();
        }
        
        this.calculateMaxVolume();
        this.render();
    }
    
    updatePriceDisplay() {
        const priceEl = document.querySelector('.stock-current-price');
        if (priceEl) {
            priceEl.textContent = this.currentPrice.toLocaleString();
        }
    }
    
    destroy() {
        this.stopRealTimeUpdates();
    }
    
    // Set stock and regenerate order book data
    setStock(stockData) {
        this.stockSymbol = stockData.symbol;
        this.currentPrice = stockData.price;
        
        // Regenerate order book with new price
        this.generateInitialData();
        this.render();
    }
}

// Initialize order book when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const orderbookContainer = document.getElementById('order-book');
    if (orderbookContainer) {
        window.orderBook = new OrderBook('order-book');
    }
});
