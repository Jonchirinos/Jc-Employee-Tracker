INSERT INTO department (name)
VALUES ("Engineering"),
        ("Sales"),
        ("Marketing");


INSERT INTO role (title, salary, department_id)
VALUES ("Senior Developer", 150000, 1),
        ("Junior Developer", 80000, 1),
        ("Head of Sales", 115000, 2),
        ("Sales Rep", 60000, 2),
        ("Marketing VP", 150000, 3),
        ("Marketing Associate", 70000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Jon", "Chirinos", 1, NULL),
        ("Kanye", "West", 2, NULL),
        ("Wayne", "Brady", 3, 2),
        ("Scott", "Brunswick", 4, 3);
