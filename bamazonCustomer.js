var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Your username
	user: "root",

	// Your password
	password: "mysql99",
	database: "bamazon_db"
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	fillTable();	
});


// Creates a CLI table for Bamazon products with column headings
var table = new Table({
    head: ['ID', 'Product', 'Department', 'Price', 'Stock'], 
    colWidths: [5, 30, 30, 30, 10]
});

// A function that fills the CLI table with MySQL data
var fillTable = function(){

	var query = "SELECT * FROM bamazon_db.products";

	connection.query(query, function(err, res) {
		// console.log("The type of item id is:" + typeof res[0].item_id);
		// console.log("The type of idNum is:" + typeof idNum);
		for(i=0;i<res.length;i++){
			table.push([res[i].item_id,
						res[i].product_name,
						res[i].department_name,
						res[i].price,
						res[i].stock_quantity
			]);
			
		}			
    	displayItems();
    });

}

// Displays the CLI table 
var displayItems = function(){
	console.log(table.toString());
	chooseByID();	
};

// Prompts customer to choose an item by ID number and asks for the quantity the customer would like to buy
// Then it checks if the store has enough of the product to meet the customer's request.
var chooseByID = function(){
	inquirer.prompt([{
	name: "idNum",
	message: "Please type in the item number of the product you would like to purchase.",
	validate: function(value) {
		if (isNaN(value) === false) {
			return true;
		}
		return false;
		}
	},{
	name: "stockNum",
	message: "How many would you like to buy?",
	validate: function(value) {
	   	if (isNaN(value) === false) {
	   		return true;
	   	}
	   	return false;
	   	}
	}]).then(function(answer){
		
		

		idNum = parseInt(answer.idNum);
		stockNum = parseInt(answer.stockNum);
		// console.log("This is idNum " + idNum);
		// console.log("This is stockNum " + stockNum);

		var query = "SELECT * FROM products WHERE item_id = ?";

		connection.query(query, idNum, function(err, res) {
			// console.log("The type of item id is:" + typeof res[0].item_id);
			// console.log("The type of idNum is:" + typeof idNum);
			if (err){
				throw err;
			} else {
				// console.log(res);
				for (i=0; i<res.length;i++){
					// console.log("There are " + res[i].stock_quantity + " items in stock.");
					// console.log(stockNum < res[i].stock_quantity);
					if (stockNum > res[i].stock_quantity){
						console.log("Insufficient Stock!");
						chooseByID();
					} else if (stockNum <= res[i].stock_quantity) {
						console.log("Thank you for your purchase.");
						// update the SQL database to reflect the remaining quantity.
						// Once the update goes through, show the customer the total cost of their purchase.
						var remainder = res[i].stock_quantity - stockNum;
						updateStock(idNum,remainder);
						chooseByID();
					}
				}
				
				
			}
			

	    });
	});
};

var updateStock = function(itemID,remainder){
	// console.log("This is the updateStock function. This is what is passed in " + itemID + "," + remainder);
	
	connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: remainder}, {item_id: itemID}], function(err, res) {});
		
}