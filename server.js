const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jsonWebToken = require("jsonwebtoken");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

//using arrays to mimic database behaviour
var items = [
  {
    unitCode: "MAH10009",
    completionMethod: "Intro to Mahou",
    email: "coding.students@example.com",
    details: "Anisphia's magocology",
    user: "admin",
  },
];
var users = [{ username: "admin", password: "root" }];

app.get("/items", (req, res) => {
  res.send(items);
});
app.get("/items/:id", (req, res) => {
  res.send(items[req.params.id]);
});

app.post("/items", (req, res) => {
  const tokenID = req.header("Authorization");
  const userID = jsonWebToken.decode(tokenID, "vockey");
  let temp = req.body;
  temp.user = users[userID].username;
  items.push(temp);
  res.json(temp);
});

app.post("/registers", (req, res) => {
  let regData = req.body;
  const existingUser = users.find((user) => user.username === regData.username);
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "Username already exists. Registration failed." });
  }

  let newIndex = users.push(regData);
  let regID = newIndex - 1;
  let token = jsonWebToken.sign(regID, "vockey");

  res.json(token);
});

app.post("/login", (req, res) => {
  let loginData = req.body;
  const existingUserIndex = users.findIndex(
    (user) => user.username === loginData.username
  );
  if (existingUserIndex >= 0) {
    if (users[existingUserIndex].password === loginData.password) {
      let token = jsonWebToken.sign(existingUserIndex, "vockey");
      res.json(token);
    } else {
      return res
        .status(401)
        .json({ error: "Password Error, please try again" });
    }
  } else {
    return res.status(401).json({
      error: `The account with username ${loginData.username} does not exist`,
    });
  }
});

app.listen(port, () => console.log("app running"));
