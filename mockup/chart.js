/**
 * TradeX - Interactive Stock Chart
 * Animated canvas chart with zoom, pan, tooltips, and timeframe controls
 */

class StockChart {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.canvas = this.container.querySelector('canvas') || this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        
        // Current stock info
        this.stockInfo = {
            symbol: 'BBCA',
            name: 'Bank Central Asia',
            price: 9850,
            change: 1.2
        };
        
        // Chart state
        this.data = [];
        this.visibleData = [];
        this.timeframe = '1M';
        this.chartType = 'line'; // 'line', 'candle', 'bar'
        this.isAnimating = false;
        this.animationProgress = 0;
        this.animationId = null;
        
        // Interaction state
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.offset = 0;
        this.zoom = 1;
        this.hoveredIndex = -1;
        
        // Chart dimensions
        this.padding = { top: 20, right: 60, bottom: 30, left: 10 };
        
        // Colors (Midnight Gold theme)
        this.colors = {
            background: '#0a0a0a',
            grid: 'rgba(255, 215, 0, 0.05)',
            line: '#FFD700',
            lineGradientTop: 'rgba(255, 215, 0, 0.3)',
            lineGradientBottom: 'rgba(255, 215, 0, 0)',
            candleUp: '#00e676',
            candleDown: '#ff1744',
            text: '#a0a0a0',
            crosshair: 'rgba(255, 215, 0, 0.5)',
            tooltip: 'rgba(0, 0, 0, 0.9)'
        };
        
