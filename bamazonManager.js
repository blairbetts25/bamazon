var mysql = require("mysql");
var inquirer = require("inquirer");
// var table = require("table");
const { table } = require('table');
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
connection.connect(function (err) {
    if (err) throw err;
    menuOptions();
});
function menuOptions() {
    const productsSale = "View Products for Sale";
    const lowInventory = "View Low Inventory";
    const addInventory = "Add to Inventory";
    const addPrdouct = "Add New Product";
    const exit = "Exit";
    inquirer.prompt([{
        name: "menu",
        type: "list",
        message: "Which action would you like to do?",
        choices: [productsSale, lowInventory, addInventory, addPrdouct, exit]
    }]).then(function (answer) {
        switch (answer.menu) {
            case productsSale:
                productsForSale()
                break;
            case lowInventory:
                viewLowInventory()
                break;
            case addInventory:
                addToInventory()
                break;
            case addPrdouct:
                addNewProduct()
                break;
            case exit:
                connection.end()
                break;
        }
    })
}
function productsForSale() {
    console.log("test");
    console.log("\n_______");
    console.log("\n_______");
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;


        let config,
            data,
            output;

        data = [
            ['ID', 'product name', 'department name', 'price', 'stock quantity']

        ];
        for (var item = 0; item < results.length; item++) {
            data[item + 1] = [];
            var currentLine = data[item + 1];
            currentLine.push(results[item].id);
            currentLine.push(results[item].product_name);
            currentLine.push(results[item].department_name);
            currentLine.push(results[item].price);
            currentLine.push(results[item].stock_quantity);
        }

        config = {
            columns: {
                0: {
                    alignment: 'right',
                    minWidth: 10
                },
                1: {
                    alignment: 'left',
                    minWidth: 10
                },
                2: {
                    alignment: 'left',
                    minWidth: 10
                },
                3: {
                    alignment: 'right',
                    minWidth: 10
                },
                4: {
                    alignment: 'right',
                    minWidth: 10
                }
            }
        };

        output = table(data, config);

        console.log(output);


        console.log("\n Hit arrows to select next option");
        menuOptions();
    }
    )

};
function viewLowInventory() {

    connection.query("SELECT * FROM products WHERE stock_quantity <=5", function (err, results) {
        if (err) throw err;
        let config,
            data,
            output;

        data = [
            ['ID', 'product name', 'department name', 'price', 'stock quantity']

        ];
        for (var item = 0; item < results.length; item++) {
            data[item + 1] = [];
            var currentLine = data[item + 1];
            currentLine.push(results[item].id);
            currentLine.push(results[item].product_name);
            currentLine.push(results[item].department_name);
            currentLine.push(results[item].price);
            currentLine.push(results[item].stock_quantity);
        }

        config = {
            columns: {
                0: {
                    alignment: 'right',
                    minWidth: 10
                },
                1: {
                    alignment: 'left',
                    minWidth: 10
                },
                2: {
                    alignment: 'left',
                    minWidth: 10
                },
                3: {
                    alignment: 'right',
                    minWidth: 10
                },
                4: {
                    alignment: 'right',
                    minWidth: 10
                }
            }
        };
        output = table(data, config);

        console.log(output);
        console.log("\n Hit arrows to select next option");
        menuOptions();
    }
    )
};
function addToInventory() {
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
                    message: "Select the product to add inventory to.",
                    choices: choicesBuy(results)
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many units would you like to add to inventory?"
                }
            ])
            .then(function (products) {
                var data = products.buyingItem.split(":");
                addUnits(products, data, bamazonArrPrice)
            });
    }
    )
}
function choicesBuy(results) {
    var bamazonArr = [];
    for (var item = 0; item < results.length; item++) {
        bamazonArr.push(results[item].id + ":" + results[item].product_name + " " + "$" + parseFloat(results[item].price));
    }
    return bamazonArr;
};
function addUnits(products, data, bamazonArrPrice) {
    var orderPrice = bamazonArrPrice[data[0] - 1]
    connection.query("SELECT stock_quantity FROM products WHERE id =?", [data[0]],
        function (err, userOrder) {
            if (err) throw err;
            // variable that takes in the amount of unit that the user wishes to order
            var checkQuantity = parseFloat(products.quantity);
            // amount of stock is in inventory
            var stockQuantity = userOrder[0].stock_quantity

            // updating the new stock inventory
            var newQuantity = stockQuantity + checkQuantity;
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
                    console.log("Update was succesful");
                    menuOptions();
                }
            )
        }
    )
}