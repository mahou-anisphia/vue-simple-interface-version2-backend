const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

var items = [
  { text: "COS20007 Hurdle Test Resit" },
  { text: "COS10025 DFD Diagram Presentation" },
  { text: "COS10009 Introduction To Programming" },
];

app.get("/items", (req, res) => {
  res.send(items);
});

app.post("/items", (req, res) => {
  let temp = req.body;
  console.log(temp);
  items.push(temp);
  res.json(temp);
});
app.listen(port, () => console.log("app running"));
