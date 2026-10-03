Database Setup (MySQL/MariaDB)
This document explains how to set up the database tier for the Society Management App on a RHEL 9 EC2 instance.

1. Install MariaDB
Run the following commands to install and start MariaDB:

sudo dnf install mariadb-server -y
sudo systemctl enable mariadb
sudo systemctl start mariadb

Verify installation:
mysql --version
systemctl status mariadb

2. Secure MariaDB
Run the secure installation script:
sudo mysql_secure_installation

You will be prompted with several questions. Below are the exact steps and recommended answers:

a) Set Root Password

Enter current password for root (enter for none): Press Enter

Set root password? [Y/n]: Type Y and press Enter

Enter a strong password (example: ExpenseApp@1)

Confirm the password

b) Remove Anonymous Users

Remove anonymous users? [Y/n]: Type Y and press Enter

This prevents anyone from logging in without a user account

c) Disallow Remote Root Login

Disallow root login remotely? [Y/n]: Type Y and press Enter

This ensures the root account can only be used locally

d) Remove Test Database

Remove test database and access to it? [Y/n]: Type Y and press Enter

This deletes the default test database that isn’t needed in production

e) Reload Privilege Tables

Reload privilege tables now? [Y/n]: Type Y and press Enter

This applies all the changes immediately

3. Create Database and User
Login to MariaDB:
mysql -u root -p

Create schema and user:
CREATE DATABASE society;
CREATE USER 'society'@'%' IDENTIFIED BY 'SocietyApp@1';
GRANT ALL PRIVILEGES ON society.* TO 'society'@'%';
FLUSH PRIVILEGES;

4. Create Tables
USE society;

-- Residents
CREATE TABLE residents (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
flat_no INT UNIQUE,
phone VARCHAR(15),
email VARCHAR(100),
role ENUM('admin','treasurer','resident','security') DEFAULT 'resident'
);

-- Payments
CREATE TABLE payments (
id INT AUTO_INCREMENT PRIMARY KEY,
flat_no INT,
amount DECIMAL(10,2),
mode VARCHAR(20),
status ENUM('SUCCESS','PENDING','FAILED') DEFAULT 'SUCCESS',
date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (flat_no) REFERENCES residents(flat_no)
);

-- Expenses
CREATE TABLE expenses (
id INT AUTO_INCREMENT PRIMARY KEY,
category VARCHAR(50),
description VARCHAR(255),
amount DECIMAL(10,2),
date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets
CREATE TABLE tickets (
id INT AUTO_INCREMENT PRIMARY KEY,
flat_no INT,
type ENUM('electrician','plumber','technician'),
status ENUM('open','in-progress','resolved') DEFAULT 'open',
assigned_to VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (flat_no) REFERENCES residents(flat_no)
);

-- Visitors
CREATE TABLE visitors (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
phone VARCHAR(15),
visiting_flat INT,
time_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
time_out TIMESTAMP NULL,
FOREIGN KEY (visiting_flat) REFERENCES residents(flat_no)
);

5. Verification
Check tables:
SHOW TABLES;

Test insert:
INSERT INTO residents (name, flat_no, phone, email, role)
VALUES ('Mani', 101, '9876543210', 'mani@example.com', 'resident');

Query:
SELECT * FROM residents;

Summary
Installed MariaDB on RHEL 9 EC2
Secured installation
Created society database and user
Defined tables for residents, payments, expenses, tickets, visitors
Verified with test insert/query