var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "baseBall#25",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    startBamazon();
});
function choicesBuy (results) {
    var bamazonArr = [];
    for (var item = 0; item < results.length; item++) {
        bamazonArr.push(results[item].id + ":" + results[item].product_name + " " + "$"+ parseFloat(results[item].price));
    }
    return bamazonArr;
};
function startBamazon() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "buyingItem",
                    type: "rawlist",
                    message: "Welcome to Bamazon what item would you like to buy?",
                    choices: choicesBuy(results)
                },
                {
                    name:"quantity",
                    type:"input",
                    message: "How much of this product would you like to buy?"
                }
            ])
            .then(function (products) {
                var data = products.buyingItem.split(":");
                connection.query("SELECT stock_quantity FROM products WHERE id =?",[data[0]],
                function(err,userOrder){
                    if(err) throw err;
                    var checkQuantity = parseFloat(products.quantity);
                    var stockQuantity = userOrder[0].stock_quantity
                    if(checkQuantity > stockQuantity){
                        console.log("Im Sorry we dont have enough of that product in stock")
                    }else{
                        var newQuantity = stockQuantity - checkQuantity; 
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: newQuantity
                                },
                                {
                                    id: data[0]
                                }
                            ],
                            function(error){
                                if(error) throw error;
                                console.log("Order was succesful");
                            }
                        )
                    }
                }

                )
            });
    }
    )
};
