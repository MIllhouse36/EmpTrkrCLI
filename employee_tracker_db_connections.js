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
  connection.query("SELECT id, CONCAT(first_name,' ',last_name) AS Employees FROM Employees ", (err, res) =>{
    if (err) throw err;
    console.table(res);
    start();
  })
}

const byDepartment =()=>{
  console.log("Displaying all Employees by Departments...\n");
  connection.query("SELECT name AS department, CONCAT(first_name,' ',last_name) AS Employees FROM Roles INNER JOIN Departments ON Roles.department_id = Departments.id INNER JOIN Employees ON Roles.id = Employees.role_id ORDER BY department", (err, res) =>{
    if (err) throw err;
    console.table(res);
    start();
  })
}

const byRole = ()=>{
  console.log("Displaying all Roles...\n");
  connection.query("SELECT title, salary,  CONCAT(first_name,' ',last_name) AS Employees FROM Roles INNER JOIN Departments ON Roles.department_id = Departments.id INNER JOIN Employees ON Roles.id = Employees.role_id ORDER BY title", (err, res) =>{
    if (err) throw err;
    console.table(res);
    start();
  })
}

const byManager =()=>{
  console.log("Displaying all Employees by Manager...\n");
  connection.query("SELECT CONCAT( m.first_name,', ',m.last_name) AS Manager, CONCAT( e.first_name,', ',e.last_name) AS 'Employees' FROM Employees e INNER JOIN Employees m ON m.id = e.manager_id ORDER BY Manager", (err, res) =>{
    if (err) throw err;
    console.table(res)
   start();
  })
}

const addEmployee = ()=>{
  connection.query("SELECT title, Roles.id AS Role, salary, Employees.id AS EmployeeNUm, CONCAT(first_name,' ',last_name) AS Employees FROM Roles INNER JOIN Employees ON Roles.id = Employees.role_id",(err, res)=>{
    if (err) throw err;
    console.log(res)
  inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "Enter First Name"
    },
    {
      name: "last_name",
      type: "input",
      message: "Enter Last Name"
    },
    {
      name: "role_id",
      type: "rawlist",
      choices: function(){
        let choiceArray = [];
        for (let i = 0; i < res.length; i++) {
          if(res[i].title && !choiceArray.includes(`${res[i].title}`)){

            choiceArray.push(`${res[i].title}`);
          }
        }
        console.log(choiceArray);
        return choiceArray;
      }
    },
    {
      name: "manager_id",
      type: "rawlist",
      message: "Enter Manager id",
      choices: function(){
        let choiceArray = [];
        for (let i = 0; i < res.length; i++) {
          if(res[i].Employees && !choiceArray.includes(`${res[i].Employees}`)){

            choiceArray.push(`${res[i].Employees}`);
          }
        }
        console.log(choiceArray);
        return choiceArray;
      }
    }

  ]).then((answers)=>{

    for (let i = 0; i < res.length; i++) {
      if(`${res[i].title}`  === answers.role_id){
        chosenRole = res[i].Role;
      }
      if(`${res[i].Employees}`  === answers.manager_id){
        chosenEmployee = res[i].EmployeeNUm;
      }
    }
   
    console.log("add Employee info...\n");
    connection.query(
      `INSERT INTO Employees SET ?`, 
      {
        first_name: answers.first_name,
        last_name: answers.last_name,
        role_id: chosenRole,
        manager_id: chosenEmployee

      }, (err) => {
        if (err) throw err;
      start();
      }
    );
  });
  });
};

const addManager = ()=>{
  inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "Enter First Name"
    },
    {
      name: "last_name",
      type: "input",
      message: "Enter Last Name"
    }
  ]).then((answers)=>{
    console.log("add Manager info...\n");
    connection.query(
      `INSERT INTO Employees SET ?`,
      { 
        ...answers,
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
  connection.query("SELECT * FROM Departments",(err, res)=>{
    if (err) throw err;
  
  inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "Enter Title"
    },
    {
      name: "salary",
      type: "input",
      message: "Enter Salary"
    },
    {
      name: "choice",
      type: "rawlist",
      choices: function(){
        let choiceArray = [];
        for (let i = 0; i < res.length; i++) {
          if(res[i].name && !choiceArray.includes(`${res[i].name}`)){

            choiceArray.push(`${res[i].name}`);
          }
        }
        console.log(choiceArray);
        return choiceArray;
      },
      message: "Which department does this Employee belong to?"
    }
  
  ])
.then((answers)=>{
    for (let i = 0; i < res.length; i++) {
     
      if(`${res[i].name}`  === answers.choice){
        chosenDepartment = res[i].id;
      }
    }
    console.log("adding Role...\n");
    connection.query(
      `INSERT INTO Roles SET ?`, { 
        title: answers.title,
        salary: answers.salary,
        Department_id: chosenDepartment,
      }, (err) => {
        if (err) throw err;
      start();
      }
    );
  });
});
};

