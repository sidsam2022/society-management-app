Society Management App – End-to-End Engineering & DevOps Case Study
This document details the complete end-to-end engineering journey for building, configuring, deploying, and securing the Society Management Application. It serves as an technical reference covering local environment setup, version control strategy, full-stack application builds, database integration, domain mapping, and SSL/TLS encryption.
🛠 Project Architecture & Tech Stack
The application is structured as a full-stack, decoupled architecture to manage resident records, automated maintenance billing, and support ticketing.
                  +-----------------------------------+
                  |      Users / Web Browsers         |
                  +-----------------------------------+
                                    |
                                HTTPS (443)
                                    v
                  +-----------------------------------+
                  |   Nginx Reverse Proxy & SSL       |
                  |     (Let's Encrypt Certbot)       |
                  +-----------------------------------+
                                    |
                  +-----------------+-----------------+
                  |                                   |
           Port 80 / Static                     Port 5000 / API
                  v                                   v
    +---------------------------+       +---------------------------+
    |   React Frontend Build    |       |   Express Backend Node    |
    |    (Bootstrap UI)         |       |      (PM2 Process)        |
    +---------------------------+       +---------------------------+
                                                      |
                                                 MySQL Query
                                                      v
                                        +---------------------------+
                                        |    MySQL / MariaDB DB     |
                                        +---------------------------+
•	Frontend: React, Bootstrap, Axios
•	Backend: Node.js, Express.js (REST API architecture)
•	Database: MySQL / MariaDB relational database
•	Infrastructure & Security: Nginx, Certbot (Let's Encrypt SSL), Git Bash, Linux systemd/PM2, Custom DNS
Phase 1: Environment Configuration & SSH Security
To establish a secure deployment pipeline and avoid basic authentication failures during remote pushes, the development environment was configured with global identity parameters and public-key cryptography.
1. Global Git Configuration
PowerShell
# Set identity for all local commits
git config --global user.name "Mani.Kumar"
git config --global user.email "sidsam2022@gmail.com"

# Verify global parameters
git config --list
2. SSH Keypair Generation & Agent Integration
Instead of password authentication, an Ed25519 keypair was generated due to its cryptographic strength and lower computational overhead compared to RSA.
PowerShell
# Generate Ed25519 SSH Keypair
ssh-keygen -t ed25519 -C "sidsam2022@gmail.com"

# Start the SSH Agent service on Windows
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent

# Load private key into the local agent
ssh-add $env:USERPROFILE\.ssh\id_ed25519
The public key (~/.ssh/id_ed25519.pub) was added under GitHub Settings → SSH and GPG keys.
PowerShell
# Test connection with GitHub
ssh -T git@github.com
3. Clone and Shell Environment Adjustment
To avoid cross-platform encoding artifacts (Windows CRLF vs. Linux LF) and shell syntax discrepancies, execution was shifted from PowerShell to Git Bash.
Bash
git clone git@github.com:sidsam2022/society-management-app.git
cd society-management-app
Phase 2: Modular Branching & Git Workflow Strategy
To maintain a clean trunk history on main, documentation and codebase setups were separated into topic-specific branches.
Branch Breakdown & History Management
Feature / Documentation	Source Branch	Target Output File	Workflow Action
Database Schemas	docs/database-setup	docs/01-mysql-mariadb.md	Created initial tables, fixed UTF-8 encoding artifacts.
Backend Services	docs/backend-setup	docs/02-backend.md	Isolated backend logic via git cherry-pick.
Frontend Setup	docs/frontend-setup	docs/03-frontend.md	Documented React UI tree & Bootstrap styling.
Deployment Setup	docs/deployment-setup	docs/04-deployment.md	Created end-to-end deployment runbooks.
System Artifacts	docs/artifacts-setup	docs/artifacts.md	Finalized environment config variables and configs.
Resolving Branch Conflicts via Cherry-Picking
When backend documentation commits were accidentally mixed into the database branch, git cherry-pick was executed to extract only the relevant commit to docs/backend-setup without dragging along unneeded history:
Bash
git checkout docs/backend-setup
git cherry-pick <backend-commit-hash>
Pull Request (PR) Merge Strategies Evaluated
1.	Merge Commit (git merge --no-ff): Preserved explicit feature branch topology. Used for core architectural changes.
2.	Squash and Merge: Combined multiple incremental WIP commits into one logical commit. Used for merging documentation updates.
3.	Rebase and Merge: Replayed feature commits onto main sequentially, maintaining a linear git log.
Phase 3: Application Build, Configuration & Push to main
Once local feature branches were verified, application configurations were unified and local production builds were completed.
1. Database Connection & Environment Setup
Database connections were consolidated into environment variable configurations (.env) for both local development and host runtime environments.
Code snippet
# Backend Server Configuration
PORT=5000
NODE_ENV=production

# Database Connection
DB_HOST=localhost
DB_USER=society_admin
DB_PASS=SecurePassword123!
DB_NAME=society_db
2. Building the Frontend Assets
The React frontend was optimized and compiled into static asset bundles:
Bash
# Navigate to frontend directory and install dependencies
cd frontend
npm install

# Build static production assets
npm run build
This generated an optimized /build directory containing static HTML, CSS, and JS bundles ready for web server delivery.
3. Backend Verification & Syncing to main
All backend routes (resident management, fee tracking, ticketing APIs) were linked with the MySQL driver module. All finalized local branches were merged into main and pushed to GitHub:
Bash
git checkout main
git merge docs/artifacts-setup
git push origin main
Phase 4: Custom Domain Registration & DNS Mapping
To expose the application under a public domain name instead of a bare IP address, a free custom domain provider (such as DuckDNS / Freedomain) was integrated.
DNS Configuration Steps
1.	Registered a custom domain/subdomain (e.g., society-app.duckdns.org or custom domain).
2.	Pointed the DNS A Record to the host server's public IPv4 address:
Record Type	Host / Name	Value / Target	TTL
A	@ / society-app	YOUR_SERVER_PUBLIC_IP	300
3.	Verified propagation locally:
Bash
ping society-app.duckdns.org
# or
nslookup society-app.duckdns.org
Phase 5: Nginx Reverse Proxy & HTTPS with Let's Encrypt
To serve the React static files, proxy API calls to the Express backend, and handle SSL termination, Nginx was configured along with Certbot.
1. Nginx Server Block Configuration
File created at /etc/nginx/sites-available/society-app:
Nginx
server {
    listen 80;
    server_name society-app.duckdns.org;

    # Frontend static files
    location / {
        root /var/www/society-management-app/frontend/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # API Proxy to Express Backend
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
Enable the configuration and reload Nginx:
Bash
sudo ln -s /etc/nginx/sites-available/society-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
2. SSL/TLS Certificate Provisioning (Let's Encrypt)
Certbot was used to issue a free SSL certificate and automatically reconfigure Nginx to enforce HTTPS redirect:
Bash
# Install Certbot and Nginx plugin
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Obtain and install SSL Certificate
sudo certbot --nginx -d society-app.duckdns.org
Certbot automatically added SSL directives to the Nginx block, converting all traffic to HTTPS on port 443 with TLS encryption.
3. Automated Renewal Test
Bash
sudo certbot renew --dry-run
Key Troubleshooting Highlights & Lessons Learned
1.	Line Ending Artifacts (CRLF vs LF):
o	Issue: Editing files across Windows PowerShell and Linux servers introduced ^M line break characters and git warnings (LF will be replaced by CRLF).
o	Fix: Switched primary text editing to Git Bash, VS Code, and Vim, ensuring file encoding was explicitly set to UTF-8 without BOM.
2.	Commit Segregation:
o	Issue: Database and backend updates were mixed together during early documentation updates.
o	Fix: Applied git cherry-pick to cleanly isolate commits into their designated topic branches before opening PRs.
3.	CORS & Reverse Proxy Routing:
o	Issue: Direct API calls from React to Express caused Cross-Origin Resource Sharing (CORS) errors in production.
o	Fix: Proxied /api/ traffic through Nginx locally on port 80/443 directly to http://localhost:5000, eliminating cross-origin issues completely.
4.	HTTPS Encryption:
o	Issue: Browsers raised security warnings when accessing the app via IP addresses.
o	Fix: Mapped a free domain name and installed Let's Encrypt SSL certificates, securing browser traffic over TLS.
