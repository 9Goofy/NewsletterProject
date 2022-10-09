const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { response } = require('express');

const application  = express();

application.use(bodyParser.urlencoded({extended: true}));

application.use(express.static("public"));

application.get("/",function(req,res){
    console.log("Server is up");
    res.sendFile(__dirname+"/signup.html");
});

application.post("/",function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    var url =   "https://us13.api.mailchimp.com/3.0/lists/b4f87bc046" 
    var data = {
        members: [{
            email_address: email,
            status:"subscribed",
            merge_fields: {
                "FNAME": firstName,
                "LNAME": lastName
            }
        }
        ]
    };
    const jsonData = JSON.stringify(data);
    
    const options = {
        method: "POST",
        auth:"anyGoofy:7307525cd4cf6d38aaf5e6ef0ad0e8e1-us13"
    }
    
    const request = https.request(url,options, function(response) {
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data) );
        })
    })

    request.write(jsonData);
    console.log(firstName, lastName, email);
    request.end(); 
   
});

application.post("/failure",function(req,res){
    res.redirect("/");
});



application.listen(process.env.PORT || 3000,function(){
    console.log("Server is running at 3000");
});


// mailchimp api key
//7307525cd4cf6d38aaf5e6ef0ad0e8e1-us13
// mailchimp list ID
// b4f87bc046