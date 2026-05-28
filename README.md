# Librarymanagementsystem

A full-stack Library Management System built using Spring Boot (backend) and Angular (frontend). The system provides role-based access for Admin and Librarian to manage books and library operations efficiently.

Features

Role-based login (Admin, Librarian)
Admin dashboard
Librarian dashboard
Add, update, delete books
Issue books to users
Return books tracking
View book availability and records

Tech Stack

Frontend:
Angular
HTML, CSS, TypeScript

Backend:
Java
Spring Boot
Spring Data JPA

Database:
MySQL

Roles
Admin
Manage librarians
Access overall system data
Librarian
Manage books
Issue and return books
Maintain records
Project Structure
Backend (Spring Boot)
src/
├── controller/
├── service/
├── repository/
├── model/
└── config/
Frontend (Angular)
src/
├── app/
│ ├── admin-dashboard/
│ ├── librarian-dashboard/
│ ├── services/
│ ├── models/
│ └── components/
⚙️ Setup Instructions
Backend Setup
git clone
cd backend
mvn spring-boot:run

Configure database in application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/library_db
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
Frontend Setup
cd frontend
npm install
ng serve
