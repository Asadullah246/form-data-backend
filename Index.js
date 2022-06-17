const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sciop.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function data(){
   
    try{
        await client.connect();
        const personCollection = client.db("formdata").collection("persons");

        app.get("/persons", async(req, res)=>{
            const persons=await personCollection.find({}).toArray();
            res.send(persons);
        });
        app.post("/persons", async(req, res)=>{
            const person = req.body;
            const insertData=await personCollection.insertOne(person);
            res.send(insertData);
        });
        app.delete("/persons/:id", async(req, res)=>{
            const id=req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteData=await personCollection.deleteOne(query);
            res.send(deleteData);
        })

        app.put("/persons/:id",async(req, res)=>{
            const id=req.params.id;
            const user=req.body;  
            const filter = { _id: ObjectId(id)};
            const updateUser = {
                $set: user

            };
            const update = await personCollection.updateOne(filter, updateUser)
                res.send(update)


        })


    }
    finally{

    }
}
data().catch(console.dir)


app.get('/', (req, res) => {
    res.send('backend is running');
})
app.listen(port, () => {
    console.log("listening to ", port);
})
