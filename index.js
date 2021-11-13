const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//Midleware

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ecgrw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("hptech_db");
        const servicestourism = database.collection("products");
        const ordertourism = database.collection("orders");
        const usersCollection = database.collection('users');
        const commentCollection = database.collection('comments');
        //post comment

        app.post('/comments', async (req, res) => {
            const servic = req.body;


            console.log('hitting the post api', servic)

            const result = await commentCollection.insertOne(servic);
            console.log(result)
            res.json(result)
        });

        //Get Api
        app.get('/comments', async (req, res) => {
            const cursor = commentCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });




        //Get Api
        app.get('/products', async (req, res) => {
            const cursor = servicestourism.find({});
            const service = await cursor.toArray();
            res.send(service);
        })
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { email: id };
            const cursor = ordertourism.find(filter);
            const oreder = await cursor.toArray();
            res.send(oreder);
            console.log(id);
        });


        app.get('/orders', async (req, res) => {


            const cursor = ordertourism.find({});
            const oreder = await cursor.toArray();
            res.send(oreder);
            console.log(id);
        })

        //get single service

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting sercice', id)
            const quary = { _id: ObjectId(id) };
            const sercice = await servicestourism.findOne(quary);
            res.json(sercice)
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting sercice', id)
            const quary = { _id: ObjectId(id) };
            const sercice = await ordertourism.deleteOne(quary);
            res.json(sercice)
        })

        //Post Api

        app.post('/products', async (req, res) => {
            const servic = req.body;


            console.log('hitting the post api', servic)

            const result = await servicestourism.insertOne(servic);
            console.log(result)
            res.json(result)
        });

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const orderresult = await ordertourism.insertOne(order);
            res.json(orderresult);
        })

        //Delete Api
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) };
            const result = await servicestourism.deleteOne(quary);
            res.json(result);
        });

        //updated data
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedservice = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    img: updatedservice.img,
                    name: updatedservice.name,
                    price: updatedservice.price,
                    packege: updatedservice.packege,
                    description: updatedservice.description
                },
            };
            const result = await servicestourism.updateOne(filter, updateDoc, options)
            console.log('updating user', req);
            res.json(result)
        })

    }


    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running hpteck server');
});

app.listen(port, () => {
    console.log('running hpteck server', port)
})

