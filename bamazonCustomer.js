var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var fs = require("fs");

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

// Pull data from CSV file
// fs.readFile("productData.csv", "utf8", function(error, data) {

//   // We will then print the contents of data
//   // console.log(data);

//   // Then split it by commas (to make it more readable)
//   var dataArr = data.split("\r\n");
//   // We will then re-display the content as an array for later use.
//   // console.log(dataArr);
//   var item1 = (dataArr[0].split(","));
//   console.log(item1);

// });


// display items from database 
var table = new Table({
    head: ['ID', 'Product', 'Department', 'Price', 'Stock'], 
    colWidths: [5, 30, 30, 30, 10]
});

// table.push(
//     [1, "hat", "sports", 5.66, 5],
//     [2, "sandals", "men", 10.66, 25]
// );

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


var displayItems = function(){
	console.log(table.toString());
	chooseByID();	
};


var chooseByID = function(){
	inquirer.prompt([{
	name: "idNum",
	message: "Please type in the item number of the product you would like",
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
		// var query = "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
		var query = "SELECT * FROM bamazon_db.products";

		idNum = parseInt(answer.idNum);
		stockNum = parseInt(answer.stockNum);
		console.log(idNum);
		console.log(stockNum);

		connection.query(query, [answer.start, answer.end], function(err, res) {
			// console.log("The type of item id is:" + typeof res[0].item_id);
			// console.log("The type of idNum is:" + typeof idNum);
			for(i=0;i<res.length;i++){
				if (res[i].item_id === idNum){
				console.log("This is your item: " + res[i].item_id + res[i].product_name);
				table.push([res[i].item_id,
							res[i].product_name,
							res[i].department_name,
							res[i].price,
							res[i].stock_quantity
				]);
				displayItems();
				}
			}			
	    	// chooseByID();
	    });
	});
};

