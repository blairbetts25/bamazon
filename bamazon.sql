Drop DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
    id int not null auto_increment,
    product_name VARCHAR(200) not null,
    department_name VARCHAR(200) not null,
    price int(10) not null,
    stock_quantity int(15) not null,
    PRIMARY KEY (id) 
);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Nike Dry Fit Shirts", "Clothing", 19.99, 50000);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Under Armour Dry Fit Shirts", "Clothing", 29.99, 60000);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Wrangler Jeans", "Clothing", 39.99, 100000);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Taguer Fitted Hats", "Clothing", 9.99, 60000);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Carolina Hurricanes Season Tickets", "Sports", 229.99, 600);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Carolina Panthers Season Tickets", "Sports", 399.99, 200);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Durham Bulls Season Tickets", "Sports", 99.99, 1000);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Iphone X", "Electronics", 999.99, 20);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Galaxy Note 10", "Electronics", 1100.99, 10);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("The Complete Star Wars Saga", "Entertainment", 109.99, 500);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("All Seasons Of Game Of Thrones", "Entertainment", 99.99, 400);

SELECT * FROM products;