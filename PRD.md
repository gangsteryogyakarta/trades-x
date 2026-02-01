# Product Requirements Document (PRD)
**Project Name:** TradeX (Placeholder)
**Version:** 1.0
**Status:** Draft
**Author:** Okie Sandra Firmansyah

---

## 1. Executive Summary
TradeX adalah platform trading saham berbasis web yang dirancang untuk memberikan pengalaman trading *low-latency* dengan antarmuka modern (Glassmorphism). Platform ini menargetkan trader ritel yang membutuhkan data real-time dan eksekusi order cepat tanpa kompleksitas aplikasi desktop institusional.

## 2. Target Audience
* **Retail Trader:** Pengguna individu yang melakukan jual-beli saham harian/mingguan.
* **Administrator:** Staf internal yang memantau transaksi, user management, dan settlement.

## 3. Scope & Prioritization (MoSCoW)

### Must Have (MVP - Fase 1)
* **Authentication:** Login, Register, KYC (Upload KTP), dan 2FA (Google Authenticator).
* **Market Data:** Streaming harga saham real-time (Ticker Tape & Depth) via WebSocket.
* **Order Management:**
    * Input Order (Buy/Sell).
    * Validasi `Buying Power` dan `Stock Balance`.
    * Status Order real-time (Open, Matched, Rejected).
* **Portfolio:** Kalkulasi `Unrealized Gain/Loss` dan Total Aset secara real-time.
* **Wallet:** Deposit & Withdraw simulasi (integrasi Payment Gateway di fase lanjut).

### Should Have (Fase 2)
* **Advanced Charting:** Integrasi TradingView Lightweight Charts (Candlestick, Volume, MA).
* **Notification:** Push notification saat order *Matched*.
* **Trade History Export:** Download riwayat transaksi ke PDF/CSV.

### Could Have (Fase 3)
* **Dark/Light Mode Toggle.**
* **Watchlist Grouping:** Multiple watchlist customizable by user.
* **Stock Screener:** Filter saham berdasarkan parameter dasar (Volume, %Change).

## 4. User Experience (UX/UI) Guidelines
* **Design Language:** Glassmorphism (Translucent panels, blur effects, vivid gradients).
* **Responsiveness:** Desktop-first, namun adaptif untuk Tablet/Mobile.
* **Color Coding:** Hijau (#00C853) untuk kenaikan/Buy, Merah (#D50000) untuk penurunan/Sell.
* **Feedback:** Setiap aksi user (klik Buy, Cancel Order) harus memiliki visual feedback instan (<100ms).

## 5. Non-Functional Requirements
* **Performance:** Update data market ke client < 200ms.
* **Concurrency:** Support 1,000 concurrent connections pada MVP.
* **Security:** Enkripsi data sensitif (AES-256), HTTPS Only, Rate Limiting API.
* **Availability:** 99.9% uptime selama jam bursa (09:00 - 16:00 WIB).