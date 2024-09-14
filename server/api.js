const users = require("./db/users.json");

const mysql = require("mysql2");
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'inv_manager_db',
    password: 'test1'
});

require('dotenv').config();

const express = require("express");
const api = express();

const bp = require("body-parser");
api.use(bp.json());
api.use(bp.urlencoded({ extended: true }));

const cors = require("cors");
api.use(cors());

const bcrypt = require("bcrypt");

const zod = require("zod");
const UserSchema = zod.object({
    username: zod.string().min(1, { message: 'Username must be 1 character or more.' }),
    password: zod.string().min(6, { message: 'Password must be longer than 6 characters.' }),
});
const ItemSchema = zod.object({
    name: zod.string().min(1, { message: 'Item name cannot be empty.' }),
    category: zod.string().min(1, { message: 'Item category cannot be empty.' }),
    qty: zod.number().nonnegative({ message: 'Quantity cannot be negative.' }),
    qtyres: zod.number().nonnegative({ message: 'Reservations cannot be negative.' }),
    price: zod.number().nonnegative({ message: 'Price cannot be negative.' })
});

// Authentication middleware
const jwt = require("jsonwebtoken");

const checkAuthenticationToken = (req, res, next) => {
    // Get token
    const token = req.headers.authorization;
    if (token === null) { return res.status(401).json({ error: "No access token provided." }).send(); }

    // Verify correct user
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid access token." });
        req.user = user;
        next();
    });
}

const generateAccessToken = (user) => {
    return jwt.sign( user, process.env.ACCESS_TOKEN, {expiresIn: "15 min"} );
}

const generateRefreshToken = (user) => {
    return jwt.sign( user, process.env.REFRESH_TOKEN );
}

const verifyAdminRole = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === null) { return res.status(401).json({ error: "No access token provided." }).send(); }

    // Verify correct user
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid access token." });

        // Verify user has admin role
        req.user = user;
        let role = req.user.user[0].role;
        req.admin = (role === "admin") ? true : false;

        if (!req.admin) return res.status(403).json({ error: "Unauthorized. You are not an admin. "});

        next();
    });
}

const PORT = process.env.PORT || 3030;

api.get("/status", (req, res) => {
    const status = {
        status: "Running"
    }

    res.send(status);
});




// Inventory queries
api.get("/inventory", checkAuthenticationToken, (req, res) => {
    db.query("SELECT * FROM inventory", function (err, results, fields) {
        if (err) res.status(400).json({ error: err });
        res.status(200).send(results);
    });
});

api.post("/inventory", checkAuthenticationToken, verifyAdminRole, (req, res) => {
    // Validate that item inputted matches item schema, return error messages otherwise
    const schema = ItemSchema.safeParse(req.body);
    if (!schema.success) {
        let errorMessage = "";
        schema.error.errors.map((err) => {
            errorMessage += err.message + " ";
        });
        return res.status(401).json({error: errorMessage });
    }

    // Query database for inventory
    db.query("SELECT * FROM inventory", function (err, results, fields) {
        if (err) res.status(400).json({ error: err });

        // Check if item already exists
        const matchingItems = results.filter((item) => {
            if (item.name === req.body.name) {
                return item;
            }
        });
        if (matchingItems.length !== 0) { return res.status(409).json({ error: "Item already exists." }); }

        // Create new item
        db.query(`INSERT INTO inventory (name, category, qty, qtyres, price) VALUES ("${req.body.name}", "${req.body.category}", ${req.body.qty}, 0, ${req.body.price})`);
        res.status(200).json({ message: "New item created." }).send();
    });
});

api.delete("/inventory/:itemId", checkAuthenticationToken, verifyAdminRole, (req, res) => {
    // Query database for inventory
    db.query("SELECT * FROM inventory", function (err, results, fields) {
        if (err) res.status(400).json({ error: err });

        // Check that item exists in database
        const matchingItem = results.filter((item) => {
            if (item.id.toString() === req.params.itemId)
            {
                return item;
            }
        });
        if (matchingItem.length === 0) { return res.status(409).json({ error: "Item does not exist." }); }

        // Delete item
        db.query(`DELETE FROM inventory WHERE id=${matchingItem[0].id}`);
        res.status(200).json({ message: `Item removed: ID: ${matchingItem[0].id}, Name: ${matchingItem[0].name}` }).send();
    });
});

api.patch("/inventory/:itemId", (req, res) => {
    db.query("SELECT * FROM inventory", function (err, results, fields) {
        if (err) res.status(400).json({ error: err });

        // Check that item exists in database
        const matchingItem = results.filter((item) => {
            if (item.id.toString() === req.params.itemId)
            {
                return item;
            }
        });
        if (matchingItem.length === 0) { return res.status(409).json({ error: "Item does not exist." }); }

        // Validate that item inputted matches item schema, return error messages otherwise
        const PartialItem = ItemSchema.partial();
        const schema = PartialItem.safeParse(req.body);
        console.log(req.body);
        if (!schema.success) {
            let errorMessage = "";
            schema.error.errors.map((err) => {
                errorMessage += err.message + " ";
            });
            return res.status(401).json({error: errorMessage });
        }

        //db.query(`UPDATE inventory SET name="${req.body.name}", category="${req.body.category}", qty=${req.body.qty}, qtyres=${req.body.qtyres}, price=${req.body.price} WHERE id=${matchingItem[0].id}`);
        res.status(200).json({ message: `Item updated: ID: ${matchingItem[0].id}` }).send();
    });
})




// Users queries
api.get("/users/:userId", checkAuthenticationToken, (req, res) => {
    console.log(req.params);

    // Filter users for user with id
    const user = users.filter((user) => {
        if (user.id.toString() === req.params.userId) {
            return user;
        }
    })
    if (user === null) return res.status(404).json({ error: "User ID not found." });

    res.status(200).send(user);
});

api.get("/users", (req, res) => {
    res.send(users);
});

// Ultimately, use database to store tokens
let refreshTokens = [];




api.post("/refresh", (req, res) => {
    const refreshToken = req.headers.authorization.split(' ')[1];
    if (refreshToken === null) return res.status(401).json({ error: "Refresh token not provided."});
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ error: "Refresh token not found."});
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.status(403).json({ error: err });
        const accessToken = generateAccessToken(user);
        res.json({ accessToken: accessToken });
    });
});




api.post("/login", (req, res) => {
    // Validate input matches user login schema
    const results = UserSchema.safeParse(req.body);
    if (!results.success) {
        let errorMessage = "";
        results.error.errors.map((err) => {
            errorMessage += err.message + " ";
        });
        return res.status(401).json({error: errorMessage });
    }
    
    // Filter users list for user with username
    const user = users.filter((user) => {
        if (user.username === results.data.username) {
            return user;
        }
    });
    if (user.length === 0) {
        return res.status(404).json({ error: "User not found." });
    }

    // Compare passwords
    const passwordMatch = () => { 
        if (user[0].password === results.data.password) {
            return true;
        } else {
            return false;
        }
    }
    if (!passwordMatch()) {
        return res.status(401).json({ error: "Incorrect password." });
    } else {
        // Sign user and create token
        const accessToken = generateAccessToken({user: user});
        const refreshToken = generateRefreshToken({user: user});
        refreshTokens.push(refreshToken);

        // Return user on correct login
        return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
    }

});




api.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter((token) => {token !== req.headers.authorization.split(' ')[1]});
    res.status(204).send();
})




api.listen(PORT, () => {
    console.log("API listening on port 3030");
});

module.exports = api;
