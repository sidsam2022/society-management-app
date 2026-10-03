Backend Deployment Artifacts (EC2)
This document lists all required artifacts, packages, and configurations for deploying the backend Node.js application on RHEL 9 EC2 instances.

1. Source Code Files
server.js → main entry point

routes/ → API route handlers (residents.js, payments.js, expenses.js, tickets.js, visitors.js)

db.js → database connection logic

package.json → project metadata and dependencies

.env → environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT)

2. Node.js Packages
Ensure the following modules are installed via npm:

express

mysql2

cors

dotenv

Optional (for monitoring/logging if needed):

morgan → HTTP request logging

winston → advanced logging

3. System Packages (RHEL 9 EC2)
Node.js 18 runtime

npm (bundled with Node.js)

MariaDB client (for testing DB connectivity)

4. Configuration Files
.env file with DB credentials and backend port

backend.service (systemd unit file) in /etc/systemd/system/

Example backend.service:

[Unit]
Description=Society Management Backend Service
After=network.target

[Service]
ExecStart=/bin/node /app/backend/server.js
WorkingDirectory=/app/backend
EnvironmentFile=/app/backend/.env
Restart=always
User=ec2-user

[Install]
WantedBy=multi-user.target

5. Deployment Steps
Copy backend source code to /app/backend

Copy .env file with correct DB credentials

Run npm install to fetch dependencies

Place backend.service in /etc/systemd/system/

Reload systemd: systemctl daemon-reload

Enable service: systemctl enable backend

Start service: systemctl start backend

Verify logs: journalctl -u backend -f

6. Verification
Check backend health endpoint:
curl http://localhost:3000/api/health

Confirm DB connectivity:
curl http://localhost:3000/api/residents

Summary

Artifacts required for backend deployment:
Source code files (server.js, routes/, db.js, package.json, .env)
Node.js modules (express, mysql2, cors, dotenv)
System packages (Node.js, npm, MariaDB client)
Systemd unit file (backend.service)
Deployment steps for installation and service management
