const Invoice = require("../models/invoiceModels");
const Product = require("../models/productModels");

exports.getInvoice = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.userId }); 
        res.status(200).json(invoices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.addInvoice = async (req, res) => {
    try {
        const { date, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Invoice must contain at least one item." });
        }

        let totalAmount = 0;
        let validItems = [];

        // Loop through the items and find corresponding products
        for (const item of items) {
            let query = { productName: item.productName };

            // If model is provided, refine the search
            if (item.model) {
                query.model = item.model;
            }

            const product = await Product.findOne(query);

            if (!product) {
                return res.status(400).json({ message: `Product '${item.productName}' with model '${item.model}' does not exist.` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for '${item.productName}'. Available: ${product.stock}` });
            }

            // Calculate total amount
            totalAmount += product.price * item.quantity;

            // Add valid item to the list
            validItems.push({
                productId: product._id,
                productName: product.productName,
                model: product.model,
                quantity: item.quantity,
                price: product.price
            });

            // Reduce stock count
            product.stock -= item.quantity;
            await product.save();
        }

        // Create the invoice
        const newInvoice = new Invoice({
            user: req.userId,
            date: date || new Date(),
            totalAmount,
            items: validItems,
        });

        // Save the invoice
        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};