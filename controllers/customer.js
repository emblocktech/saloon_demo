import express from "express";
import getUserModel from "../models/customer.js";
import ExcelJS from "exceljs"

const router = express.Router();

// Read operation - GET /customers
router.get("/", async (req, res) => {
  try {
    const User = await getUserModel();
    const customers = await User.findAll();
    res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/exsist/:number", async (req, res) => {
	let number = req.params.number;
	try {
		const User = await getUserModel();
		const customer = await User.findOne({ where: { phonenumber: number } });
		console.log(customer)
		
		if (!customer) {
			res.status(200).json({ exist: false });
		} else {
			res.status(200).json({ exist: true, data: customer });
		}
		
	} catch (err) {
	 	console.error("Error fetching customers:", err);
    	res.status(500).json({ error: "Internal server error" });
	}
})

router.get("/download/report", async (req, res) => {
  try {
    const User = await getUserModel();
    const customers = await User.findAll();
    
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reports');
    
	const customerDetails = []
    
    customers.map((val, ind) => {
        const sno = ind + 1;
        const customer_name = val.dataValues.customername;
        const customer_phno = val.dataValues.phonenumber
        const customer_email = val.dataValues.emailId
        const credit_point = val.dataValues.points
        const details = {s_no: sno, customer_name: customer_name, customer_phno: customer_phno, customer_email: customer_email, credit_point: credit_point}
        customerDetails.push(details)
      })
    
    sheet.columns = [
        { header: "S.NO", key: "s_no", width: 10 },
        { header: "Customer Name", key: "customer_name", width: 25 },
        { header: "Customer Number", key: "customer_phno", width: 25 },
        { header: "Customer Email", key: "customer_email", width: 25 },
        { header: "Credit Point", key: "credit_point", width: 25 }
      ]
      customerDetails.map((val) => {
        sheet.addRow(val)
      })

      sheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, size:12 };            
      });
      sheet.getRow(1).fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'0766AD'}
      };
  
      var fileName = 'customer_report.xlsx';
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
      await workbook.xlsx.write(res);  
   	
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/bill/creation", async (req, res) => {
	try {
		const User = await getUserModel();
		const data = req.body;
		const userData = {
		  customername: data.customerName,
		  phonenumber: data.customerPhoneNo,
		  emailId: data.emailId,
		  points: data.customerPoints,
		};
		const customer = await User.create(userData);
	   console.log(req.body)
	   res.status(200).json({ success: true, message: "Successfully created Customer" })
	} catch(error) {
		console.error("Error creating customer:", error);
    	res.status(500).json({ error: "Internal server error" });
	}
})

// Create operation - POST /customers
router.post("/", async (req, res) => {
  try {
    const User = await getUserModel();
    const data = req.body;
    const userData = {
      customername: data.customername,
      phonenumber: data.phonenumber,
      emailId: data.emailId,
      points: data.points,
    };
    const customer = await User.create(userData);
    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update operation - PUT /customers/:id
router.put("/:id", async (req, res) => {
  try {
    const User = await getUserModel();
    const userId = req.params.id;
    const data = req.body;
    const updatedRows = await User.update(data, { where: { id: userId } });
    if (updatedRows[0] === 1) {
      const updatedCustomer = await User.findByPk(userId);
      res.status(200).json({
        success: true,
        message: "Customer updated successfully",
        data: updatedCustomer,
      });
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete operation - DELETE /customers/:id
router.delete("/:id", async (req, res) => {
  try {
    const User = await getUserModel();
    const userId = req.params.id;
    const deletedRowCount = await User.destroy({ where: { id: userId } });
    if (deletedRowCount === 1) {
      res
        .status(200)
        .json({ success: true, message: "Customer deleted successfully" });
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
