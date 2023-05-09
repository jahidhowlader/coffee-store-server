const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const PORT = process.env.PORT || 5000

const app = express()

// middleware
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('hello world')
})

// MongoDB DataBase
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_SECRET_KEY}@cluster0.h88b4w7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    app.get('/add-coffee', async (req,res) => {
      
      const allCoffee = await coffeeCollection.find().toArray();
      res.send(allCoffee)
    })
    app.post('/add-coffee', async (req,res) => {

      const newArriveCoffee = req.body

      const result = await coffeeCollection.insertOne(newArriveCoffee);
      res.send(result)
    })

    app.delete('/delete-coffee', async (req, res) => {
      const _id = req.params._id

      const query = {_id: new Object(_id)}

      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})