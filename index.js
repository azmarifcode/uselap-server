const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 7000;

// middleWares
app.use(cors());
app.use(express.json());

// Database Connection
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const catagoriesCollection = client.db('uselap-db').collection('catagories');
        const usersCollection = client.db('uselap-db').collection('users');
        const productsCollection = client.db('uselap-db').collection('products');
        const bookingsCollection = client.db('uselap-db').collection('bookings');

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
                    expiresIn: '1h',
                });
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' });
        });

        app.get('/category', async (req, res) => {
            const result = await catagoriesCollection.find({}).toArray();
            res.send(result);
        });

        
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find({}).toArray();
            res.send(result);
        });
        
        


        // ..............get category products...................

        app.get('/categories-data/:category', async (req, res) => {
            const category = req.params.category;
            console.log(category);
            const filter = { category: category };
            console.log(filter);
            const result = await productsCollection.find(filter).toArray();
            res.send(result);
            console.log(result);
        });

        // check role
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await usersCollection.findOne(query);
            res.send(result);
            // console.log(result)
        });

        app.get('/users', async (req, res) =>
        {
            const result = await usersCollection.find({}).toArray()
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const users = await usersCollection.insertOne(user);
            res.send(users);
        });

        app.post('/products', async (req, res) => {
            const product = req.body;
            const products = await productsCollection.insertOne(product);
            res.send(products);
        });

        app.get('/products/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await productsCollection.find(query).toArray()
            res.send(result);
            // console.log(result);
        });

        app.post('/bookings', async (req, res) => {
            const product = req.body;
            const products = await bookingsCollection.insertOne(product);
            res.send(products);
        });
  
        app.get('/bookings/:email', async (req, res) =>
        {
            const email = req.params.email
            const query = { email: email }
            console.log(query)
            const result = await bookingsCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/bookings/:id', async (req, res) =>
        {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bookingsCollection.deleteOne(query)
            res.send(result)
        })
 
        app.delete('/products/:id', async (req, res) =>
        {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query)
            res.send(result)
        });

        app.get('/buyers', async (req, res) =>
        {
            const filter = { role: 'Buyer' }
            const result = await usersCollection.find(filter).toArray()
            res.send(result)
        })

        app.delete('/buyers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        });
        app.get('/sellers', async (req, res) =>
        {
            const filter = { role: 'Seller' }
            const result = await usersCollection.find(filter).toArray()
            res.send(result)
        })

        app.delete('/sellers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        });
        
        app.get('/allProducts', async (req, res) =>
        {
            const result = await productsCollection.find({}).toArray()
            res.send(result)
        })

        app.delete('/allProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        });


        console.log('Database Connected...');
    } finally {
    }
}

run().catch((err) => console.error(err));

app.get('/', (req, res) => {
    res.send('Server is running... in session');
});

app.listen(port, () => {
    console.log(`Server is running...on ${port}`);
});
