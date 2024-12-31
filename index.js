const express = require('express');
const cors = require('cors');
const fs = require('fs');  // Import the fs module
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

let users = [];

// Load existing users from data.json if it exists
if (fs.existsSync('data.json')) {
    const data = fs.readFileSync('data.json', 'utf-8');
    users = JSON.parse(data);
}

app.post('/register_user', (req, res) => {
    // Check for duplicate email
    const existingUser = users.find(user => user.email === req.body.email);
    if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
    }

    let user_id = users.length === 0 ? 1 : users[users.length - 1].id + 1;
    const new_user = {
        id: user_id,
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
    };
    users.push(new_user);
    console.log(users);
    
    // Write updated users array to data.json
    fs.writeFile('data.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error('Error writing to data.json:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(201).json({ message: "User Registered..." });
        }
    });
});



app.listen(port, () => {
    console.log("Server Running....");
});
