# Setup Guide for Ai Website Builder

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
   - [Environment Variables](#environment-variables)
   - [Database Setup](#database-setup)
4. [Troubleshooting](#troubleshooting)

## Introduction
This guide provides comprehensive instructions on setting up the Ai Website Builder project on different PCs, including the setup of environment variables and the database.

## Prerequisites  
Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)  
- npm (Node Package Manager)  
- A compatible database (e.g., MySQL, MongoDB)

## Setup Instructions  
### Environment Variables  
1. Create a new file named `.env` in the root directory of the project.
2. Add the following environment variables to your `.env` file:
   ```plaintext
   DATABASE_URL=<your_database_url>
   SECRET_KEY=<your_secret_key>
   API_KEY=<your_api_key>
   ```

### Database Setup  
1. Create a new database named `ai_website_builder` using your database management tool.
2. Run the following SQL commands to create the necessary tables:
   ```sql
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(50) NOT NULL,
       password VARCHAR(255) NOT NULL
   );
   ```
3. Update your `.env` file with the correct `DATABASE_URL` based on your database configuration.

### Running the Project  
1. Install the project dependencies:
   ```bash
   npm install
   ```
2. Start the project:
   ```bash
   npm start
   ```

## Troubleshooting  
- **Issue:** Cannot connect to the database  
  **Solution:** Ensure your database server is running and the `DATABASE_URL` is correct in the `.env` file.

- **Issue:** Application crashes on startup  
  **Solution:** Check for missing environment variables in the `.env` file or any syntax errors in your code.

If you encounter any additional issues, please refer to the documentation or open an issue in the repository for further assistance.