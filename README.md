# RebuildEthiopia API 🇪🇹

### A High-Performance Aid Distribution & Blockchain Integration Engine

RebuildEthiopia is a fintech-meets-web3 solution built to solve transparency issues in aid distribution. By bridging traditional fiat payment gateways (Chapa/Telebirr) with digital currency (Creditcoin/CTC), we ensure that every donation is verifiable, traceable, and secure from donor to beneficiary.

---

## 🚀 The Mission

Traditional aid often lacks a "paper trail." RebuildEthiopia automates the conversion of local donations into tokenized assets on the blockchain, ensuring auditability through public transaction hashes and verified identity via Fayda ID.

## 🏗 Project Architecture

The project follows a modular controller-service pattern for high maintainability:

- **`src/controllers/`**: Handles incoming HTTP requests and sends responses.
- **`src/services/`**: The core business logic. Contains integrations for **Chapa**, **Telebirr**, and **Ethers.js** blockchain calls.
- **`src/routes/`**: Defines the API endpoints for donations, authentication, and user management.
- **`src/models/`**: MongoDB schemas for structured transaction logging.
- **`src/middleware/`**: Logic for JWT authentication and request validation.
- **`src/lib/`**: Reusable configuration for third-party clients (Database, Blockchain RPC).
- **`src/utils/`**: Helper functions for encryption, hashing, and formatting.

## 🛠 Tech Stack

- **Runtime:** Bun (Current Node.js logic)
- **Framework:** BetterAuth (Identity & Security)
- **Database:** MongoDB
- **Payment Gateway:** Chapa & Telebirr
- **Blockchain:** Ethers.js (Creditcoin/EVM)
- **Storage:** Cloudinary (Beneficiary KYC data)

## ⚡ Current Status: The Rust Transition

In line with industry standards for financial reliability, the high-volume transaction processing logic of this project is currently being ported to **Rust** using the **Axum** framework and **Tokio** runtime. This ensures:

1.  **Memory Safety:** Eliminating runtime crashes in critical payment paths.
2.  **Concurrency:** Handling thousands of transaction webhooks simultaneously.
3.  **Low Latency:** Optimized response times for public-facing payment APIs.

## ⚙️ Setup & Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/hunde32/rebuild-eth-app.git](https://github.com/hunde32/rebuild-eth-app.git)
    cd rebuild-eth-app
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Configure Environment Variables:**
    Copy `.env.example` to `.env` and provide your specific keys (Chapa Secret, Alchemy/RPC URL, etc.).

    ```bash
    cp .env.example .env
    ```

4.  **Run the server:**
    ```bash
    bun run index.ts
    ```

---

**Note:** This project logic stems from the **BUIDL CTC Hackathon**.
