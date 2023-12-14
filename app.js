require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
// const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8v0lano.mongodb.net/?retryWrites=true&w=majority`;

const uri = 'mongodb://0.0.0.0:27017/weekly';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async function () {
  try {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.t7mi1ij.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });

    const blogsCollection = client.db('Weekly').collection('blogs');

    app.get('/', (req, res) => {
      res.send('OK');
    });

    // get all blogs
    app.get('/blogs', async (req, res) => {
      const blogs = await blogsCollection.find({}).toArray();
      res.send(blogs);
    });

    // create a blog
    app.post('/blogs', async (req, res) => {
      const blog = {
        name: req.body.name,
        title: req.body.title,
        description: req.body.description,
        published: req.body.published,
        postImage: req.body.postImage,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
      };

      await blogsCollection.insertOne(blog);
      res.send(blog);
    });

    // get specific blog
    app.get('/blogs/:id', async (req, res) => {
      const id = req.params.id;

      const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
      res.send(blog);
    });

    // delete a blog
    app.delete('/blogs/:id', async (req, res) => {
      const id = req.params.id;

      const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // update a blog
    app.patch('/blogs/:id', async (req, res) => {
      const id = req.params.id;

      const result = await blogsCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            name: req.body.name,
            title: req.body.title,
            description: req.body.description,
            updated: req.body.updated,
          },
        }
      );
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
