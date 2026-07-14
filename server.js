const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB कनेक्शन
mongoose.connect('mongodb://localhost:27017/CafeBeanDB')
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch(err => console.error("MongoDB Connection error:", err));

// ऑर्डर मॉडल
const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String,
    items: Array,          // इसमें आपकी कार्ट की पूरी लिस्ट स्टोर होगी
    totalAmount: Number,   // इसमें आपका फाइनल बिल स्टोर होगा
    date: { type: Date, default: Date.now }
}));

// स्टैटिक फाइल्स सर्व करना
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// API एंडपॉइंट: ऑर्डर सेव करने के लिए
app.post('/api/orders', async (req, res) => {
    try {
        // req.body में customerName, items, और totalAmount आ रहा है
        const newOrder = new Order(req.body);
        await newOrder.save();
        
        console.log("Order saved successfully:", newOrder);
        res.status(201).send({ message: "Order placed successfully!" });
    } catch (err) {
        console.error("Save error:", err);
        res.status(500).send({ error: "Failed to save order to database" });
    }
});

// सर्वर स्टार्ट
app.listen(5000, () => {
    console.log('Server is running at http://localhost:5000');
});