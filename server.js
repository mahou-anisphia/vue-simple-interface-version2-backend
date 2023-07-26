const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());
app.get("/items", (req, res) => {
  const items = [
    { text: "COS20007 Hurdle Test Resit" },
    { text: "COS10025 DFD Diagram Presentation" },
    { text: "COS10009 Introduction To Programming" },
  ];
  res.send(items);
});
app.listen(port, () => console.log("app running"));
