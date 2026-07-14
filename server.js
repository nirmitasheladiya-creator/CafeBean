const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/CafeBeanDB')
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch(err => console.error("MongoDB Connection error:", err));

const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String,
    items: Array,          
    totalAmount: Number,   
    date: { type: Date, default: Date.now }
}));


app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        
        console.log("Order saved successfully:", newOrder);
        res.status(201).send({ message: "Order placed successfully!" });
    } catch (err) {
        console.error("Save error:", err);
        res.status(500).send({ error: "Failed to save order to database" });
    }
});

app.listen(5000, () => {
    console.log('Server is running at http://localhost:5000');
});