const addDepartment = ()=>{
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Enter Department Name"
    }

  ]).then((answers)=>{
    console.log("adding New Department...\n");
    console.log(answers.Department)
    connection.query(
      `INSERT INTO Departments SET ?`, answers, (err) => {
      if (err) throw err;
      start();
      }
    );
  });
};

const removeEmployee = ()=>{
  connection.query("SELECT * FROM Employees",(err, res)=>{
    if (err) throw err;
  inquirer.prompt([
    {
      name: "choice",
      type: "rawlist",
      choices: function(){
        let choiceArray = [];
        for (let i = 0; i < res.length; i++) {
          if(res[i].first_name && !choiceArray.includes(`${res[i].first_name} ${res[i].last_name}`)){

            choiceArray.push(`${res[i].first_name} ${res[i].last_name}`);
          }
        }
        console.log(choiceArray);
        return choiceArray;
      },
      message: "Choose employee"
    }
  ]).then((answers)=>{
    let chosenEmployee;
    for (let i = 0; i < res.length; i++) {
    if(`${res[i].first_name} ${res[i].last_name}`  === answers.choice){
      chosenEmployee = res[i].id;
    }
  }
  console.log(chosenEmployee)
  console.log("Deleting role...\n");
  connection.query("DELETE FROM Employees WHERE id = ?", [chosenEmployee],(err) => {
      if (err) throw err;
      start();
    }
    );
  });
})
};

const removeRole = ()=>{
  connection.query("SELECT * FROM Roles",(err, res)=>{
    if (err) throw err;
  inquirer.prompt([
    {
      name: "choice",
      type: "rawlist",
      choices: function(){
        let choiceArray = [];
        for (let i = 0; i < res.length; i++) {
          if(res[i].title && !choiceArray.includes(`${res[i].title}`)){
            choiceArray.push(`${res[i].title}`);
          }
        }
        return choiceArray;
      },
      message:"Which role are you Deleting?"
    },
    
  ]).then((answers)=>{
    let chosenRole;
    for (let i = 0; i < res.length; i++) {
    if(`${res[i].title}` === answers.choice){
      chosenRole = res[i].id;
    }
  }
  console.log(chosenRole)
  console.log("Deleting role...\n");
  connection.query("DELETE FROM Roles WHERE id = ?", [chosenRole],(err) => {
      if (err) throw err;
      start();
    }
    );
  });
})
};

const updateRoleDept = ()=>{
  connection.query("SELECT title, Roles.id  AS rID, Departments.id AS eID, name FROM Roles RIGHT JOIN Departments ON Roles.id = Departments.id UNION SELECT title, Roles.id  AS rID, Departments.id AS eID, name FROM Roles LEFT JOIN Departments ON Roles.id = Departments.id",(err, res)=>{
    console.log(res)
  inquirer.prompt([
    {
      name: "choice",
      type: "rawlist",
      choices: function(){
        let choiceArray = [];
        for (let i = 0; i < res.length; i++) {
          if(res[i].title && !choiceArray.includes(`${res[i].title}`)){

            choiceArray.push(`${res[i].title}`);
          }
        }
        console.log(choiceArray);
        return choiceArray;
      },
      message:"Which role are you switching?"
    },
    {
      name: "choiceE",
      type: "rawlist",
      choices: function(){
        let choiceArray = [];
        for (let i = 0; i < res.length; i++) {
          if(res[i].name && !choiceArray.includes(`${res[i].name}`)){

            choiceArray.push(`${res[i].name}`);
          }
        }
        console.log(choiceArray);
        return choiceArray;
      },
      message: "Which department does this role belong to?"
    }
  ]).then((answers)=>{
    let chosenRole;
    let chosenDepartment;
    
    for (let i = 0; i < res.length; i++) {
    if(`${res[i].title}`  === answers.choice){
      chosenRole = res[i].rID;
    }
    if(`${res[i].name}`  === answers.choiceE){
      chosenDepartment = res[i].eID;
    }
  }
  console.log({chosenRole});
  console.log({chosenDepartment});
  console.log("Updating role...\n");
  connection.query("UPDATE Roles SET ? WHERE ?",
  [{ id: chosenRole},{department_id: chosenDepartment}],
    (err) => {
      if (err) throw err;
      start();
    }
    );
  });
  if (err) throw err;
})
};

