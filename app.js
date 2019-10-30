const express = require("express");
const MongoClient = require('mongodb').MongoClient;

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

mongoClient.connect()
  .then((client) => {
    console.log('MongoDB connected!!!');

    const db = client.db("usersdb");
    const collection = db.collection("users");

    let users = [{name: "Bob", age: 34} , {name: "Alice", age: 21}, {name: "Tom", age: 45}];

    // collection.insertMany(users, function(err, result){
    //
    //   if(err){
    //     return console.log(err);
    //   }
    //   console.log(result);
    // });

    // collection.findOne({name: 'Bob'}, function(err, results){
    //
    //   console.log(results);
    //   client.close();
    // });

    collection.find().toArray((err, result) => {
      console.log(result);
    });

    client.close();
  })
  .catch(() => {
    console.log('error');
  });

app.use(function(request, response, next){

  let now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let data = `${hour}:${minutes}:${seconds} | ${request.method} | ${request.url} | ${request.get("user-agent")}`;
  console.log(data);
  fs.appendFile("server.log", data + "\n", function(){});
  next();
});

app.get("/", function(request, response){
  response.send("Hello");
});
app.listen(3000);
