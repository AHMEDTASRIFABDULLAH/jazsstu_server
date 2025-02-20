const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
app.use(express.json());

const corsOptions = {
  origin: ["https://creativehubtask.netlify.app"],
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
        registration_no: registration,
        id_no: studentId,
      };
      const result = await studentsCollection.find(filter).toArray();
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
