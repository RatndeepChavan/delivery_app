# 🚀 Quick Commerce & Delivery Tracking System

This is a **full-stack quick commerce platform** where customers can place and track their order status, while delivery partners can accept and update deliveries. All updates are reflected in real-time with **GraphQL subscriptions** using `graphql-ws`. The application is built with **Node.js, Express, Next.js, and GraphQL** and is deployed to a **Kubernetes** cluster with an automated **GitHub Actions** CI/CD pipeline.

---

## ✨ Features

### 🔑 Authentication & Authorization
- **JWT-based authentication** with both **access and refresh tokens** for secure, persistent sessions.
- **Role-Based Access Control (RBAC)** enforced at both the API and UI levels to control user permissions.
- **NextAuth** integration provides a seamless and robust authentication flow for the frontend.

### 🛒 Customer Features
- Place new orders by specifying a product, quantity, and delivery location.
- Track their order status in real time via **GraphQL subscriptions**.
- View a history of all past and completed orders.

### 🚚 Delivery Partner Features
- A dashboard to view all **pending** orders awaiting acceptance.
- The ability to accept an order and update its status through a simple workflow: *Pending → Accepted → Out for Delivery → Delivered*.
- View a history of all orders they have Accepted.

### ⚡ Real-Time Updates
- Implemented using **GraphQL Subscriptions** powered by `graphql-ws` to provide a WebSocket connection.
- Customers receive **live order status updates** as soon as a delivery partner modifies an order.

### 🗄️ Backend
- **Node.js** with **Express** and **TypeScript**.
- **Apollo Server** to serve the **GraphQL API**.
- **MongoDB** with **Mongoose** for a flexible database solution.
- **Zod** for powerful and type-safe schema validation.

### 🎨 Frontend
- **Next.js** with **TypeScript** for type safety.
- **NextAuth** configured with a JWT strategy for authentication.
- **Apollo Client** to handle all GraphQL operations, including `subscriptions` support.
- **Tailwind CSS** for a fast and utility-first approach to styling.
- **React Hook Form** combined with **Zod** for efficient and validated form handling.

### ☁️ Deployment & DevOps
- **Docker** with **multi-stage builds** to create a lightweight, secure **distroless** production image.
- **docker-compose** for simple multi-service development.
- **GitHub Actions** provides an automated CI/CD pipeline for building and deploying the application on code push.
- **Kubernetes deployment**:
  - **Flannel CNI** for container networking.
  - **Ingress NGINX** for routing and load balancing.
- Environment variables are securely managed with `.env` files for local development and `*-secret.yml` files for Kubernetes deployment.

---

## 🏗️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js, Tailwind CSS, NextAuth, Apollo Client |
| **Backend** | Node.js, Express, Apollo Server, GraphQL Subscriptions |
| **Database** | MongoDB, Mongoose |
| **Validation** | Zod |
| **Authentication** | JWT (access + refresh tokens), NextAuth |
| **Deployment** | Docker, Kubernetes, GitHub Actions |
| **Real-Time** | `graphql-ws` (subscriptions) |
---

