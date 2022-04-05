const mysql = require('mysql2');
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('./db/connection');
let init = {
	viewEmployees: "View All Employees",
	addEmployee: "Add Employee",
	updateEmployeeRole: "Update Employee Role",
	viewRoles: "View All Roles",
	addRole: "Add Role",
	viewDepartments: "View All Departments",
	addDepartment: "Add Department",
	quit: "Quit"
}
initialize();
async function initialize() {
	const answers = await inquirer.prompt([{
		name: "init",
		type: "list",
		message: "What would you like to do?",
		choices: [
			init.viewEmployees,
			init.addEmployee,
			init.updateEmployeeRole,
			init.viewRoles,
			init.addRole,
			init.viewDepartments,
			init.addDepartment,
			init.quit
		]
	}]).then((answers) => {
		switch (answers.init) {
			case init.viewDepartments:
				viewAllDepartments();
				break;
			case init.viewEmployees:
				viewAllEmployees();
				break;
			case init.viewRoles:
				viewAllRoles();
				break;
			case init.addDepartment:
				addDepartment();
				break;
			case init.addRole:
				addNewRole();
				break;
			case init.addEmployee:
				addNewEmployee();
				break;
			case init.updateEmployeeRole:
				updateEmployeeRole();
				break;
			case init.quit:
				connection.end();
				break;
		}
	})
}

function viewAllDepartments(answersDept) {
	db.query('SELECT * FROM department', function(err, results) {
		console.log('\nALL DEPARTMENTS\n')
		console.table(results);
		initialize();
	});
}

function viewAllEmployees(answers) {
	const query = `SELECT employee.id, employee.first_name AS "first name", employee.last_name AS "last name", role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager 
    FROM employee
    LEFT JOIN employee manager ON manager.id = employee.manager_id
    INNER JOIN role ON role.id=employee.role_id
    INNER JOIN department ON (department.id = role.department_id);
    `;
	db.query(query, (err, results) => {
		console.log('\nALL EMPLOYEES\n')
		console.table(results);
		initialize();
	})
}

function viewAllRoles(answers) {
	db.query('SELECT * FROM role', function(err, results) {
		console.log('\nALL ROLES\n')
		console.table(results);
		initialize();
	});
}

function addDepartment(answersDept) {
	db.query('SELECT * FROM department', async (err, deptData) => {
		const departments = await deptData.map(({
			id,
			name
		}) => ({
			value: id,
			name: name
		}));
		const answersDept = await inquirer.prompt([{
			type: "input",
			name: "name",
			message: "What is the name of the department?",
		}, {
			type: "input",
			name: "id",
			message: "Enter the department id.",
		}]).then((answersDept) => {
			departments.value = answersDept.id;
			departments.name = answersDept.name;
			db.query(`INSERT INTO department (id, name) VALUES (${departments.value}, "${departments.name}");`, function(err, results) {
				console.log("\nYou have added", departments.name, "to the database.\n");
				viewAllDepartments();
			});
		})
	})
}

function addNewRole() {
	db.query('SELECT * FROM department', async (err, deptData) => {
		const departmentArray = await deptData.map(({
			id,
			name
		}) => ({
			value: id,
			name: name
		}));
		const answersRole = inquirer.prompt([{
			type: "input",
			name: "title",
			message: "What is the name of the role?",
		}, {
			type: "input",
			name: "salary",
			message: "What is the salary of the role?",
		}, {
			type: "list",
			name: "department_id",
			message: "Which department does the role belong to?",
			choices: departmentArray,
		}, {
			type: "input",
			name: "role_id",
			message: "Provide the role ID.",
		}]).then((answersRole) => {
			const roles = {
				title: answersRole.title,
				salary: answersRole.salary,
				department_id: answersRole.department_id,
				id: answersRole.role_id
			}
			db.query(`INSERT INTO role (id, title, salary, department_id) VALUES (${roles.id}, "${roles.title}", ${roles.salary}, ${roles.department_id});`, function(err, results) {
				if (err) {
					throw err;
				}
				console.log("\nYou have added a new role to the database:", roles.title);
				viewAllRoles();
			});
		})
	})
}

function addNewEmployee() {
	db.query('SELECT * FROM role', (err, roleData) => {
		const roles = roleData.map(({
			id,
			title
		}) => ({
			value: id,
			name: title
		}));
		db.query('SELECT * FROM employee', (err, employeeData) => {
			const employees = employeeData.map(employeeData => `${employeeData.first_name} ${employeeData.last_name}`);
			employees.push('None');
			const answers = inquirer.prompt([{
				type: "input",
				name: "first_name",
				message: "What is the employee's first name?",
			}, {
				type: "input",
				name: "last_name",
				message: "What is the employee's last name?",
			}, {
				type: "list",
				name: "role_id",
				message: "What is the employee's role?",
				choices: roles,
			}, {
				type: "list",
				name: "manager",
				message: "Who is the employee's manager?",
				choices: employees,
			}, {
				type: "input",
				name: "id",
				message: "What is the employee ID?",
			}]).then((answers) => {
				let managerID;
				let managerName;
				if (answers.manager === "none") {
					managerID = null;
				} else {
					for (const data of employeeData) {
						data.fullName = `${data.first_name} ${data.last_name}`;
						if (data.fullName === answers.manager) {
							managerID = data.id;
							managerName = data.fullName;
						}
					}
				}
				const employee = {
					first_name: answers.first_name,
					last_name: answers.last_name,
					role_id: answers.role_id,
					id: answers.id
				}
				db.query('INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (?,?,?,?,?)', [employee.id, employee.first_name, employee.last_name, employee.role_id, managerID], function(err, results) {
					if (err) {
						throw err;
					}
					console.log("\nYou have added", employee.first_name, employee.last_name, "to the employee's database.");
					viewAllEmployees();
				});
			})
		})
	})
}

function updateEmployeeRole() {
	db.query('SELECT * FROM role', async (err, roleData) => {
		const selectRole = await roleData.map(({
			id,
			title
		}) => ({
			value: id,
			name: title
		}));
		db.query('SELECT * FROM employee', async (err, employeeData) => {
			const selectEmployee = await employeeData.map(employeeData => {
				return {
					name: `${employeeData.first_name} ${employeeData.last_name}`,
					value: employeeData.id
				}
			})
			const answers = inquirer.prompt([{
				type: "list",
				name: "employee",
				message: "Select employee to update role.",
				choices: selectEmployee
			}, {
				type: "list",
				name: "role_id",
				message: "What is the employee's new role?",
				choices: selectRole,
			}]).then((answers) => {
				const employee = {
					id: answers.employee,
					role_id: answers.role_id
				}
				db.query(`UPDATE employee SET role_id = ${employee.role_id} WHERE id = ${employee.id}`, function(err, results) {
					if (err) {
						throw err;
					}
					console.log("\nSuccess! You have updated the employee role.");
					viewAllEmployees();
				});
			})
		})
	})
}