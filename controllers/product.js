import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// Read operation - GET /products
router.get("/", async (req, res) => {
  try {
    const lowStockProducts = [];
    const outStockProducts = [];
    const productModel = await Product();
    const products = await productModel.findAll()

    products.map((val) => {
	if (val.dataValues.quantity < 10 && val.dataValues.quantity !== 0) {
		lowStockProducts.push(val);
	}

	 if ( val.dataValues.quantity === 0 ) {
		outStockProducts.push(val);
	}
    })
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      totProducts: products,
      lowProducts: lowStockProducts,
      outStProducts: outStockProducts 
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create operation - POST /products
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const productData = {
      itemNo: data.itemNo,
      itemName: data.itemName,
      quantity: data.quantity,
      parameter: data.parameter,
      category: data.category,
      location: data.location,
      price: data.price,
      sold: data.sold,
      discount: data.discount || 0, // Set discount to 0 if not provided
    };
    const productModel = await Product();
    const product = await productModel.create(productData);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// bulk create operation - POST /products/bulk

router.post("/bulk", async (req, res) => {
  try {
    const datas = req.body.data;
    const productModel = await Product();
    const productDatas = datas.map(data => {
      return {
        itemNo: data.itemNo,
        itemName: data.itemName,
        quantity: data.quantity,
        parameter: data.parameter,
        category: data.category,
        price: data.price,
        sold: data.sold,
        location: data.location,
        discount: data.discount || 0, // Set discount to 0 if not provided
      };
    });
    productModel.bulkCreate(productDatas);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        status: "success",
        message: "Products created successfully",
        noOfProducts: productDatas.length,
      },
    });
   }
  catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Update operation - PUT /products
router.put("/", async (req, res) => {
  try {
    const productModel = await Product();
    const updateItems = req.body.arr;
	console.log(updateItems)
    // Array to store promises for updating each item
    const updatePromises = updateItems.map(async (item) => {
      const { id, quantity, price } = item;
      const [updatedRows] = await productModel.update({ quantity, price }, {
        where: { id: id }, // Use itemNo in the where clause
      });
      return { id, updatedRows };
    });

    // Wait for all update operations to complete
    const results = await Promise.all(updatePromises);

    // Check if any items were updated successfully
    const updatedProducts = results.filter(result => result.updatedRows === 1);

    if (updatedProducts.length > 0) {
      res.status(200).json({
        success: true,
        message: "Products updated successfully",
        updatedProducts: updatedProducts.map(result => result.id),
      });
    } else {
      res.status(404).json({ error: "No products updated" });
    }
  } catch (error) {
    console.error("Error updating products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Delete operation - DELETE /products
router.delete("/", async (req, res) => {
  try {
    const productModel = await Product();
    const itemsToDelete = req.body; // JSON array of items to delete
    console.log(req.body);  
    const deletedProducts = await productModel.destroy({
      where: { id: req.body.arr },
    });
    if (deletedProducts > 0) {
      res.status(200).json({ success: true, message: "Products deleted successfully" });
    } else {
      res.status(404).json({ error: "Products not found" });
    }
  } catch (error) {
    console.error("Error deleting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
