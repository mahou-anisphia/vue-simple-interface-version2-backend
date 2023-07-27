const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

var items = [
  { unitCode: "COS20007", details: "Hurdle Test Resit" },
  { unitCode: "COS10025", details: "DFD Diagram Presentation" },
  { unitCode: "COS10009", details: "Introduction To Programming" },
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
