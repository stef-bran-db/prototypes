const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "out")));

app.get("*all", (req, res) => {
  const htmlPath = path.join(__dirname, "out", req.path + ".html");
  res.sendFile(htmlPath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, "out", "index.html"));
    }
  });
});

app.listen(port, () => {
  console.log(`Prototype running on port ${port}`);
});
