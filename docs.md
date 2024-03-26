
# Products Endpoints

This Express routing file defines routes for handling requests related to products. The following are the endpoints and their descriptions:

## Get all products

The `/products` endpoint returns all products in the database.

## Get products by category

The `/categories` endpoint returns all products that belong to the specified categories.

## Create a new product

The `/products` POST endpoint creates a new product in the database with the provided data.

## Bulk create products

The `/bulk` POST endpoint creates multiple products in the database at once using an array of data objects.

## Update a product

The `/` PUT endpoint updates a single product in the database with the provided data.

## Delete a product

The `/` DELETE endpoint deletes a single product from the database based on its item number.

Here are some examples of how to use these endpoints:

### Get all products

Request: `http://localhost:300/product`
Response: {<br>
    "success": true,<br>
    "message": "Products fetched successfully",<br>
    "data": [<br>
        {<br>
            "id": 1,<br>
            "itemNo": "1234",<br>
            "category": "Toy",<br>
            "parameter": "Small",<br>
            "itemName": "Widget",<br>
            "quantity": 5,<br>
            "price": 10.99,<br>
            "sold": 5,<br>
            "discount": 0,<br>
            "location": "North",<br>
            "createdAt": "2024-03-25T18:11:34.142Z",<br>
            "updatedAt": "2024-03-25T18:11:34.142Z"<br>
        },<br>
        {<br>
            "id": 2,<br>
            "itemNo": "5678",<br>
            "category": "Electronics",<br>
            "parameter": "Medium",<br>
            "itemName": "Gadget",<br>
            "quantity": 3,<br>
            "price": 19.99,<br>
            "sold": 2,<br>
            "discount": 0,<br>
            "location": "South",<br>
            "createdAt": "2024-03-25T18:11:34.142Z",<br>
            "updatedAt": "2024-03-25T18:11:34.142Z"<br>
        }<br>
    ]<br>
}<br>

### Get products by category

Request: `http://localhost:300/product/categories`<br>
json object: `[{category:"Game"},{category:"Electronics"}, ...]`<br>
Response: {<br>
    "success": true,<br>
    "message": "Products fetched successfully",<br>
    "data": [<br>
        {<br>
            "id": 2,<br>
            "itemNo": "5678",<br>
            "category": "Electronics",<br>
            "parameter": "Medium",<br>
            "itemName": "Gadget",<br>
            "quantity": 3,<br>
            "price": 19.99,<br>
            "sold": 2,<br>
            "discount": 0,<br>
            "location": "South",<br>
            "createdAt": "2024-03-25T18:11:34.142Z",<br>
            "updatedAt": "2024-03-25T18:11:34.142Z"<br>
        }<br>
    ]<br>
}<br>

### Create a new product

Request: `http://localhost:300/products`<br>
input json object:{<br>
  "itemNo": "A-1234",<br>
  "itemName": "Apple iPhone 12 Pro",<br>
  "quantity": 5,<br>
  "parameter": "Grade A",<br>
  "category": "Electronics",<br>
  "location": "Main Store",<br>
  "price": 799.99,<br>
  "sold": true,<br>
  "discount": 0 <br>
}<br>

### Bulk create products

Request: `http://localhost:300/product/bulk?ids=["Electronics", "Gadgets"]&names=["Product%201","Product%202"]&prices= [15.99, 9.99]`

input json object:
[<br>{<br>
  "itemNo": "A-1234",<br>
  "itemName": "Apple iPhone 12 Pro",<br>
  "quantity": 5,<br>
  "parameter": "Grade A",<br>
  "category": "Electronics",<br>
  "location": "Main Store",<br>
  "price": 799.99,<br>
  "sold": true,<br>
  "discount": 0 <br>
},<br>{<br>
  "itemNo": "A-5678",<br>
  "itemName": "Apple iPhone 13 Pro",<br>
  "quantity": 5,<br>
  "parameter": "Grade A",<br>
  "category": "Electronics",<br>
  "location": "Main Store",<br>
  "price": 799.99,<br>
  "sold": true,<br>
  "discount": 0<br>
},<br>...]

### Update products

Request: `http://localhost:300/product`<br>
input json object: [<br>{<br>
  "itemNo": "A-1234",<br>
  "itemName": "Apple iPhone 12 Pro",<br>
  "quantity": 5,<br>
  "parameter": "Grade A",<br>
  "category": "Electronics",<br>
  "location": "Main Store",<br>
  "price": 799.99,<br>
  "sold": true,<br>
  "discount": 0 <br>
},<br>{<br>
  "itemNo": "A-5678",<br>
  "itemName": "Apple iPhone 13 Pro",<br>
  "quantity": 5,<br>
  "parameter": "Grade A",<br>
  "category": "Electronics",<br>
  "location": "Main Store",<br>
  "price": 799.99,<br>
  "sold": true,<br>
  "discount": 0<br>
},<br>...]


### Delete products

Request: `http://localhost:300/product`<br>
input json object:[<br>{<br>
    "itemNo":"A-1234",<br>
},<br>{<br>
    "itemNo":"A-5678",<br>
}
<br>]

