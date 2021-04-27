const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//To deploy the site.
const PORT = process.env.PORT || 8000;

mongoose.connect('mongodb://localhost/display',{
    //This helps us to not have any deprecation warning.
    useNewUrlParser: true, useUnifiedTopology: true});

const searchSchema = new mongoose.Schema({})
const Display = mongoose.model('Display', searchSchema, 'scores');


const app = express();
//Imported view engine.
app.set("view engine","ejs");
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(express.static("public"));

//Defining route for index and passing variables
app.route("/")
.get((req, res)=>{
    res.render("search");
})
.post((req, res)=>{
    let hint = "";
    let response = "";
    let searchQ = req.body.query.toLowerCase();
    let limit = 10;
    if(searchQ.length>0){
        Display.find({
            'headline_text' : { "$regex": searchQ, "$options": "i" }
        },function(err, results) {
            if(err){
                console.log(err);
            } else {
                results.forEach(function(result){
                    
                    if(result){
                        if(hint === ""){
                            hint="<a href=''>" + JSON.stringify(result) +"</a>";
                        } else {
                            hint = hint + "<br /> <a href='' target='_blank'>" + JSON.stringify(result) +"</a>";
                        }
                    }
                })
            }
            console.log(hint)
            if(hint === ""){
                response = "no results"
            } else {
                response = hint;
            }
            res.send({response: response})
        }).limit(limit);
    }
})

app.listen(PORT)