const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jsonWebToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

app.post("/registers", async (req, res) => {
  // Make the function asynchronous
  let regData = req.body;
  const existingUser = users.find((user) => user.username === regData.username);
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "Username already exists. Registration failed." });
  }

  try {
    // Hash the password before storing it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(regData.password, saltRounds);

    // Store the hashed password in the database
    regData.password = hashedPassword;
    let newIndex = users.push(regData);
    let regID = newIndex - 1;
    let token = jsonWebToken.sign(regID, "vockey");

    res.json(token);
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration." });
  }
});

app.post("/login", async (req, res) => {
  // Make the function asynchronous
  let loginData = req.body;
  const existingUserIndex = users.findIndex(
    (user) => user.username === loginData.username
  );
  if (existingUserIndex >= 0) {
    try {
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(
        loginData.password,
        users[existingUserIndex].password
      );
      if (passwordMatch) {
        let token = jsonWebToken.sign(existingUserIndex, "vockey");
        res.json(token);
        console.log(users);
      } else {
        return res
          .status(401)
          .json({ error: "Password Error, please try again" });
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred during login." });
    }
  } else {
    return res.status(401).json({
      error: `The account with username ${loginData.username} does not exist`,
    });
  }
});

app.listen(port, () => console.log("app running"));
