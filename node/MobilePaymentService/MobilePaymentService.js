const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()

app.use(cors());
app.use(bodyParser.json());

app.post('/process', (req, res) => {
    var phone = req.body.phone;
    var pin = req.body.pin;
    var amount = req.body.amount;
    
    if(pin){
        res.json({message: "success"});
    }else{
        res.json({message: "failed"});
    }
});

app.listen(3003, () => console.log('Mobile Payment Service is running on port 3003'))