        this.init();
    }
    
    createCanvas() {
        const canvas = document.createElement('canvas');
        this.container.appendChild(canvas);
        return canvas;
    }
    
    init() {
        this.resizeCanvas();
        this.generateData();
        this.bindEvents();
        this.draw();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.draw();
    }
    
    generateData() {
        // Generate mock OHLCV data
        const periods = {
            '1D': 24,    // Hourly for 1 day
            '1W': 7 * 24, // Hourly for 1 week
            '1M': 30,    // Daily for 1 month
            '3M': 90,    // Daily for 3 months
            '1Y': 365    // Daily for 1 year
        };
        
        const count = periods[this.timeframe] || 30;
        this.data = [];
        
        // Use stock price as base (with some variance)
        let basePrice = this.stockInfo.price * (0.95 + Math.random() * 0.05);
        const volatility = this.timeframe === '1D' ? (this.stockInfo.price * 0.002) : (this.stockInfo.price * 0.005);
        
        for (let i = 0; i < count; i++) {
            const change = (Math.random() - 0.48) * volatility;
            const open = basePrice;
            const close = basePrice + change;
            const high = Math.max(open, close) + Math.random() * volatility * 0.5;
            const low = Math.min(open, close) - Math.random() * volatility * 0.5;
            const volume = Math.floor(Math.random() * 1000000) + 500000;
            
            this.data.push({
                time: this.getTimeLabel(i),
                open: open,
                high: high,
                low: low,
                close: close,
                volume: volume
            });
            
            basePrice = close;
        }
        
        this.visibleData = [...this.data];
        this.offset = 0;
    }
    
    getTimeLabel(index) {
        const now = new Date();
        if (this.timeframe === '1D') {
            const hour = (now.getHours() - (this.data.length - index)) % 24;
            return `${hour.toString().padStart(2, '0')}:00`;
        } else {
            const date = new Date(now);
            date.setDate(date.getDate() - (this.data.length - index));
            return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        }
    }
    
    bindEvents() {
        // Mouse events for tooltips and pan
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', () => this.handleMouseUp());
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.isDragging) {
            const dx = x - this.dragStart.x;
            this.offset = Math.max(0, Math.min(this.data.length - this.getVisibleCount(), this.offset - Math.floor(dx / 10)));
            this.dragStart.x = x;
            this.updateVisibleData();
            this.draw();
        } else {
            // Find hovered data point
            const chartWidth = this.canvas.width - this.padding.left - this.padding.right;
            const barWidth = chartWidth / this.visibleData.length;
            const index = Math.floor((x - this.padding.left) / barWidth);
            
            if (index >= 0 && index < this.visibleData.length) {
                this.hoveredIndex = index;
                this.canvas.style.cursor = 'crosshair';
            } else {
                this.hoveredIndex = -1;
                this.canvas.style.cursor = 'default';
            }
            this.draw();
        }
    }
    
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.isDragging = true;
        this.dragStart.x = e.clientX - rect.left;
        this.canvas.style.cursor = 'grabbing';
    }
    
    handleMouseUp() {
        this.isDragging = false;
        this.canvas.style.cursor = 'default';
    }
    
    handleMouseLeave() {
        this.hoveredIndex = -1;
        this.isDragging = false;
        this.draw();
    }
    
    handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom = Math.max(0.5, Math.min(3, this.zoom * delta));
        this.updateVisibleData();
        this.draw();
    }
    
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            const rect = this.canvas.getBoundingClientRect();
            this.isDragging = true;
            this.dragStart.x = e.touches[0].clientX - rect.left;
        }
    }
    
    handleTouchMove(e) {
        if (this.isDragging && e.touches.length === 1) {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const dx = x - this.dragStart.x;
            this.offset = Math.max(0, Math.min(this.data.length - this.getVisibleCount(), this.offset - Math.floor(dx / 10)));
            this.dragStart.x = x;
            this.updateVisibleData();
            this.draw();
        }
    }
    
    getVisibleCount() {
        return Math.floor(this.data.length / this.zoom);
    }
    
    updateVisibleData() {
        const count = this.getVisibleCount();
        const start = Math.min(this.offset, this.data.length - count);
        this.visibleData = this.data.slice(start, start + count);
    }
    
    draw() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.fillStyle = this.colors.background;
        ctx.fillRect(0, 0, width, height);
        
        if (this.visibleData.length === 0) return;
        
        // Calculate scales
        const chartWidth = width - this.padding.left - this.padding.right;
        const chartHeight = height - this.padding.top - this.padding.bottom;
        
        const prices = this.visibleData.flatMap(d => [d.high, d.low]);
        const minPrice = Math.min(...prices) * 0.998;
        const maxPrice = Math.max(...prices) * 1.002;
        
        const xScale = (i) => this.padding.left + (i + 0.5) * (chartWidth / this.visibleData.length);
        const yScale = (price) => this.padding.top + chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;
        
        // Draw grid
        this.drawGrid(ctx, chartWidth, chartHeight, minPrice, maxPrice);
        
        // Draw chart based on type
        if (this.chartType === 'line') {
            this.drawLineChart(ctx, xScale, yScale, chartHeight);
        } else if (this.chartType === 'candle') {
            this.drawCandlestickChart(ctx, xScale, yScale, chartWidth);
        } else {
            this.drawBarChart(ctx, xScale, yScale, chartWidth);
        }
        
        // Draw crosshair and tooltip
        if (this.hoveredIndex >= 0) {
            this.drawCrosshair(ctx, xScale, yScale, chartHeight, width, height);
            this.drawTooltip(ctx);
        }
        
        // Draw Y-axis labels
        this.drawYAxis(ctx, chartHeight, minPrice, maxPrice);
    }
    
    drawGrid(ctx, chartWidth, chartHeight, minPrice, maxPrice) {
        ctx.strokeStyle = this.colors.grid;
        ctx.lineWidth = 1;
        
        // Horizontal lines
        const priceStep = (maxPrice - minPrice) / 5;
        for (let i = 0; i <= 5; i++) {
            const y = this.padding.top + (i / 5) * chartHeight;
            ctx.beginPath();
            ctx.moveTo(this.padding.left, y);
            ctx.lineTo(this.canvas.width - this.padding.right, y);
            ctx.stroke();
        }
        
        // Vertical lines
        const step = Math.ceil(this.visibleData.length / 6);
        for (let i = 0; i < this.visibleData.length; i += step) {
            const x = this.padding.left + (i + 0.5) * (chartWidth / this.visibleData.length);
            ctx.beginPath();
            ctx.moveTo(x, this.padding.top);
            ctx.lineTo(x, this.padding.top + chartHeight);
            ctx.stroke();
        }
    }
    
    drawLineChart(ctx, xScale, yScale, chartHeight) {
        const dataCount = this.isAnimating ? Math.floor(this.visibleData.length * this.animationProgress) : this.visibleData.length;
        if (dataCount < 2) return;
        
        // Draw gradient fill
        const gradient = ctx.createLinearGradient(0, this.padding.top, 0, this.padding.top + chartHeight);
        gradient.addColorStop(0, this.colors.lineGradientTop);
        gradient.addColorStop(1, this.colors.lineGradientBottom);
        
        ctx.beginPath();
        ctx.moveTo(xScale(0), yScale(this.visibleData[0].close));
        
        for (let i = 1; i < dataCount; i++) {
            ctx.lineTo(xScale(i), yScale(this.visibleData[i].close));
        }
        
        // Fill area
        ctx.lineTo(xScale(dataCount - 1), this.padding.top + chartHeight);
        ctx.lineTo(xScale(0), this.padding.top + chartHeight);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(xScale(0), yScale(this.visibleData[0].close));
        for (let i = 1; i < dataCount; i++) {
            ctx.lineTo(xScale(i), yScale(this.visibleData[i].close));
        }
        ctx.strokeStyle = this.colors.line;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw points
        for (let i = 0; i < dataCount; i++) {
            if (i === this.hoveredIndex) {
                ctx.beginPath();
                ctx.arc(xScale(i), yScale(this.visibleData[i].close), 6, 0, Math.PI * 2);
                ctx.fillStyle = this.colors.line;
                ctx.fill();
            }
        }
    }
    
    drawCandlestickChart(ctx, xScale, yScale, chartWidth) {
        const candleWidth = Math.max(3, (chartWidth / this.visibleData.length) * 0.7);
        const dataCount = this.isAnimating ? Math.floor(this.visibleData.length * this.animationProgress) : this.visibleData.length;
        
        for (let i = 0; i < dataCount; i++) {
            const d = this.visibleData[i];
            const x = xScale(i);
            const isUp = d.close >= d.open;
            const color = isUp ? this.colors.candleUp : this.colors.candleDown;
            
            // Wick
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, yScale(d.high));
            ctx.lineTo(x, yScale(d.low));
            ctx.stroke();
            
            // Body
            const bodyTop = yScale(Math.max(d.open, d.close));
            const bodyHeight = Math.max(1, Math.abs(yScale(d.open) - yScale(d.close)));
            
            ctx.fillStyle = color;
            ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
            
            // Highlight hovered
            if (i === this.hoveredIndex) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.strokeRect(x - candleWidth / 2 - 2, bodyTop - 2, candleWidth + 4, bodyHeight + 4);
            }
        }
    }
    
    drawBarChart(ctx, xScale, yScale, chartWidth) {
        const barWidth = Math.max(2, (chartWidth / this.visibleData.length) * 0.6);
        const dataCount = this.isAnimating ? Math.floor(this.visibleData.length * this.animationProgress) : this.visibleData.length;
        
        for (let i = 0; i < dataCount; i++) {
            const d = this.visibleData[i];
            const x = xScale(i);
            const isUp = d.close >= d.open;
            const color = isUp ? this.colors.candleUp : this.colors.candleDown;
            
            ctx.strokeStyle = color;
            ctx.lineWidth = barWidth;
            ctx.beginPath();
            ctx.moveTo(x, yScale(d.high));
            ctx.lineTo(x, yScale(d.low));
            ctx.stroke();
            
            // Ticks
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - barWidth / 2, yScale(d.open));
            ctx.lineTo(x, yScale(d.open));
            ctx.moveTo(x, yScale(d.close));
            ctx.lineTo(x + barWidth / 2, yScale(d.close));
            ctx.stroke();
        }
    }
    
    drawCrosshair(ctx, xScale, yScale, chartHeight, width, height) {
        const d = this.visibleData[this.hoveredIndex];
        const x = xScale(this.hoveredIndex);
        const y = yScale(d.close);
        
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = this.colors.crosshair;
        ctx.lineWidth = 1;
        
        // Vertical line
        ctx.beginPath();
        ctx.moveTo(x, this.padding.top);
        ctx.lineTo(x, this.padding.top + chartHeight);
        ctx.stroke();
        
        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(this.padding.left, y);
        ctx.lineTo(width - this.padding.right, y);
        ctx.stroke();
        
        ctx.setLineDash([]);
    }
    
    drawTooltip(ctx) {
        if (this.hoveredIndex < 0 || this.hoveredIndex >= this.visibleData.length) return;
        
        const d = this.visibleData[this.hoveredIndex];
        const chartWidth = this.canvas.width - this.padding.left - this.padding.right;
        const x = this.padding.left + (this.hoveredIndex + 0.5) * (chartWidth / this.visibleData.length);
        
        const lines = [
            `${d.time}`,
            `O: ${d.open.toLocaleString()}`,
            `H: ${d.high.toLocaleString()}`,
            `L: ${d.low.toLocaleString()}`,
            `C: ${d.close.toLocaleString()}`,
            `Vol: ${(d.volume / 1000000).toFixed(2)}M`
        ];
        
        const padding = 10;
        const lineHeight = 18;
        const boxWidth = 120;
        const boxHeight = lines.length * lineHeight + padding * 2;
        
        let boxX = x + 15;
        if (boxX + boxWidth > this.canvas.width - 10) {
            boxX = x - boxWidth - 15;
        }
        let boxY = this.padding.top + 10;
        
        // Draw tooltip box
        ctx.fillStyle = this.colors.tooltip;
        ctx.strokeStyle = this.colors.line;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8);
        ctx.fill();
        ctx.stroke();
        
        // Draw text
        ctx.fillStyle = '#fff';
        ctx.font = '12px Montserrat, sans-serif';
        ctx.textAlign = 'left';
        
        lines.forEach((line, i) => {
            ctx.fillStyle = i === 0 ? this.colors.line : '#fff';
            ctx.fillText(line, boxX + padding, boxY + padding + (i + 1) * lineHeight - 4);
        });
    }
    
    drawYAxis(ctx, chartHeight, minPrice, maxPrice) {
        ctx.fillStyle = this.colors.text;
        ctx.font = '11px Lora, serif';
        ctx.textAlign = 'right';
        
        const steps = 5;
        for (let i = 0; i <= steps; i++) {
            const price = minPrice + (maxPrice - minPrice) * (1 - i / steps);
            const y = this.padding.top + (i / steps) * chartHeight;
            ctx.fillText(price.toLocaleString('id-ID', { maximumFractionDigits: 0 }), this.canvas.width - 5, y + 4);
        }
    }
    
    // Public methods for controls
    setTimeframe(tf) {
        this.timeframe = tf;
        this.generateData();
        this.playAnimation();
    }
    
    setChartType(type) {
        this.chartType = type;
        this.draw();
    }
    
    playAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.isAnimating = true;
        this.animationProgress = 0;
        
        const animate = () => {
            this.animationProgress += 0.02;
            
            if (this.animationProgress >= 1) {
                this.animationProgress = 1;
                this.isAnimating = false;
                this.draw();
                return;
            }
            
            this.draw();
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    pauseAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isAnimating = false;
    }
    
    toggleAnimation() {
        if (this.isAnimating) {
            this.pauseAnimation();
        } else {
            this.playAnimation();
        }
        return this.isAnimating;
    }
    
    resetZoom() {
        this.zoom = 1;
        this.offset = 0;
        this.updateVisibleData();
        this.draw();
    }
    
    // Set stock and regenerate data
    setStock(stockData) {
        this.stockInfo = {
            symbol: stockData.symbol,
            name: stockData.name,
            price: stockData.price,
            change: stockData.change || stockData.chg || 0
        };
        
        // Update header display
        this.updateHeaderDisplay();
        
        // Regenerate data with new price base
        this.generateData();
        this.playAnimation();
    }
    
    updateHeaderDisplay() {
        // Update chart header with new stock info
        const symbolEl = document.querySelector('.chart-symbol');
        const nameEl = document.querySelector('.chart-name');
        const priceEl = document.querySelector('.stock-current-price');
        const changeEl = document.querySelector('.price-change');
        
        if (symbolEl) symbolEl.textContent = this.stockInfo.symbol;
        if (nameEl) nameEl.textContent = this.stockInfo.name;
        if (priceEl) priceEl.textContent = this.stockInfo.price.toLocaleString();
        
        if (changeEl) {
            const isPositive = this.stockInfo.change > 0;
            const sign = isPositive ? '+' : '';
            const changeValue = Math.abs(this.stockInfo.price * this.stockInfo.change / 100).toFixed(0);
            changeEl.textContent = `${sign}${changeValue} (${sign}${this.stockInfo.change}%)`;
            changeEl.className = `price-change ${isPositive ? 'text-buy' : 'text-sell'}`;
        }
    }
}

// Initialize chart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.getElementById('stock-chart');
    if (chartContainer) {
        window.stockChart = new StockChart('stock-chart');
        
        // Bind timeframe buttons
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                window.stockChart.setTimeframe(this.dataset.tf);
            });
        });
        
        // Bind chart type buttons
        document.querySelectorAll('.chart-type-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.chart-type-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                window.stockChart.setChartType(this.dataset.type);
            });
        });
        
        // Bind play/pause button
        const playBtn = document.getElementById('chart-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', function() {
                const isPlaying = window.stockChart.toggleAnimation();
                this.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
            });
        }
        
        // Initial animation
        setTimeout(() => window.stockChart.playAnimation(), 500);
    }
});
