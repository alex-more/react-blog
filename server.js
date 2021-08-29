require("dotenv").config()
const express = require('express')
const cors = require("cors")
const app = express()
const db = require("./db")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const https = require("https")
const path = require('path')

app.use(cors())
app.use(express.json())

// Fix annoying CORS errors
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Useful to quickly test if you have access to the server.
app.get('/', (req, res, next) => {
	res.send('~ API is working properly! ~');
})

/** --------------------------------------
 * 
 *              BLOG API
 *
 *  --------------------------------------
 */

// Get all blogs
app.get('/api/blog', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM blog ORDER BY post_date DESC')
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                blog: results.rows
            }
        })
    } catch (err) {
        res.send(err)
    }
})

// Get only a certain number of blogs (count)
app.get('/api/blog/peek/:count', async (req, res) => {
    
    try {
        const results = await db.query("SELECT * FROM blog ORDER BY post_date DESC LIMIT $1",
        [req.params.count])
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                blog: results.rows
            }
        })
    } catch (err) {
        res.send(err)
    }
})

// Create new blog entry
app.post('/api/blog', verifyToken, async (req, res) => {
    if(req.valid == false) {
        return res.status(401);
    }

    try {
        const result = await db.query("INSERT INTO blog (title, category, content) values ($1, $2, $3) returning *", 
        [req.body.title, req.body.category, req.body.content])

        res.status(201).json({
            status: "success",
            data: {
                blogPost: result.rows[0]
            }
        });

    } catch (err) {
        res.send(err)
    }
})

// Modify existing blog entry
app.put('/api/blog/:id', verifyToken, async (req, res) => {
    if(req.valid == false) {
        return res.status(401)
    }
    
    try {
        const result = await db.query("UPDATE blog SET title=$1, category=$2, content=$3 WHERE id=$4 returning *", 
        [req.body.title, req.body.category, req.body.content, req.params.id])

        res.status(200).json({
            status: "success",
            data: {
                blogPost: result.rows[0]
            }
        })

    } catch (err) {
        console.log(err)
    }
})

// Show a full blog entry
app.get('/api/blog/:id', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM blog WHERE id=$1", [req.params.id])

        if(result.rows.length > 0) {
            res.status(200).json({
                status: "success",
                data: {
                    blogPost: result.rows[0]
                }
            })
        } else {
            res.status(204).json()
        }

    } catch (err) {
        res.send(err)
    }
})

// Delete a blog entry
app.delete('/api/blog/:id', verifyToken, async (req, res) => {
    if(req.valid == false) {
        return res.status(401);
    }
    
    try {
        const result = await db.query("DELETE FROM blog WHERE id=$1", [req.params.id])

        if(result.rows.length > 0) {
            res.status(204).json({
                status: "success",
            })
        } else {
            res.status(204).json()
        }

    } catch (err) {
        res.send(err)
    }
})

/** --------------------------------------
 * 
 *  LOGIN, AUTHENTICATION AND ENCRYPTION
 *
 *  --------------------------------------
 */

// Check if user is logged in (used to protect certain admin routes)
app.get('/api/blog/admin/authenticate', verifyToken, (req, res) => {
    if(req.valid == false) {
        return res.status(200).json({ status: "failure" });
    }
        
    res.status(200).json({ status: "success" });
})

// Login route
app.post('/api/login', async (req, res) => {
    // Validate credentials with bcrypt
    try {
        let validCredentials = false;
        const pass = await db.query('SELECT password FROM users WHERE username=$1', 
        [req.body.username])

        if (pass.rowCount == 0) {
            return res.status(200).json({ accessToken: 'invalid_token' })
        }

        if(await bcrypt.compare(req.body.password, pass.rows[0].password)) {
            validCredentials = true;
        } else {
            return res.status(200).json({ accessToken: 'invalid_token' })
        }

        // Generate a Json Web Token
        if (validCredentials) {
            const user = { name: req.body.username }
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20h' })
            res.status(200).json({ accessToken })
        }

    } catch (err) {
        res.status(500).send();
    }
})

// Authenticates a Json Web Token
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    req.valid = false;

    if(token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.sendStatus(403);
        } else {
            req.valid = true;
            next();
        }
    })
}

// ---- Startup / DB Setup ----
const port = process.env.PORT

app.listen(port, async () => {
    console.log(`server is up, listening on port ${port}`)
    try {
        // Check if table 'blog' exists already, if not then create it
        const blogTableCount = await db.query("SELECT COUNT(*) FROM information_schema.tables WHERE table_name='blog'")

        if(blogTableCount.rows[0].count == 0) {
            await db.query('CREATE TABLE blog (id SERIAL, title varchar(120) NOT NULL, category varchar(60) NOT NULL, content TEXT NOT NULL, post_date date NOT NULL DEFAULT CURRENT_DATE)')
        }

        // Check if users table exists in DB already, otherwise create it
        const userTableCount = await db.query("SELECT COUNT(*) FROM information_schema.tables WHERE table_name='users'")

        if(userTableCount.rows[0].count == 0) {
            await db.query('CREATE TABLE users ( username varchar(40) NOT NULL, password text NOT NULL)')
        }

        // Check if a user exists in DB already
        const userCount = await db.query('SELECT COUNT(*) FROM users')

        // If not, then create user based on contents of .env
        let username = process.env.CUSER;
        let password = process.env.CPASSWORD;

        // Hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10)

        // Store that user in DB
        if(userCount.rows[0].count == 0) {
            await db.query("INSERT INTO users (Username, Password) values ($1, $2) returning *", 
            [username, hashedPassword])
        }

    } catch (err) {
        console.log(err)
    }
})
