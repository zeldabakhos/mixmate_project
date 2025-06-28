const Invoice = require("../models/invoiceModels");
const Ingredient = require("../models/ingredientModels");

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

        // Loop through the items and find corresponding ingredients
        for (const item of items) {
            let query = { ingredientName: item.ingredientName };

            // If model is provided, refine the search
            if (item.model) {
                query.model = item.model;
            }

            const ingredient = await Ingredient.findOne(query);

            if (!ingredient) {
                return res.status(400).json({ message: `Ingredient '${item.ingredientName}' with model '${item.model}' does not exist.` });
            }

            if (ingredient.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for '${item.ingredientName}'. Available: ${ingredient.stock}` });
            }

            // Calculate total amount
            totalAmount += ingredient.price * item.quantity;

            // Add valid item to the list
            validItems.push({
                ingredientId: ingredient._id,
                ingredientName: ingredient.ingredientName,
                model: ingredient.model,
                quantity: item.quantity,
                price: ingredient.price
            });

            // Reduce stock count
            ingredient.stock -= item.quantity;
            await ingredient.save();
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