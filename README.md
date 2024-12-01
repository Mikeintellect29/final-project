TeleMed: A Comprehensive Telemedicine Platform
Welcome to TeleMed, a comprehensive telemedicine platform designed to streamline the healthcare experience for both patients and healthcare professionals. This application allows patients to book appointments with doctors, receive consultations remotely, and access a variety of healthcare services from the comfort of their homes.

Table of Contents
Features
Tech Stack
Installation Instructions
Usage
API Documentation
Database Schema
Contributing
License
Features
User Authentication: Secure login and registration for patients, doctors, and admins.
Appointment Booking: Patients can view available doctors and schedule appointments.
Doctor Dashboard: Doctors can manage their schedules, view patient appointments, and offer consultations.
Admin Panel: Admins can manage users, view appointments, and handle platform settings.
Responsive Design: Fully responsive interface for both mobile and desktop users.
Database Integration: All data is stored in a MySQL database for efficient management and retrieval.
Tech Stack
Frontend:

HTML, CSS, JavaScript (for interactivity)
EJS (Embedded JavaScript templates for dynamic views)
Backend:

Node.js (Runtime environment)
Express.js (Web framework)
MySQL (Database management system)
bcryptjs (Password hashing)
express-session (Session management for user login)
CORS (Cross-Origin Resource Sharing)
Tools:

Postman (For API testing)
Visual Studio Code (Code editor)
Installation Instructions
Prerequisites:
Before you begin, ensure that you have the following installed:

Node.js: Install Node.js
MySQL: Install MySQL
Step-by-step Setup:
Clone the Repository:

bash
Copy code
git clone https://github.com/yourusername/telemed.git
cd telemed
Install Dependencies:

In the root directory of the project, run:

bash
Copy code
npm install
This will install all the necessary npm packages required for the project.

Set Up Database:

Create a new MySQL database named telemedicine_db:

sql
Copy code
CREATE DATABASE telemedicine_db;
Import the provided SQL schema (located in /db/schema.sql) into your database:

bash
Copy code
mysql -u root -p telemedicine_db < db/schema.sql
Configure Environment Variables:

Create a .env file in the root directory and add the following:

text
Copy code
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=telemedicine_db
SESSION_SECRET=your-session-secret
Run the Application:

After setting up everything, run the application:

bash
Copy code
npm start
The server will start running on http://localhost:3800.

Usage
Admin Panel:

URL: /admin
Admins can log in using credentials and manage users, view appointments, and configure platform settings.
Patient Portal:

Patients can register, log in, and view available doctors to schedule appointments.
View and manage personal profile information.
Doctor Dashboard:

Doctors can view patient appointments, manage availability, and conduct consultations.
Logout:

Log out at any time to terminate your session.
API Documentation
The API exposes several routes for interacting with the backend. Here are some of the main API endpoints:

Authentication
POST /admin/login - Admin login
POST /patient/login - Patient login
POST /doctor/login - Doctor login
POST /register - User registration
Appointments
GET /appointments - View all appointments
POST /appointments - Create a new appointment
PUT /appointments/:id - Update an appointment status
Doctors
GET /doctors - View all doctors
POST /doctors - Add a new doctor (Admin only)
Profile
GET /profile - Get user profile (Patient, Doctor)
PUT /profile - Update user profile (Patient, Doctor)
Database Schema
Here is a brief overview of the database schema used:

Users Table (users):
id (INT, PK) - Unique user identifier.
username (VARCHAR) - Username.
password_hash (VARCHAR) - Hashed password.
role (ENUM) - User role ('admin', 'patient', 'doctor').
Appointments Table (appointments):
id (INT, PK) - Unique appointment identifier.
patient_id (INT, FK) - Foreign key to users.
doctor_id (INT, FK) - Foreign key to users.
appointment_date (DATE) - Date and time of the appointment.
status (ENUM) - Appointment status ('Pending', 'Completed', 'Cancelled').
Doctors Table (doctors):
id (INT, PK) - Unique doctor identifier.
user_id (INT, FK) - Foreign key to users table.
specialty (VARCHAR) - Doctor’s specialty (e.g., General Medicine, Pediatrics).
Contributing
If you'd like to contribute to the project, feel free to fork this repository and submit pull requests with improvements or bug fixes. Ensure that you follow these guidelines:

Create a feature branch for your work.
Write tests for any new features or bug fixes.
Ensure the code is properly formatted.
License
This project is licensed under the MIT License - see the LICENSE file for details.
