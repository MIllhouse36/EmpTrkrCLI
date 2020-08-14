DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE Departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NULL
);

CREATE TABLE Roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NULL,
  salary DECIMAL(12,2) NULL,
  department_id INT NULL, 
  FOREIGN KEY(department_id) REFERENCES Departments(id) ON DELETE SET NULL
);

CREATE TABLE Employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NULL,
  last_name VARCHAR(100) NULL,
  role_id INT NULL, 
  manager_id INT NULL,
  FOREIGN KEY(role_id) REFERENCES Roles(id) ON DELETE SET NULL,
  FOREIGN KEY(manager_id) REFERENCES Employees(id) ON DELETE SET NULL
);
SELECT * FROM Departments;
SELECT * FROM Roles;
SELECT * FROM Employees;

INSERT INTO Departments (name)
VALUES ("Management");

INSERT INTO Departments (name)
VALUES ("Sales");

INSERT INTO Roles (title, salary, department_id)
VALUES ("Manager", 50000.50, 1);

INSERT INTO Roles (title, salary, department_id)
VALUES ("Sales", 43000.50, 2);

INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ("Jacky","Doo",1,NULL),("Jane","Doe",2,1);

ALTER TABLE employees DROP FOREIGN KEY employees_ibfk_2;
