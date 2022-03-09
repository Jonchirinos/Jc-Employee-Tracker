const mysql = require("mysql2");
const inquirer = require("inquirer");

require("dotenv").config();

const db = mysql.createConnection(
    {
        host: localhost,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
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
                    {
                        name: "view all departments",
                        choices: "view-dep",
                    },
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
