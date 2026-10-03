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

//Secure MariaDB (RHEL 9 / MariaDB 10.5)//
***On newer MariaDB builds, the interactive wizard is deprecated. Use the following commands instead:
# Set root password (non-interactive)
sudo mysql_secure_installation --set-root-pass societymgmt@2026

Then log in as root:
mysql -u root -p

Run these SQL statements to harden the server:
-- Remove anonymous users
DELETE FROM mysql.user WHERE User='';

-- Restrict root login to localhost
DROP USER IF EXISTS 'root'@'%';

-- Remove test database
DROP DATABASE IF EXISTS test;

-- Apply changes
FLUSH PRIVILEGES;



3. Create Database and User
Login to MariaDB:
mysql -u root -p

Create schema and user:
CREATE DATABASE society;
CREATE USER 'society'@'%' IDENTIFIED BY 'SocietyApp@2026';
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

// Literal Validation //

98.89.0.183 | 172.31.31.3 | t3.micro | null
[ root@ip-172-31-31-3 ~ ]# mysql -u root -p
Enter password:
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 9
Server version: 10.5.29-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> show tables;
ERROR 1046 (3D000): No database selected
MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| society            |
+--------------------+
4 rows in set (0.000 sec)

MariaDB [(none)]> use society;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
MariaDB [society]> show tables;
+-------------------+
| Tables_in_society |
+-------------------+
| expenses          |
| payments          |
| residents         |
| tickets           |
| visitors          |
+-------------------+
5 rows in set (0.000 sec)

MariaDB [society]> use expenses;
ERROR 1049 (42000): Unknown database 'expenses'
MariaDB [society]> select * from expenses;
+----+-------------------+---------+------------+
| id | description       | amount  | date       |
+----+-------------------+---------+------------+
|  1 | Lift Maintenance  | 1500.00 | 2026-09-28 |
|  2 | Security Salaries | 5000.00 | 2026-09-30 |
+----+-------------------+---------+------------+
2 rows in set (0.000 sec)

MariaDB [society]> select * from payments;
+----+-------------+---------+------------+
| id | resident_id | amount  | date       |
+----+-------------+---------+------------+
|  1 |           1 | 2500.00 | 2026-10-01 |
|  2 |           2 | 3000.00 | 2026-10-02 |
+----+-------------+---------+------------+
2 rows in set (0.000 sec)

MariaDB [society]> select * from residents;
+----+--------------+---------+------------+-------------------+
| id | name         | flat_no | phone      | email             |
+----+--------------+---------+------------+-------------------+
|  1 | Ravi Kumar   | A101    | 9876543210 | ravi@example.com  |
|  2 | Priya Sharma | B202    | 9123456780 | priya@example.com |
+----+--------------+---------+------------+-------------------+
2 rows in set (0.000 sec)

MariaDB [society]> select * from tickets;
+----+-------------+-------------------------------+--------+---------------------+
| id | resident_id | issue                         | status | created_at          |
+----+-------------+-------------------------------+--------+---------------------+
|  1 |           1 | Water leakage in bathroom     | open   | 2026-10-03 15:48:20 |
|  2 |           2 | Electricity outage in block B | open   | 2026-10-03 15:48:20 |
+----+-------------+-------------------------------+--------+---------------------+
2 rows in set (0.000 sec)

MariaDB [society]> select * from visitors;
+----+-----------------+---------+---------------------+----------+
| id | name            | flat_no | in_time             | out_time |
+----+-----------------+---------+---------------------+----------+
|  1 | Delivery Boy    | A101    | 2026-10-03 15:48:29 | NULL     |
|  2 | Friend of Priya | B202    | 2026-10-03 15:48:29 | NULL     |
+----+-----------------+---------+---------------------+----------+
2 rows in set (0.000 sec)

MariaDB [society]>


Summary
Installed MariaDB on RHEL 9 EC2
Secured installation
Created society database and user
Defined tables for residents, payments, expenses, tickets, visitors
Verified with test insert/query
