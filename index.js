const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fqvfigl.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`;

console.log(uri);

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
    const database = client.db("CURD");
    const userCollection = database.collection('Users');

    app.get('/users', async(req, res)=>{
      const query = {};
      const coursor = userCollection.find(query);
      const users = await coursor.toArray();
      res.send(users);
    })

    app.get('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const user = await userCollection.findOne(query);
      res.send(user);
    })

    app.post('/users', async(req, res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.put('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const user = req.body;
      const option = {upsert: true};
      const updatedUser = {
        $set:{
          name: user.name,
          email: user.email
        }
      };
      const result = await userCollection.updateOne(filter, updatedUser, option);

      res.send(result);
    })

    app.delete('/users/:id', async(req, res)=>{
      const id = req.params;
      // console.log(id);
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })
    

  } finally { 
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('CURD Server')
})

app.listen(port, () => {
  console.log(`CURD server running on port ${port}`)
})