const updateEmployeeRole = ()=>{
  connection.query("SELECT title, Roles.id  AS rID, Employees.id AS eID, first_name, last_name FROM Roles RIGHT JOIN Employees ON Roles.id = Employees.role_id UNION SELECT title, Roles.id  AS rID, Employees.id AS eID, first_name, last_name FROM Roles LEFT JOIN Employees ON Roles.id = Employees.role_id",(err, res)=>{
    console.log(res)
  inquirer.prompt([
    {
      name: "choice",
      type: "rawlist",
      choices: function(){
        let choiceArray = [];
        for (let i = 0; i < res.length; i++) {
          if(res[i].title && !choiceArray.includes(`${res[i].title}`)){

            choiceArray.push(`${res[i].title}`);
          }
        }
        console.log(choiceArray);
        return choiceArray;
      },
      message:"Which role is your employee switching to?"
    },
    {
      name: "choiceE",
      type: "rawlist",
      choices: function(){
        let choiceArray = [];
        for (let i = 0; i < res.length; i++) {
          if(res[i].first_name && !choiceArray.includes(`${res[i].first_name} ${res[i].last_name}`)){

            choiceArray.push(`${res[i].first_name} ${res[i].last_name}`);
          }
        }
        console.log(choiceArray);
        return choiceArray;
      },
      message: "Choose employee"
    }
  ]).then((answers)=>{
    let chosenRole;
    let chosenEmployee;
    
    for (let i = 0; i < res.length; i++) {
    if(`${res[i].title}`  === answers.choice){
      chosenRole = res[i].rID;
    }
    if(`${res[i].first_name} ${res[i].last_name}`  === answers.choiceE){
      chosenEmployee = res[i].eID;
    }
  }
  console.log({chosenRole});
  console.log({chosenEmployee});
  console.log("Updating role...\n");
  connection.query("UPDATE Employees SET ? WHERE ?",
  [{ role_id: chosenRole},{id: chosenEmployee}],
    (err,res) => {
      if (err) throw err;
      start();
    }
    );
  });
  if (err) throw err;
})
};

const updateManager = ()=>{
  connection.query("SELECT * FROM Employees",(err, res)=>{
    // console.log(res);
  inquirer.prompt([
    {
      name: "choice",
      type: "rawlist",
      choices: function(){
        let choiceArray = [];
        for (let i = 0; i < res.length; i++) {
          choiceArray.push(`${res[i].first_name} ${res[i].last_name}`);
        }
        console.log(choiceArray);
        return choiceArray;
      },
      message:"Which manager is your employee switching to?"
    },
    {
      name: "choiceE",
      type: "rawlist",
      choices: function(){
        let choiceArray = [];
        for (let i = 0; i < res.length; i++) {
          choiceArray.push(`${res[i].first_name} ${res[i].last_name}`);
        }
        console.log(choiceArray);
        return choiceArray;
      },
      message: "Enter id of the Employee you would like to update to"
    }
  ]).then((answers)=>{
    let chosenManager;
    let chosenEmployee;
    
    for (let i = 0; i < res.length; i++) {
    if(`${res[i].first_name} ${res[i].last_name}`  === answers.choice){
      chosenManager = res[i].id;
    }
    if(`${res[i].first_name} ${res[i].last_name}`  === answers.choiceE){
      chosenEmployee = res[i].id;
    }
  }
  console.log("Updating Manager...\n");
  connection.query("UPDATE Employees SET ? WHERE ?",
  [{ manager_id: chosenManager},{id: chosenEmployee}],
    (err,res) => {
      if (err) throw err;
      start();
    }
  );
  });
  if (err) throw err;
})

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
            "View all employees by role",
            "View all employees by manager",
            "Add Employee",
            "Add Manager",
            "Add Role",
            "Add Department",
            "Remove employee",
            "Remove role",
            "Remove department",
            "Update role department",
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
      case "View all employees by role":{
        byRole();
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
      case "Remove role":{
        removeRole();
        break;
      }
      case "Remove department":{
        removeDepartment();
        break;
      }
      
      case "Update role department":{
        updateRoleDept();
        break;
      }
      case "Update employee role":{
        updateEmployeeRole();
        break;
      }
      case "Update employee manager":{
        updateManager();
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
