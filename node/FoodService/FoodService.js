const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()

app.use(cors());
app.use(bodyParser.json());

var foods= [
    {id:"01", name: "Avacado Smoothie", price: 120}, 
    {id:"02", name: "Apple Juice", price: 100}, 
    {id:"03", name: "Pomegranate Juice", price: 170}, 
    {id:"04", name: "Chacolate Milkshake", price: 150}
];

app.get('/foods', (req, res) => {
    res.json(foods);
});

app.get('/foodById/:id', (req,res) => {
    foods.forEach(food => {
        if(Number(food.id) == Number(req.params.id)){
            res.status(200).json(food);
            return;
        }
    });
    res.status(404).json({error: 'Invalid id'});
});

app.get('/foodByName/:name', (req,res) => {
    foods.forEach(food => {
        if((food.name) == (req.params.name)){
            res.status(200).json(food);
            return;
        }
    });
    res.status(404).json({error: 'Invalid name'});
});

app.listen(3001, () => console.log('Food Service is running on port 3001'))