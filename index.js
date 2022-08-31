import express from "express";

const app = express();

app.get("/", (req, response) => {
  response.send("ur definitely gay");
});

app.listen(3333, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log("okay okay it runs well");
});
