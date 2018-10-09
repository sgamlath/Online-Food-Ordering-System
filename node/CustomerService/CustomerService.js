const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()

app.use(cors());
app.use(bodyParser.json());

var customers = [
    { name: "Saman", un: "saman", pw: "c2FtYW4=", points: 3 },
    { name: "Kamal", un: "kamal", pw: "a2FtYWw=", points: 2 },
    { name: "Nuwan", un: "nuwan", pw: "bnV3YW4=", points: 5 },
    { name: "Nimal", un: "nimal", pw: "bmltYWw=", points: 0 },
    { name: "Supun", un: "gamma", pw: "Z2FtbWE=", points: 10 }
];

app.get('/customers', (req, res) => {
    res.json(customers);
});

app.post('/customerByUN/:un', (req, res) => {
    var userNameTrue = false;
    customers.forEach(customer => {
        if ((customer.un) == (req.params.un)) {
            userNameTrue = true;
            if(customer.pw == req.body.pw){
                res.json(customer);
                return;
            }else{
                res.json({message: "Incorrect Password"});
            }
        }
    });
    if(!userNameTrue){
        res.json({ message: 'Invalid username' });
    }
});

app.get('/customerByName/:name', (req, res) => {
    customers.forEach(customer => {
        if ((customer.name) == (req.params.name)) {
            res.status(200).json(customer);
            return;
        }
    });
    res.status(404).json({message: 'Invalid name' });
});

app.post('/addCustomer', function (req, res) {
    var isExisting = false;
    customers.forEach(customer => {
        if ((customer.un) == (req.body.un)) {
            isExisting = true;
        }
    });
    if (isExisting) {
        res.status(409).send({ message: 'Username already exists' });
    } else {
        customers.push(
            { name: req.body.name, un: req.body.un, pw: req.body.pw, points: 0 }
        );
        res.status(201).send({ message: 'User created successfully' });
    }
});

app.put('/updatePoints/:un', function(req, res) {
    customers.forEach(function(customer){
        if(customer.un == req.params.un){
            var id = customers.findIndex(x => x.un == customer.un)
            customers[id].points = req.body.points;
            res.json({ message: "updated"})
        }
    })
});

app.listen(3002, () => console.log('Customer Service is running on port 3002'))