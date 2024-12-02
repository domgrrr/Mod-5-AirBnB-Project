# Mod-5 Airbnb Project

## Welcome to your very own Airbnb replica—where users explore and book unique accommodations effortlessly.
## Table of Contents

  * Introduction

  * Demo

  * Features

  * Getting Started

  * Usage

  * Technologies

  * Contributing

  * License

  * Contact

  # Introduction

  This project is the culmination of Module 5, aiming to recreate core functionalities of Airbnb. It's designed to provide a seamless platform for users to browse, book, and manage accommodations, while offering hosts the tools to list and oversee their properties.

  # Demo

  [Insert Link Here]

  # Features

  * User Authentication: Secure sign-up and login with session management.

  * Explore Listings: Browse through a variety of accommodations with detailed descriptions and images.

  * Search Functionality: Find places based on location, availability, and other criteria.

  * Booking System: Schedule stays with real-time availability checks.
   
  * Host Dashboard: Users can become hosts, listing properties and managing bookings.

  * Responsive Design: Optimized for desktops, tablets, and mobile devices.

  # Getting Started

  Follow these steps to get a local copy up and running.

  # Prerequisites

  * Node.js and npm

  * PostgreSQL installed and running

  # Installation

  1. Clone the repository

  ```bash
  git clone https://github.com/domgrrr/Mod-5-AirBnB-Project.git
  ```

  2. Navigate to the project directory

  ```bash
  cd Mod-5-AirBnB-Project
  ````

  3. Install dependencies

  ```bash
  npm install
  ```

  4. Set up the database

    * Create a new PostgreSQL database.

    * Run migrations and seed files if available:

  ```bash
  npx sequelize db:migrate
  npx sequelize db:seed:all
  ```

  5. Configure environment variables

    * Create a .env file in the root directory.

    * Add necessary variables (e.g., database credentials, API keys).

  6. Start the application

    ```bash
    npm start
    ```

  # Usage

  * For Guests:

    * Sign Up/In: Create an account or log in.

    * Browse Listings: Explore available properties.

    * View Details: Click on listings for more information.

    * Book Stays: Choose dates and confirm bookings.

  * For Hosts:

    * Become a Host: Switch your account to host mode.

    * Add Listings: Provide property details and images.

    * Manage Bookings: View and manage reservations.

  # Technologies

  * Frontend: HTML5, CSS3, JavaScript, React

  * Backend: Node.js, Express.js

  * Database: PostgreSQL with Sequelize ORM

  * Authentication: CSRF protection using XSRF-TOKEN

  * Libraries: js-cookie, react-redux, redux-thunk, etc.

  # Contributing

  Contributions are welcome! If you'd like to collaborate, please fork the repository and create a pull request with your proposed changes.

  # License

  Distributed under the MIT License. See LICENSE for more information.

  # Contact

  * GitHub: domgrrr

  * Email: domguerr@hotmail.com

  

