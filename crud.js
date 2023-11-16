const http = require("http");
const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
const PORT = 5000;
const dataFilePath = "users.json";

//read file
function readFromFile() {
  try {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.log(`something went wrong ${error.message}`);
  }
}

//write to file
function writeToFile(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 4));
}

//get message
app.get("/", (req, res) => {
  res.json({
    message: "API working",
  });
});

//get function
app.get("/user", (req, res) => {
  const getData = readFromFile();
  res.json(getData);
});

//post function
app.post("/user", (req, res) => {
  const { name, dob, department } = req.body;
  if (!req.body.name || !req.body.dob || !req.body.department) {
    res.status(404);
    return res.json({ message: "Required data has to be filled!" });
  }
  const getData = readFromFile();
  const user = {
    id: Date.now().toString(),
    name,
    dob,
    department,
  };
  getData.push(user);
  res.json(user);
  writeToFile(getData);
});

//put function
app.put("/user/:id", (req, res) => {
  const { id } = req.params;
  let { name, dob, department } = req.body;
  const getData = readFromFile();
  const userToUpdate = getData.find((user) => user.id === id);
  console.log(userToUpdate);
  const Index = getData.findIndex((user) => user.id === id);
  console.log(Index);
  if (Index != -1) {
    userToUpdate.name = name;
    userToUpdate.dob = dob;
    userToUpdate.department = department;
    res.json(userToUpdate);
    writeToFile(getData);
  } else {
    res.json({ message: "user not found" });
  }
});

// delete
app.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  const getData = readFromFile();
  const indexToDelete = getData.findIndex((user) => user.id === id);
  console.log(indexToDelete);
  if (indexToDelete != -1) {
    const deletedUser = getData[indexToDelete];
    getData.splice(indexToDelete, 1);
    writeToFile(getData);
    res.json(deletedUser);
  } else {
    res.json({ message: "user not found" });
  }
});

app.listen(PORT, () => {
  console.log(`server is loading at http://localhost:${PORT}`);
});
