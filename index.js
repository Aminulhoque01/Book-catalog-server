require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8qoxdwe.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db('Book-catalog');
    const bookCollection = db.collection('books');

    app.get('/books', async (req, res) => {
      const cursor = bookCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post('/book', async (req, res) => {
      const product = req.body;

      const result = await bookCollection.insertOne(product);

      res.send(result);
    });

    

    app.get('/book/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const result = await bookCollection.findOne({ _id: new ObjectId(id) });
      // console.log(result);
      res.send(result);
    });

    app.delete('/book/:id', async (req, res) => {
      const id = req.params.id;

      const result = await bookCollection.deleteOne({ _id: new ObjectId(id) });
      console.log(result);
      res.send(result);
    });

  

    app.patch('/book/:id', async (req, res) => {
      const bookId = req.params.id;
      const body = req.body;
      const result = await bookCollection.updateMany(
        { _id: new ObjectId(bookId) },
        { $set:{body:body}}
      );

      
      console.log(result);

      if (result.modifiedCount !== 1) {
        console.error('book not a updated');
        res.json({ error: 'book not a updated' });
        return;
      }

      console.log('book updated successfully');
      res.json({ message: 'book updated successfully' });
    });

 

    app.post('/user', async (req, res) => {
      const user = req.body;

      const result = await userCollection.insertOne(user);

      res.send(result);
    });

    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;

      const result = await userCollection.findOne({ email });

      if (result?.email) {
        return res.send({ status: true, data: result });
      }

      res.send({ status: false });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
