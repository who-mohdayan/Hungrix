# 🍽️ Hungrix

Welcome to **Hungrix**! This is a full-stack application that integrates a frontend web interface, a robust backend API, and a machine learning component.

## 🌐 Live Demo

Hungrix is deployed and live on Vercel!  
**Check it out here:** [https://hungrix.vercel.app](https://hungrix.vercel.app)  
*(Replace with your correct Vercel URL if different.)*

## 🗂️ Project Structure

This repository is organized into three main components:

- **`/frontend`**: The user interface of the application.
- **`/backend`**: The server-side API that powers the application logic.
- **`/ml_model`**: The machine learning scripts and models.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps:

### Prerequisites

Make sure you have standard development tools installed (like [Node.js](https://nodejs.org/) for the web apps and [Python](https://www.python.org/) for the ML models).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/who-mohdayan/Hungrix.git
   cd Hungrix
   ```

2. **Setup the Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Setup the Backend:**
   ```bash
   cd ../backend
   npm install
   npm start
   ```

### 🚢 Deployment

This project uses [Vercel](https://vercel.com/) for deployment.

- Pushes to the `main` branch are automatically deployed to Vercel.
- For manual deployment or preview deployments, use the [Vercel CLI](https://vercel.com/docs/cli):
  ```bash
  vercel
  ```
- Configure your Vercel project to point to the appropriate frontend directory as the root.

*(Note: Specific instructions for the `ml_model` and further backend configurations may be added here later.)*

## 🤝 Contributing

Contributions are always welcome! 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
