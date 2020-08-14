const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "yourRootPassword",
  database: "employee_trackerdb"
});
const allEmployees = ()=>{
  console.log("Displaying all Employees...\n");
  connection.query("SELECT * FROM Employees ", (err, res) =>{
    if (err) throw err;
    console.table(res)
  })
}

const byDepartment =()=>{
  console.log("Displaying all Employees by Departments...\n");
  connection.query("SELECT name, first_name, last_name FROM Employees INNER JOIN Departments ON Employees.role_id = Departments.id", (err, res) =>{
    if (err) throw err;
    console.table(res)
   
  })
}

const byManager =()=>{
  console.log("Displaying all Employees by Manager...\n");
  connection.query("SELECT CONCAT( m.first_name,', ',m.last_name) AS Manager, CONCAT( e.first_name,', ',e.last_name) AS 'Employees' FROM Employees e INNER JOIN Employees m ON m.id = e.manager_id ORDER BY Manager", (err, res) =>{
    if (err) throw err;
    console.table(res)
   
  })
}
const addEmployee = ()=>{
  inquirer.prompt([
    {
      name: "first",
      type: "input",
      message: "Enter First Name"
    },
    {
      name: "last",
      type: "input",
      message: "Enter Last Name"
    },
    {
      name: "roleID",
      type: "input",
      message: "Enter role id",
      validate: (value)=>{
        if(isNaN(value) === false){
          return true;
        }
        return false;
      }
    },
    {
      name: "managerID",
      type: "input",
      message: "Enter Manager id",
      validate: (value)=>{
        if(isNaN(value) === false && value !== 0){
          return true;
        }
        return false;
      }
    }

  ]).then((answers)=>{
    console.log("add Employee info...\n");
    connection.query(
      `INSERT INTO Employees SET ?`,
      { 
        first_name: answers.first,
        last_name: answers.last,
        role_id: answers.roleID,
        manager_id: answers.managerID
      },
      (err) => {
        if (err) throw err;
      start();
      }
    );
  });
};

const addManager = ()=>{
  inquirer.prompt([
    {
      name: "first",
      type: "input",
      message: "Enter First Name"
    },
    {
      name: "last",
      type: "input",
      message: "Enter Last Name"
    }
  ]).then((answers)=>{
    console.log("add Manager info...\n");
    connection.query(
      `INSERT INTO Employees SET ?`,
      { 
        first_name: answers.first,
        last_name: answers.last,
        role_id: 1,
      },
      (err) => {
        if (err) throw err;
      start();
      }
    );
  });
};

const addRole = ()=>{
  inquirer.prompt([
    {
      name: "Title",
      type: "input",
      message: "Enter Title"
    },
    {
      name: "Salary",
      type: "input",
      message: "Enter Salary"
    },
    {
      name: "Department",
      type: "input",
      message: "Enter Department id"
    }
  ]).then((answers)=>{
    
    console.log("adding Role...\n");
    connection.query(
      `INSERT INTO Roles SET ?`,
      { 
        title: answers.Title,
        salary: answers.Salary,
        department_id: answers.Department,
      },
      (err) => {
        if (err) throw err;
      start();
      }
    );
  });
};

const addDepartment = ()=>{
  inquirer.prompt([
    {
      name: "Department",
      type: "input",
      message: "Enter Department Name"
    }

  ]).then((answers)=>{
    console.log("adding New Department...\n");
    console.log(answers.Department)
    connection.query(
      `INSERT INTO Departments SET ?`,
      { 
        name: answers.Department,
      },
      (err) => {
        if (err) throw err;
      start();
      }
    );
  });
};


const removeEmployee = ()=>{
  inquirer.prompt([
    {
      name: "id",
      type: "input",
      message: "Enter id of terminated employee"
    }
  ]).then((answers)=>{
    console.log("Delelting employee...\n");
    connection.query("DELETE FROM Employees WHERE id = ?",
    [answers.id],
      (err) => {
        if (err) throw err;
      start();
      }
    );
  });
};

connection.connect(err => {
  if (err) throw err;
  start();
});

function start(){
  inquirer.prompt( [
    {
        name: "mainmenu",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View all employees by department",
            "View all employees by manager",
            "Add Employee",
            "Add Manager",
            "Add Role",
            "Add Department",
            "Remove employee",
            "Update employee role",
            "Update employee manager",
            "EXIT"
        ]
    }
  ]).then((answers)=>{
    switch(answers.mainmenu){
      case "View All Employees":{
        allEmployees();
        break;
      }
      case "View all employees by department":{
        byDepartment();
        break;
      }
      case "View all employees by manager":{
        byManager();
        break;
      }
      case "Add Employee":{
        addEmployee();
        break;
      }
      case "Add Manager":{
        addManager();
        break;
      }
      case "Add Role":{
        addRole();
        break;
      }
      case "Add Department":{
        addDepartment();
        break;
      }
      case "Remove employee":{
        removeEmployee();
        break;
      }
      case "Update employee role":{
        // updateEmployee();
        break;
      }
      case "Update employee manager":{
        // updateManager();
        break;
      }
      case "EXIT":{
        connection.end();
        break;
      }
    }
  })
}


// departments: Sales, Engineering, Finance, Legal, Management'
