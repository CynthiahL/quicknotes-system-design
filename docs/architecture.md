# QuickNotes Architecture

This document outlines the functional and non-functional requirements, system load estimates, architecture diagram, component explanations, request flows, and trade-offs for scaling QuickNotes to 1 million users.

---

## Functional Requirements
- Users can create, read, update, and delete notes.
- Notes can be tagged and searched.
- Authentication and authorization for users.
- API endpoints return JSON responses.
- Notes persist reliably in the database.

## Non-Functional Requirements
- High availability and fault tolerance.
- Scalability to millions of users.
- Low latency (<200ms for reads).
- Secure communication (HTTPS).
- Data consistency and durability.

---

## Load Estimates (1 million users)
- **Reads per second**: Assume 20% of users active daily → 200,000 users/day.  
  Average 10 reads/user/day → ~2 million reads/day ≈ 23 reads/sec.  
  Peak load ×10 → ~230 reads/sec.
- **Writes per second**: Average 2 writes/user/day → 400,000 writes/day ≈ 5 writes/sec.  
  Peak load ×10 → ~50 writes/sec.
- **Storage per year**: Average note size 1 KB.  
  2 notes/user/day × 365 × 1 million users = ~730 billion notes ≈ 730 GB/year.

---

## Architecture Diagram (textual)

Client (browser/mobile)
|
v
DNS → CDN → Load Balancer
|
v
App Servers (2+)
|
+--> Cache (Redis)
|
+--> Primary Database (PostgreSQL)
|         |
|         v
|     Read Replica
|
+--> Queue (RabbitMQ/Kafka) → Worker (background tasks)


---

## Component Explanations
- **Client**: Sends requests to the API.
- **DNS**: Resolves domain names to IP addresses.
- **CDN**: Delivers static assets quickly worldwide.
- **Load Balancer**: Distributes traffic across app servers.
- **App Servers**: Handle API logic and business rules.
- **Cache (Redis)**: Speeds up frequent reads (e.g., popular notes).
- **Primary Database (PostgreSQL)**: Stores user and note data.
- **Read Replica**: Handles read-heavy traffic, offloading primary DB.
- **Queue (RabbitMQ/Kafka)**: Decouples background tasks (e.g., analytics, notifications).
- **Worker**: Processes queued jobs asynchronously.

---

## Request Flows

### GET /notes
1. Client sends request.
2. DNS resolves → CDN → Load Balancer.
3. Load Balancer routes to an App Server.
4. App Server checks Cache; if miss, queries Read Replica.
5. Response returned to client.

### POST /notes
1. Client submits note.
2. DNS resolves → CDN → Load Balancer.
3. Load Balancer routes to an App Server.
4. App Server validates input, writes to Primary Database.
5. Cache invalidated/updated.
6. Worker notified via Queue for analytics.
7. Response returned to client.

---

## Trade-offs
- **SQL vs NoSQL**: SQL chosen for relational consistency; trade-off is less flexible schema compared to NoSQL.
- **Cache consistency**: Cache improves speed but risks stale data; mitigated with TTL and invalidation.
- **Read replicas**: Improve scalability but introduce replication lag; acceptable for non-critical reads.

---

## Avoiding Single Points of Failure
- Multiple app servers behind a load balancer.
- Database with primary + read replica.
- Queue with clustered setup.
- CDN and DNS redundancy.
