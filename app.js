const express = require("express");

const bodyParser = require ("body-parser");

const mongoose = require("mongoose");

const app = express();

let tasks = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-naidu:12345@cluster0.qkyzp.mongodb.net/todolistDB", {useNewUrlParser: true});

const tasksSchema = {
    name: String
};

const Task = mongoose.model("Task",tasksSchema);


const defaultTasks = [];


app.get("/",function(request,response){


    // console.log("today's date")

    let toDayDate = new Date();
    
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = toDayDate.toLocaleDateString("en-US",options);
     

     Task.find({}, function(err,foundTasks){
        
        response.render("list",{today: day , newTasks: foundTasks});
        
     });
    
});

app.post("/",function(request,response){

    const taskName = request.body.newTask;
    
    const task = new Task({
        name: taskName
    });

    task.save();

    response.redirect("/");
});

app.post("/delete", function(request,response){
    
    const checkedTaskId = request.body.checkbox;
    
    Task.findByIdAndRemove(checkedTaskId,function(err){
        if(err){
            console.log(err);
        }
        else{
            // console.log("successfully deleted the item")
            response.redirect("/");
        }
    });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(){
    console.log("server is running on port 3000");
});
