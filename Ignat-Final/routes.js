const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/user');
const Portfolio = require('./models/portfolio');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
    }
}).array('pictures', 3);


mongoose.connect("mongodb://localhost:27017/Final", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'privet03072016@gmail.com',
        pass: 'qfqc kabu ikif jhsg'
    }
});

router.get('/', async(req, res) => {
    const portfolios = await Portfolio.find();
    res.render('home', { portfolios }); 
});

router.get('/loggedIn', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const portfolios = await Portfolio.find();
        const username = req.session.user.username;

        if (req.session.user.role === 'admin') {
            res.render('loggedIn', { username, portfolios });
        } else {
            res.render('loggedin2', { username, portfolios });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.get('/loggedIn2', async(req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const portfolios = await Portfolio.find();
    res.render('loggedIn2', { username: req.session.user.username, portfolios });
});

router.get('/login', (req, res) => {
    res.render('login'); 
});

router.get('/api1', (req, res) => {
    res.render('api1'); 
});

router.get('/api2', (req, res) => {
    res.render('api2'); 
});

router.get('/cocktails', (req, res) => {
    res.render('cocktails'); 
});

router.get('/adminpage', (req, res) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }
    
    res.render('adminpage');
});


router.get('/register', (req, res) => {
    res.render('register'); 
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            firstName,
            lastName,
            role: 'regular' 
        });

        
        await newUser.save();
        const mailOptions = {
            from: 'Your Application <privet03072016@gmail.com>',
            to: req.body.email, 
            subject: 'Registration Successful',
            html: 'Thank you for registering with us. Your account has been successfully created.'
        };
        await transporter.sendMail(mailOptions);
        res.status(201).send(`
        <script>
            alert('User registered successfully');
            window.location.href = '/'; // Redirect to homepage if needed
        </script>
    `);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        req.session.user = user;
        const userEmail = user.email;
        const mailOptions = {
            from: 'Your Application <privet03072016@gmail.com>',
            to: userEmail, 
            subject: 'Login Successful',
            html: 'You have successfully logged in to the site.'
        };
        await transporter.sendMail(mailOptions);
        if (user.role === 'admin') {
            res.redirect('/loggedin');
        } else {
            res.redirect('/loggedin2');
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.get('/logout', async (req, res) => {
    try {
        const userEmail = req.session.user.email;
        const mailOptions = {
            from: 'Your Application <privet03072016@gmail.com>',
            to: userEmail, 
            subject: 'Logout Successful',
            html: 'You have successfully logged out from the site.'
        };
        await transporter.sendMail(mailOptions);
        req.session.destroy(err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            res.redirect('/login');
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/portfolio', async (req, res) => {
    try {
        const portfolios = await Portfolio.find();
        res.render('loggedIn', { portfolios }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/portfolio', (req, res) => {
    upload(req, res, async function (err) {
        if (req.session.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        if (err) {
            return res.status(400).send({ message: err.message });
        }
        try {
            const { name, body } = req.body;
            const pictures = req.files.map(file => file.originalname);
            const portfolio = new Portfolio({
                name,
                body,
                pictures
            });
            await portfolio.save();
            res.status(201).json({ message: 'Portfolio added successfully' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
});

router.delete('/portfolio/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const result = await Portfolio.findOneAndDelete({ name });

        if (!result) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.status(200).json({ message: 'Portfolio deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/portfolio/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const { newName, newBody } = req.body;
        const updatedPortfolio = await Portfolio.findOneAndUpdate(
            { name },
            { name: newName, body: newBody },
            { new: true } 
        );

        if (!updatedPortfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.status(200).json({ message: 'Portfolio updated successfully', portfolio: updatedPortfolio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
