const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");
require("dotenv").config();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Illinois14",
    database: "employee_db",
});

db.connect();

function init() {
    // runs inquirer npm
    inquirer
        // list of questions for the user to answer
        .prompt([
            {
                name: "questions",
                type: "list",
                message: "What would you like to do?",
                choices: [
                    { name: "View all Employees", value: "view_emp" },
                    { name: "View all Departments", Value: "view_dep" },
                    { name: "View all Roles", value: "view_role" },
                    { name: "Add an Employee", value: "add_employees" },
                    { name: "Quit", value: "quit" },
                ],
            },
        ])
        .then((answers) => {
            if (answers.questions === "view_emp") {
                viewEmployees();
            } else if (answers.questions === "view_dep") {
                viewDepartments();
            } else if (answers.questions === "add_employees") {
                createEmployee();
            } else if (answers.questions === "view_role") {
                viewRoles();
            } else if (answers.questions === "quit") {
                connection.end();
            }
        });
}

function viewDepartments() {
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, rows) => {
        console.table(rows);
    });
}

function viewEmployees() {
    db.query("SELECT * FROM employee", function (err, results) {
        console.table(results);
        init();
    });
}

function viewRoles() {
    db.query("SELECT * FROM roles", function (err, results) {
        console.table(results);
    });
}

function createEmployee() {
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What's the employee's first name?",
            },
            {
                name: "lastName",
                type: "input",
                message: "What's the employee's last name?",
            },
        ])
        .then((answers) => {
            db.query("SELECT * FROM roles", function (results, err) {
                const roles = results.map(({ id, title }) => ({
                    name: title,
                    value: id,
                }));
                console.log(roles);
                inquirer
                    .prompt({
                        type: "list",
                        name: "id",
                        message: "What is the employee's role?",
                        choices: roles,
                    })
                    .then((role) => {
                        db.query("SELECT * FROM employee where manager_id is null", function (err, results) {
                            const managers = results.map(({ id, last_name }) => ({
                                name: last_name,
                                value: id,
                            }));
                            inquirer
                                .prompt({
                                    type: "list",
                                    name: "id",
                                    message: "What is the manager's name?",
                                    choices: managers,
                                })
                                .then((manager) => {
                                    db.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) values(?,?,?,?)", [answers.firstName, answers.lastName, role.id, manager.id]);
                                    init();
                                });
                        });
                    });
            });
        });
}

// function createDepartment() {
//     inquirer
//     .prompt([
//         {
//             name: "addDepartment",
//             type: "input",
//             message: "Would you like to add a new Department?",
//         })
//         .then(function (answer) {
//             db.query(`INSERT INTO department Set ?` {
//                 name: answer.addDepartment,
//             })
//         })
// }

//

init();
