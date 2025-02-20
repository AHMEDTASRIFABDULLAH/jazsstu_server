const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200,
};
const port = process.env.PORT || 9000;
app.use(cors(corsOptions));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hwzxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("JazsstuDB");
    const studentsCollection = db.collection("studentCollections");
    app.get("/students", async (req, res) => {
      const { department, studentId, registration } = req.query;
      const filter = {
        department: department,
        registrationNo: registration,
        idNo: studentId,
      };
      const result = await studentsCollection.find(filter).toArray();
      res.send(result);
    });
    app.post("/studentsdata", async (req, res) => {
      const studentsData = req.body;
      const result = await studentsCollection.insertOne(studentsData);
      res.send(result);
    });
    app.get("/getstudents", async (req, res) => {
      const result = await studentsCollection.find().toArray();
      res.send(result);
    });
    app.delete("/student-close/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await studentsCollection.deleteOne(qurey);
      res.send(result);
    });
    app.get("/getstudents/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await studentsCollection.findOne(qurey);
      res.send(result);
    });
    app.put("/update/:id", async (req, res) => {
      const student = req.body;
      const id = req.params.id;
      const updated = {
        $set: student,
      };
      const options = { upsert: true };
      const filter = { _id: new ObjectId(id) };
      const result = await studentsCollection.updateOne(
        filter,
        updated,
        options
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Jazsstu server..");
});

app.listen(port, () => {
  console.log(`Hello Jazsstu server ${port}`);
});
