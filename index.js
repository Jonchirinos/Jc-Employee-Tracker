const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
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
                    { name: "View all Departments", value: "view_dep" },
                    { name: "View all Roles", value: "view_role" },
                    { name: "Add an Employee", value: "add_employees" },
                    { name: "Add a Department", value: "add_department" },
                    { name: "Add a Role", value: "add_role" },
                    { name: "Change Employee Role", value: "change_role" },
                    { name: "Delete Employee", value: "delete_emp" },
                    { name: "Delete Department", value: "delete_dep" },
                    { name: "Delete Role", value: "delete_role" },
                    { name: "Quit", value: "quit" },
                ],
            },
        ])
        .then((answers) => {
            if (answers.questions === "view_emp") {
                viewEmployees();
            } else if (answers.questions === "view_dep") {
                viewDepartments();
            } else if (answers.questions === "view_role") {
                viewRoles();
            } else if (answers.questions === "add_department") {
                addDepartment();
            } else if (answers.questions === "add_employees") {
                addEmployee();
            } else if (answers.questions === "add_role") {
                addRole();
            } else if (answers.questions === "change_role") {
                changeRole();
            } else if (answers.questions === "delete_emp") {
                deleteEmployee();
            } else if (answers.questions === "delete_dep") {
                deleteDepartment();
            } else if (answers.questions === "delete_role") {
                deleteRole();
            } else if (answers.questions === "quit") {
                process.exit(0);
            }
        });
}

function viewDepartments() {
    const sql = "SELECT * FROM department";
    db.query(sql, (err, rows) => {
        console.table(rows);
        console.log(err);
        init();
    });
}

function viewEmployees() {
    db.query("SELECT * FROM employee", function (err, results) {
        console.table(results);
        init();
    });
}

function viewRoles() {
    db.query("SELECT * FROM role", function (err, results) {
        console.table(results);
        init();
    });
}

function addEmployee() {
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
            db.query("SELECT * FROM role", function (err, results) {
                console.log("results", results);
                const roles = results.map(({ id, title }) => ({
                    name: title,
                    value: id,
                }));
                console.log(roles);
                const managerInfo = [
                    {
                        type: "confirm",
                        name: "manager",
                        message: "Is the Employee a Manager?",
                    },
                    {
                        type: "list",
                        name: "id",
                        message: "What is the employee's role?",
                        choices: roles,
                    },
                ];
                inquirer.prompt(managerInfo).then((role) => {
                    console.log(role);
                    if (role.manager === true) {
                        inquirer.prompt({
                            type: "list",
                            name: "id",
                            message: "What is the employee's role?",
                            choices: roles,
                        });
                        db.query("INSERT INTO employee(first_name, last_name, role_id) values(?,?,?)", [answers.firstName, answers.lastName, role.id], function (err, row) {
                            if (err) throw err;
                        });
                        db.query("SELECT * FROM employee");
                        init();
                    } else {
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
                    }
                });
            });
        });
}

function addRole() {
    const questions = [
        {
            type: "input",
            name: "newRole",
            message: "Enter New Role",
        },
        {
            type: "number",
            name: "roleSalary",
            message: "What is the salary for the newly created role?",
        },
    ];
    inquirer.prompt(questions).then((answers) => {
        db.query("SELECT * FROM department", function (err, res) {
            const departments = res.map(({ id, name }) => ({
                name: name,
                value: id,
            }));
            inquirer
                .prompt({
                    type: "list",
                    name: "id",
                    message: "Assign Role to designated Department Please",
                    choices: departments,
                })
                .then((department) => {
                    db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answers.newRole, answers.roleSalary, department.id], function (err, row) {
                        if (err) throw err;
                    });
                    db.query("SELECT * FROM role", (err, res) => {
                        console.table(res);
                        init();
                    });
                });
            if (err) throw err;
        });
    });
}

function changeRole() {
    db.query("SELECT * FROM employee", function (err, results) {
        console.log("results", results);
        const employees = results.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
        }));
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "What employee do you want to update?",
                    choices: employees,
                },
            ])
            .then((employee) => {
                console.log("employee", employee);
                db.query("SELECT * FROM role", function (err, results) {
                    const roles = results.map(({ id, title }) => ({
                        name: title,
                        value: id,
                    }));
                    inquirer
                        .prompt({
                            type: "list",
                            name: "role",
                            message: "What is the employee's new role?",
                            choices: roles,
                        })
                        .then((answers) => {
                            console.log("answers", answers);
                            db.query("UPDATE employee SET role_id = ? WHERE id = ?", [answers.role, employee.employee]);
                            init();
                        });
                });
            });
    });
}

function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "addDepartment",
            message: "What is the name of the new Department?",
        })
        .then((answer) => {
            db.query("INSERT INTO department (name) VALUES (?)", [answer.addDepartment], function (err, row) {
                if (err) throw err;
            });
            db.query("SELECT * FROM department", (err, res) => {
                console.table(res);
                init();
            });
        });
}

function deleteEmployee() {
    db.query("SELECT * FROM employee", function (err, results) {
        console.log("results", results);
        const employees = results.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
        }));
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "id",
                    message: "What Employee do you want to Delete?",
                    choices: employees,
                },
            ])
            .then((employee) => {
                console.log("employee", employee);
                db.query("DELETE FROM employee WHERE id = ?", employee.id, function (err, results) {
                    if (err) throw err;
                    console.log("Employee has been terminated");
                });
                db.query("SELECT * FROM employee", (err, res) => {
                    init();
                });
            });
    });
}

function deleteDepartment() {
    db.query("SELECT * FROM department", function (err, results) {
        const departments = results.map(({ id, name }) => ({
            name: name,
            value: id,
        }));
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "id",
                    message: "What Department do you want to terminate?",
                    choices: departments,
                },
            ])
            .then((department) => {
                console.log("department", department);
                db.query("DELETE FROM department WHERE id = ?", department.id, function (err, results) {
                    if (err) throw err;
                    console.log("Department has been terminated");
                });
                db.query("SELECT * FROM department", (err, res) => {
                    init();
                });
            });
    });
}

function deleteRole() {
    db.query("SELECT * FROM role", function (err, results) {
        console.log("results", results);
        const roles = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "id",
                    message: "What Role do you want to terminate?",
                    choices: roles,
                },
            ])
            .then((role) => {
                console.log("role", role);
                db.query("DELETE FROM role WHERE id = ?", role.id, function (err, results) {
                    if (err) throw err;
                    console.log("Role has been terminated");
                });
                db.query("SELECT * FROM role", (err, results) => {
                    init();
                });
            });
    });
}

init();
