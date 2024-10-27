const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());

//routes
const adminRoute = require("./routers/adminRouter");
app.use("/api", adminRoute)

app.get('/', async (req, res) => {
    try {
        res.send('Helllo');
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});


app.get('/adminlogin', async (req, res) => {
    try {
        const admin = await prisma.admin.findMany();
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching admin' });
    }
});


app.get('/adminlogout', async (req, res) => {
    try {
        const admin = await prisma.admin.findMany();
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching admin' });
    }
});

// unhandled route
app.all("*", (req, res) => {
    res.send("Wrong way ya!");
});



// Endpoint untuk mendapatkan semua pengguna
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Endpoint untuk membuat pengguna baru
app.post('/users', async (req, res) => {
    const { email, name } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
            },
        });
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
