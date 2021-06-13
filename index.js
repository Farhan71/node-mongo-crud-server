const express = require('express')

// const {MongoClient} = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z8zfw.mongodb.net/organicdb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/',(req, res) =>{
    // res.send("hello world")
    res.sendFile(__dirname + '/index.html');
})



client.connect(err => {
  const collection = client.db("organicdb").collection("products");
//   const product = {name: "modhu", price: 25, quantity:20 }
 
  app.get("/products", (req, res) => {
     collection.find({})
     .toArray((err, documents) => {
         res.send(documents)
     })
  })

 app.get('/product/:id', (req, res) =>{
     collection.find({_id: ObjectId(req.params.id)})
     .toArray((err, documents) => {
         res.send(documents[0])
     })
 })

  app.post("/addProduct" , (req, res) => {
       const product = req.body 
        collection.insertOne(product)
        .then (result =>{
            console.log("data added successfully")
            // res.send("success")
            res.redirect('/')
        })
  })

  app.patch('/update/:id', (req, res) =>{
      collection.updateOne({_id: ObjectId(req.params.id)},
      {
        $set: {price: req.body.price, quantity: req.body.quantity }
      })
      .then(result =>{
          console.log(result)
          res.send(result.modifiedCount > 0)
      })
  })

  app.delete('/delete/:id', (req, res) =>{
    //   console.log(req.params.id)
    collection.deleteOne({_id: ObjectId(req.params.id) })
    .then(( result) => {
        console.log(result)
        res.send(result.deletedCount > 0)
    })
  })
  
  console.log('database connected')
  // perform actions on the collection object
//   client.close();
});


app.listen(3000)