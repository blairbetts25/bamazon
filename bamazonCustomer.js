var mysql = require("mysql");
var inquirer = require("inquirer");
// links to database
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
// connects to the database to be able to pull in information
connection.connect(function (err) {
    if (err) throw err;
    startBamazon();
});
// function that loops through the list on sql and pushes into an array to be able to display the rawlist in the funciton startBamazon()
function choicesBuy(results) {
    var bamazonArr = [];
    for (var item = 0; item < results.length; item++) {
        bamazonArr.push(results[item].id + ":" + results[item].product_name + " " + "$" + parseFloat(results[item].price));
    }
    return bamazonArr;
};
// funciton to see if the user would like to buy more products
function buyMoreProducts() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "buymoreproducts",
            message: "Do you want to do a new order?"
        }]).then(function (more) {
            if (more.buymoreproducts) {
                startBamazon();
            } else {
                connection.end();
            }
        })
}
// funciton that checks if there are enough units in stock for the purchase to go through
function haveEnoughUnits(products, data,bamazonArrPrice) {
    var orderPrice = bamazonArrPrice[data[0]-1]
    connection.query("SELECT stock_quantity FROM products WHERE id =?", [data[0]],
        function (err, userOrder) {
            if (err) throw err;
            // variable that takes in the amount of unit that the user wishes to order
            var checkQuantity = parseFloat(products.quantity);
            // amount of stock is in inventory
            var stockQuantity = userOrder[0].stock_quantity
            if (checkQuantity > stockQuantity) {
                console.log("Im Sorry we dont have enough of that product in stock")
                console.log("We only have " + stockQuantity + " units avalible.")
                inquirer.prompt([
                    {
                        type: "confirm",
                        name: "buymoreunits",
                        message: "Do you want to buy less units?"
                    }]).then(function (answer) {
                        if (answer.buymoreunits) {
                            inquirer
                                .prompt([
                                    {
                                        name: "quantity",
                                        type: "input",
                                        message: "How much of this product would you like to buy?"
                                    }
                                ])
                                .then(function (products) {
                                    haveEnoughUnits(products, data)
                                })
                        } else {
                            buyMoreProducts()
                        }
                    })
            } else {
                // updating the new stock inventory
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
                    function (error) {
                        if (error) throw error;
                        console.log("Order was succesful");
                        console.log("Your order total is $" + orderPrice*checkQuantity);
                        buyMoreProducts();
                    }
                )
            }
        }

    )
}
// funciton that diplays the products to be boought as well as the prompt asking how many units
function startBamazon() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        var bamazonArrPrice = [];
        for (var item = 0; item < results.length; item++) {
            bamazonArrPrice.push(parseFloat(results[item].price));
        }
        inquirer
            .prompt([
                {
                    name: "buyingItem",
                    type: "rawlist",
                    message: "Welcome to Bamazon what item would you like to buy?",
                    choices: choicesBuy(results)
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How much of this product would you like to buy?"
                }
            ])
            .then(function (products) {
                var data = products.buyingItem.split(":");
                haveEnoughUnits(products, data,bamazonArrPrice)
            });
    }
    )
};
