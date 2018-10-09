const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()

app.use(cors());
app.use(bodyParser.json());

app.post('/process', (req, res) => {
    var ccNo = req.body.ccNo;
    var cvc = req.body.cvc;
    var holder = req.body.holder;
    var amount = req.body.amount;

    if(cvc){
        res.json({message: "success"});
    }else{
        res.json({message: "failed"});
    }
});

app.listen(3004, () => console.log('Credit Payment Service is running on port 3004'))