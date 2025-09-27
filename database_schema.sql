-- Discogs Helper Database Schema
-- This file creates the necessary tables for the Discogs Helper application

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS Discogs;
USE Discogs;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Records table (stores discogs release information)
CREATE TABLE IF NOT EXISTS records (
    discogs_id INT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    artist VARCHAR(500) NOT NULL,
    release_year VARCHAR(10),
    genre TEXT,
    styles TEXT,
    thumb_url TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User records table (junction table for user collections/wantlists)
CREATE TABLE IF NOT EXISTS user_records (
    user_id INT NOT NULL,
    discogs_id INT NOT NULL,
    notes TEXT,
    price_threshold DECIMAL(10,2),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    wishlist BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, discogs_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (discogs_id) REFERENCES records(discogs_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_records_artist ON records(artist);
CREATE INDEX idx_records_title ON records(title);
CREATE INDEX idx_user_records_user_id ON user_records(user_id);
CREATE INDEX idx_user_records_discogs_id ON user_records(discogs_id);
CREATE INDEX idx_user_records_wishlist ON user_records(wishlist);

-- Insert some sample data for testing
INSERT IGNORE INTO users (username, email, password) VALUES 
('testuser', 'test@example.com', 'hashedpassword123'),
('admin', 'admin@example.com', 'adminpassword123');

-- Insert some sample records
INSERT IGNORE INTO records (discogs_id, title, artist, release_year, genre, styles) VALUES 
(1, 'Abbey Road', 'The Beatles', '1969', 'Rock', 'Psychedelic Rock, Classic Rock'),
(2, 'Dark Side of the Moon', 'Pink Floyd', '1973', 'Rock', 'Progressive Rock, Art Rock'),
(3, 'Kind of Blue', 'Miles Davis', '1959', 'Jazz', 'Modal Jazz, Cool Jazz');

-- Insert some sample user records
INSERT IGNORE INTO user_records (user_id, discogs_id, notes, price_threshold, rating, wishlist) VALUES 
(1, 1, 'Great album!', 25.00, 5, FALSE),
(1, 2, 'Want this one', 30.00, NULL, TRUE),
(2, 3, 'Classic jazz', 20.00, 4, FALSE);
