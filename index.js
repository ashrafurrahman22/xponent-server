const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors())
app.use(express.json());

// mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zup4rtw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
    try {
        await client.connect();
        const identityCollection = client.db('xponentServer').collection('identity');
        

        // product api
        app.get('/identity', async(req, res)=>{
            const query = {};
            const cursor  = identityCollection.find(query);
            const identities = await cursor.toArray();
            res.send(identities);
        })
        
         // catch single item
         app.get('/identity/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await identityCollection.findOne(query);
            res.send(result);
        })


        // post API
        app.post('/identity', async(req, res)=>{
            const identity = req.body;
            const result = await identityCollection.insertOne(identity);
            res.send(result);
        });

        // update || Put aPI
        // update stock
        app.put('/identity/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedIdentity = req.body;
            const filter = {_id : ObjectId(id)};
            const options = { upsert : true };
            const updatedDoc = {
                $set : {
                    name : updatedIdentity.name,
                    occupation : updatedIdentity.occupation,
                    email : updatedIdentity.email,
                    age : updatedIdentity.age
                }
            };
            const result = await identityCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
            })


         // Delete
         app.delete('/identity/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await identityCollection.deleteOne(query);
            res.send(result);
        });


        

        

    }
    finally {

    }

}
run().catch(console.dir);

// root
app.get('/', (req, res)=>{
    res.send('xponent server is running')
});

// root listen
app.listen(port, ()=>{
    console.log('xponent Server is running on port', port);
})