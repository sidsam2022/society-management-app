Deployment Guide (EC2 Instances)
This document explains how to deploy the Society Management App on RHEL 9 EC2 instances without containers.

1. Provision EC2 Instances
Launch three EC2 instances (RHEL 9 recommended):

Database Instance → MariaDB

Backend Instance → Node.js + Express

Frontend Instance → React

Assign appropriate Security Groups:

Database → allow port 3306 from backend private IP only

Backend → allow port 3000 from frontend private IP only

Frontend → allow port 80/443 from public internet

2. Database Setup (MariaDB)
On the database EC2:

Install MariaDB server

Secure installation (mysql_secure_installation)

Create society schema and user

Import schema tables (residents, payments, expenses, tickets, visitors)

Verify with test insert/query

3. Backend Setup (Node.js + Express)
On the backend EC2:

Install Node.js 18 and npm

Create /app/backend directory

Copy backend files (server.js, routes/, db.js, package.json)

Install dependencies:
npm install express mysql2 cors dotenv

Configure systemd service /etc/systemd/system/backend.service:

ExecStart → /bin/node /app/backend/server.js

Environment variables → DB_HOST, DB_USER, DB_PWD, DB_DATABASE

Enable and start service:
systemctl daemon-reload
systemctl enable backend
systemctl start backend

Verify health endpoint:
curl http://localhost:3000/api/health

4. Frontend Setup (React)
On the frontend EC2:

Install Node.js and npm

Create /app/frontend directory

Copy React project files

Install dependencies:
npm install axios react-router-dom bootstrap

Build production bundle:
npm run build

Install and configure Nginx:
sudo dnf install nginx -y

Copy build files to /usr/share/nginx/html

Configure reverse proxy in /etc/nginx/conf.d/frontend.conf:
server {
listen 80;
server_name _;
root /usr/share/nginx/html;
location /api/ {
proxy_pass http://<backend-private-ip>:3000/;
}
}

Enable and start Nginx:
systemctl enable nginx
systemctl start nginx

5. Verification
Access frontend via public IP:
http://<frontend-public-ip>/residents

Ensure API calls route through Nginx to backend

Confirm database queries return expected results

Summary

Provisioned three EC2 instances (DB, backend, frontend)
Installed and configured MariaDB, Node.js, React, Nginx
Secured communication via private IPs and security groups
Verified full stack deployment with frontend → backend → database flow
