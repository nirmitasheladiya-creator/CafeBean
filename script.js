let cart = [];
let total = 0;

function increment(productName, productPrice) {
    let item = cart.find(i => i.name === productName);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    calculateTotal();
    updateDisplay();
}

function decrement(productName, productPrice) {
    let item = cart.find(i => i.name === productName);
    if (item && item.quantity > 0) {
        item.quantity -= 1;
        if (item.quantity === 0) {
            cart = cart.filter(i => i.name !== productName);
        }
    }
    calculateTotal();
    updateDisplay();
}

function calculateTotal() {
    total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateDisplay() {
    document.querySelectorAll('.qty').forEach(span => span.innerText = '0');
    cart.forEach(item => {
        const qtySpan = document.getElementById('qty-' + item.name.replace(/\s+/g, ''));
        if (qtySpan) qtySpan.innerText = item.quantity;
    });

    const billDetails = document.getElementById('bill-details');
    if (billDetails) {
        billDetails.innerHTML = '';
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerText = `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`;
            billDetails.appendChild(li);
        });
    }

    document.getElementById('total-display').innerText = total.toFixed(2);
}

async function confirmOrder() {
    const nameInput = document.getElementById('customerName');
    const name = nameInput ? nameInput.value.trim() : "";
    
    if (!name) { alert("Please enter your name!"); return; }
    if (cart.length === 0) { alert("Cart is empty!"); return; }

    const orderData = { customerName: name, items: cart, totalAmount: total };

    try {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            localStorage.setItem('orderSummary', JSON.stringify({ name, cart, total }));
            
            window.location.href = 'success.html'; 
        } else {
            alert("Error: Server responded with an issue.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error, could not connect!");
    }
}