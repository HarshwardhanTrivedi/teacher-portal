-- ============================================
-- Teacher Portal Database Schema
-- Database: MySQL
-- ============================================

CREATE DATABASE IF NOT EXISTS teacher_portal;
USE teacher_portal;

-- auth_user table
CREATE TABLE auth_user (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- teachers table (1-1 with auth_user)
CREATE TABLE teachers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL UNIQUE,
    university_name VARCHAR(200) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    year_joined YEAR NOT NULL,
    department VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_teacher_user FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);
