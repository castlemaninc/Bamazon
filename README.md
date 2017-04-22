# HW - Bamazon (Node.js & MySQL)
An Amazon-like storefront using MySQL 

## A table of products will be displayed in the CLI and the customer will be prompted to choose a product which he/she would like to purchase. If there is sufficient stock,
the database will be updated. If there is not enough stock the customer will be prompted again. 

## Requirements
- Create an MySQL Database, a table, and 5 named columns
- Populate the table with approximately 10 items 
- Create a Node.js application which does the following: 
	1. display the data in the CLI  
	2. Prompts users with 2 questions
	3. Use the user's answers to query the SQL database and make comparisons
	4. Update data in the SQL database


## Technologies Used
- MySQL Workbench
- Node.js
- NPM Packages (SQL, Inquirer, and CLI-table)

## Code Explanation

Three NPM packages are referenced by variables. 
A connection is made to the MySQL database. 
After a connection is made, function is invoked which populates the "CLI-table" with data from the SQL database. 
Functions are called synchronously in order to: 
1. Fill the CLI table with data
2. Display the table in the CLI
3. Prompt the user to make some choices 
4. Update the Database 



