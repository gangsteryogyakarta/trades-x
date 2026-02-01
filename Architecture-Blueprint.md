# System Architecture Blueprint

**Project:** TradeX
**Architecture Style:** Hybrid Monolith (Modular Monolith with Event-Driven Services)

---

## 1. High-Level Diagram

```mermaid
graph TD
    Client[User Browser / SPA] -->|HTTPS| LB[Load Balancer / Nginx]
    Client -->|WSS (Secure WebSocket)| Reverb[Laravel Reverb Server]

    subgraph "Application Layer"
        LB --> API[Laravel API & Web Server]
        API -->|Publish Event| Redis[Redis (Pub/Sub & Cache)]
        Redis -->|Subscribe| Reverb
    end

    subgraph "Data Layer"
        API -->|Read/Write| DB_Primary[(MySQL Primary)]
        API -->|Read Only| DB_Replica[(MySQL Replica)]
    end

    subgraph "Worker Layer"
        Queue[Redis Queue]
        MarketWorker[Market Data Ingestion Worker] -->|Push Update| Redis
        MatchWorker[Matching Engine Worker] -->|Process| DB_Primary
        API -->|Dispatch Job| Queue --> MatchWorker
    end
```
