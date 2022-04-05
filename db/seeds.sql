INSERT INTO department (id, name)
VALUES (1, "Math"),
       (2, "CS"),
       (3, "Chemistry"),
       (4, "Marketing"),
       (5, "Biology");

INSERT INTO role (id, title, salary, department_id)   
VALUES (1, "Teacher", 140000, 2),
       (2, "Architect", 180000, 3),
       (3, "Grad PHD", 70000, 4),
       (4, "CFO", 2600000, 4),
       (5, "TA", 60000, 5),
       (6, "Recruiter", 85000, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Mark", "Willis", 2, NULL),
       (2, "Chris", "Brown", 5, NULL),
       (3, "Tyler", "Blevins", 4, 1),
       (4, "Timo", "Werner", 3, 2),
       (5, "Jose", "Mourinho", 1, 3),
       (6, "Tammy", "Abraham", 6, 1);

       

