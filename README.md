# society-management-app
A 3‑tier application inspired by NoBrokerhood/MyGate, built with Node.js backend, MariaDB database, and Nginx frontend + load balancer. Features include resident management, maintenance payments, expense tracking, repair tickets, and visitor logging.
---

## Features
- Resident management (add, update, delete, view)
- Maintenance payments (track, record, report)
- Expense tracking (categories, descriptions, amounts)
- Repair tickets (raise, assign, resolve)
- Visitor logging (entry/exit records)

---

## Architecture
- **Frontend**: Nginx serving static UI and proxying API requests
- **Backend**: Node.js + Express REST APIs
- **Database**: MariaDB/MySQL with normalized schema
- **Load Balancer**: Nginx distributing traffic to frontend servers

---

## Repository Structure
society-management-app/
├── backend/        # Node.js backend code
├── frontend/       # Static UI files (HTML, JS, CSS)
├── configs/        # Nginx and systemd configs
├── docs/           # Documentation in Markdown
└── README.md       # Project overview


