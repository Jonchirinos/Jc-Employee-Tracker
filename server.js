const mysql = require("mysql2");
const inquirer = require("inquirer");

require("dotenv").config();

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Illinois14",
        database: "employee_db",
    },
    console.log("you are connected")
);

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
                    { name: "view all employees", value: "view-emp" },
                    { name: "view all departments", Value: "view-dep" },
                    { name: "view all roles", value: "view-role" },
                    { name: "quit", value: "quit" },
                ],
            },
        ])
        .then((answers) => {
            if (answers.questions === "view-emp") {
            } else if (answers.questions === "view-dep") {
                viewDepartments();
            }
        });
}

function viewDepartments() {
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, rows) => {
        console.table(rows);
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
            db.query("SELECT * FROM roles", function (err, results) {
                const roles = results.map(({ id, title }) => ({
                    name: title,
                    value: id,
                }));
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
