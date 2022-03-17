import express from "express";

const app = express();

const PORT = process.env.PORT || 8877;

app.get("/", (req, res) => {
  res.json({ msg: "all right" });
});

app.get("/contact", (req, res) => {
  res.json({
    name: "mstark",
    website: "https://mpamorim.dev.br/",
    contact: [
      {
        type: "github",
        link: "https://github.com/mstarkRules",
      },
      {
        type: "linkedin",
        link: "https://www.linkedin.com/in/marcos-paulo-amorim-b08228160/",
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log("listening port: " + PORT);
});
