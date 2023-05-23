const express = require("express");
const mongoose = require("mongoose");
const Notes = require("./models/notesSchema");

const app = express();
app.use(express.json());

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://deepakkondapalli29:Qazmlp999@deepak.fvfbvmh.mongodb.net/notesapp"
  )
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log("Error connecting to mongoDB :", err));

// custom middleware
const userAuthorization = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(404).json({ message: "Token not found" });
  }
  if (token !== "Bearer Token@7799") {
    res.status(403).json({ message: "Invalid token" });
  }
  next();
};

app.use((req, res, next) => {
  console.log("My Middleware is running ...");
  next();
});

app.get("/", userAuthorization, async (req, res) => {
  try {
    const notes = await Notes.find();
    res.send(notes);
    console.log("Latest notes is fetched")
  } catch (error) {
    res.status(500).json({ message: "Cannot get any note items" });
  }
});

app.post("/addnotes", userAuthorization, async (req, res) => {
  try {
    const notes = {
      text: req.body.text,
    };
    const newNote = new Notes(notes);
    await newNote.save();
    console.log("Successfully added new note item");
    res.json(notes);
  } catch (error) {
    console.log("Error adding new note :",error);
    res.status(500).json({ message: "Cannot post any note items" });
  }
});

app.delete("/deletenotes/:id", userAuthorization, async (req, res) => {
    const notes = await Notes.findById(req.params.id);
    if(notes){
        await Notes.deleteOne(notes);
    }
    const updatedNotes = await Notes.find();
    res.json(updatedNotes);
    console.log('Notes deleted of id:', req.params.id)
});

app.listen("5000", () => {
  console.log(`server running on port 5000`);
});
