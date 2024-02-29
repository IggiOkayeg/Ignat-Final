const express = require('express');
const session = require('express-session');
const routes = require('./routes');
bodyParser = require("body-parser");
const path = require("path")
const axios = require('axios');


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false,
}));

app.use(express.json());
app.use('/', routes);  
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')))
app.use(express.static(path.join(__dirname, 'pics')))


app.get('/recipes', async (req, res) => {
    const query = req.query.q;
    const offset = req.query.offset || 0; 
  
    const options = {
      method: 'GET',
      url: 'https://recipe-by-api-ninjas.p.rapidapi.com/v1/recipe',
      params: {
        query,
        offset
      },
      headers: {
        'X-RapidAPI-Key': '98445a03f2msh06b5f9b2fb4a9f1p1bf90ajsn8f0cb9bbf3cd',
        'X-RapidAPI-Host': 'recipe-by-api-ninjas.p.rapidapi.com'
      }
    };
  
    try {
      const response = await axios.request(options);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/lowcarb-recipes', async (req, res) => {
    const { name } = req.query;
  
    const options = {
      method: 'GET',
      url: 'https://low-carb-recipes.p.rapidapi.com/search',
      params: {
        name,
        limit: '10'
      },
      headers: {
        'X-RapidAPI-Key': '98445a03f2msh06b5f9b2fb4a9f1p1bf90ajsn8f0cb9bbf3cd',
        'X-RapidAPI-Host': 'low-carb-recipes.p.rapidapi.com'
      }
    };
  
    try {
      const response = await axios.request(options);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});