## ⚙️ Setup & Deployment
## ⚡ Quick Start
👉 Jump directly to setup instructions:  
- [Local Run](#1️⃣-local-development)  
- [Local Deployment (Docker Compose)](#2️⃣-local-deployment-docker-compose)  
- [Production Deployment (Kubernetes--github-actions)](#3️⃣-production-deployment-kubernetes--github-actions)  

### 1️⃣ Local Development

1. **Clone the repository.**
2. Create `.env` files in both `backend/` and `frontend/` using the `.env.example` templates.
3. Install backend dependencies and run the backend service:
   ```bash
   # Open a new terminal for backend
   cd backend
   npm install
   npm run dev
   ```
4. Install frontend dependencies and run the frontend service:
   ```bash
   # Open a new terminal for frontend
   cd frontend 
   npm install
   npm run dev
   ```
5. Access the application at `http://localhost:3000`.

**✅ NOTE:** Ensure your Node.js version is compatible with the version specified in `backend/.nvmrc`. Also, update the Apollo Client configuration in `frontend/src/providers/apollo-client/clientWrapper.tsx` to use `http://localhost:3000/graphql` for HTTP and `ws://localhost:3000/graphql` for WebSockets.

### 2️⃣ Local Deployment (Docker Compose)

1. **Clone the repository.**
2. Create `.env` files in both `backend/` and `frontend/` using the `.env.example` templates.
3. Install backend dependencies to generate lock file (optional if you already have lock file in backend directory):
   ```bash
   # Open a new terminal for backend
   cd backend
   npm install
   ```
4. Install frontend dependencies to generate lock file (optional if you already have lock file in frontend directory):
   ```bash
   # Open a new terminal for frontend
   cd frontend
   npm install
   ```
5. Build and run the containers using the `compose-local.yml` file:
    ```bash
    docker compose -f compose-local.yml up --build
    ```
6. Access the application at `http://localhost:3000`.

**✅ NOTE:** Make sure Docker and Docker Compose are installed. Ensure the `backend/`, `frontend/`, and `compose-local.yml` files are in the same directory. Also, update the Apollo Client configuration in `frontend/src/providers/apollo-client/clientWrapper.tsx` to use `http://localhost:3000/graphql` for HTTP and `ws://localhost:3000/graphql` for WebSockets.

### 3️⃣ Production Deployment (Kubernetes + GitHub Actions)

🔹 **Infrastructure Setup**
1. Provision EC2 instances
   - Minimum 2 instances (1 master, 1 worker).
2. Install Kubernetes dependencies
   - Copy `k8s-basic-setup.sh` to each instance.
   - Run:
      ```bash
      sh k8s-basic-setup.sh
      ```
   - This installs *containerd, kubelet, kubeadm, and kubectl*.
3. Initialize Master Node
   - Copy k8s-master-setup.sh to your chosen master node.
   - Run:
      ```bash
      sh k8s-master-setup.sh
      ```
   - This sets up master with *Flannel CNI and Ingress NGINX*.
   - At the end, run the commented `kubeadm token create --print-join-command` command to get a join command.
4. Join Worker Nodes
   - Run the generated join command with `sudo` on worker nodes.

🔹 **Kubernetes Secrets**
   - Create the necessary secrets from the provided template YAML files:
      ``` bash
      kubectl apply -f backend-secret.yml
      kubectl apply -f frontend-secret.yml
      ```
      ⚠️ For simplicity, secrets are stored in files. In production, using volumes or external secret managers is recommended.

🔹 **CI/CD with GitHub Actions**
1. Configure GitHub Actions with your Docker Hub credentials as secrets (`DOCKER_USERNAME`, `DOCKER_PASSWORD`).
2. Add your Kubernetes master node as a **self-hosted runner** to your repository.
3. On push to master:
   - Build stage (GitHub-hosted runner):
      - Build backend & frontend images via compose-deployment.yml.
      - Push images to Docker Hub.
   - Deploy stage (self-hosted runner):
      - Apply configmaps 
      - Apply deployments and services.
      - Wait until rollout is complete.
      - Apply ingress.

🔹 **Final Step**
- Check ingress port mapping for 80 using

   ```bash
    kubectl get services -n ingress-nginx
   ```
- Update API links in `frontend/src/providers/apollo-client/clientWrapper.tsx` to point to your EC2 public IP + ingress port (mapped to 80):

   ``` 
   HTTP: http://<EC2_PUBLIC_IP>:<PORT>/graphql
   WS:   ws://<EC2_PUBLIC_IP>:<PORT>/graphql
   ```
- Update CALLBACKE_URL in frontend-configmap.yml file.
- Visit the app at:
   ```
   http://<EC2_PUBLIC_IP>:<PORT>
   ```

## 🏆 Conclusion

**This project demonstrates full-stack app and development with:**
- Secure authentication and RBAC.
- Real-time functionality with GraphQL subscriptions.
- A scalable Kubernetes deployment strategy.
- An automated CI/CD pipeline for seamless deployments.
- A cloud-ready, containerized infrastructure.

