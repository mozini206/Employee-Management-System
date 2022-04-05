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