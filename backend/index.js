const express = require("express")
const app = express()
const port = 4000
const userRoutes = require("./routes/users")
const connectDB = require("./utils/db.js")
const path = require("path")
const productRoutes = require("./routes/products")
const invoiceRoutes = require("./routes/invoices")
const cartRoutes = require("./routes/cart");
require('dotenv').config(); // or `import 'dotenv/config'` if using ESM

// MIDDLEWARE
app.use(express.json())

// --- CORS MIDDLEWARE (should come before ANY routes) ---
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
});
app.options("*", (req, res) => {
    res.sendStatus(200);
});

// Other middleware
app.use((req, res, next) => {
    req.requestTime = Date.now();
    req.arithmetical_value = 4 * 7;
    next();
});

connectDB()

// ROUTES
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/invoices", invoiceRoutes)
app.use("/api/cart", cartRoutes);

// ecommerce
app.get("/", (req, res) => {
    res.send("Welcome to my API ! e-commerce backed 🤳")
})

// image folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
