const express = require("express");
const dotenv = require("dotenv");
const { MongoClient, Collection } = require("mongodb");
const bodyParser = require("body-parser");

dotenv.config();
const url = process.env.MONGO_URI || "mongodb://localhost:27017";
console.log(url);
console.log(process.env.MONGO_URI);
const client = new MongoClient(url);

const dbName = "passop";
const app = express();
const port = 3000;
app.use(bodyParser.json());

client.connect();

app.get("/", async (req, res) => {
  const db = client.db(dbName);
  console.log(db);
  const collection = db.collection("passwords");
  const findResult = await collection.find({}).toArray();

  res.json(findResult);
});

app.post("/", async (req, res) => {
  try {
    const password = req.body;

    const db = client.db(dbName);
    console.log(db);
    const collection = db.collection("passwords");
    const insertResult = await collection.insertOne(password);
    res.json({
      message: "Password saved successfully",
      insertedId: insertResult.insertedId,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/", async (req, res) => {
  const password = req.body;
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const deleteResult = await collection.deleteOne(password);
  res.json({ message: "Password Deleted Successfully", result: deleteResult });
});

app.listen(port || 3000, () => {
  console.log(`Server is running on port ${port || 3000}`);
});
