Frontend Deployment Artifacts (EC2)
This document lists all required artifacts, packages, and configurations for deploying the React frontend application on RHEL 9 EC2 instances.

1. Source Code Files
package.json → project metadata and dependencies

src/ → React source files (App.js, components/, index.js)

public/ → static assets (index.html, favicon, logos)

.env (optional) → environment variables for API base URL

2. Node.js Packages
Ensure the following modules are installed via npm:

react

react-dom

axios

react-router-dom

bootstrap

3. Build Artifacts
After running npm run build, the following are generated:

build/ → production bundle

index.html

static/js/ → compiled JavaScript

static/css/ → compiled CSS

static/media/ → images and fonts

These files must be copied to the Nginx web root (/usr/share/nginx/html).

4. System Packages (RHEL 9 EC2)
Node.js 18 runtime

npm (bundled with Node.js)

Nginx web server

5. Nginx Configuration
Create /etc/nginx/conf.d/frontend.conf:

server {
listen 80;
server_name _;
root /usr/share/nginx/html;

location / {
index index.html;
try_files $uri /index.html;
}

location /api/ {
proxy_pass http://<backend-private-ip>:3000/;
}
}

6. Deployment Steps
Copy frontend source code to /app/frontend

Run npm install to fetch dependencies

Build production bundle: npm run build

Copy build/ contents to /usr/share/nginx/html

Place frontend.conf in /etc/nginx/conf.d/

Test Nginx config: nginx -t

Enable and start Nginx:
systemctl enable nginx
systemctl restart nginx

7. Verification
Access frontend via public IP:
http://<frontend-public-ip>/residents

Confirm API calls route through Nginx to backend

Ensure UI loads correctly with React routing

✅ Summary
Artifacts required for frontend deployment:

Source code files (App.js, components/, package.json, public/)

Node.js modules (react, react-dom, axios, react-router-dom, bootstrap)

Build artifacts (build/ folder after npm run build)

System packages (Node.js, npm, Nginx)

Nginx config (frontend.conf)

Deployment steps for installation and service management
