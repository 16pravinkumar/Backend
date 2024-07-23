const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// setting up the parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting up to read the static files
app.use(express.static(path.join(__dirname, "public")));

// setting up the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fs.readdir("./files", (err, data) => {
    if (err) throw err;
    res.render("index", { files: data });
  });
});

app.get(`/file/:filename`, (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, fileData) => {
    res.render("show", { filename: req.params.filename, fileData: fileData });
  });
});

app.get("/edit/:filename", (req, res) => {
  res.render("edit", { filename: req.params.filename });
});

app.post("/editFileName", (req, res) => {
  fs.rename(
    `./files/${req.body.oldName}`,
    `./files/${req.body.newName}`,
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error renaming file");
      } else {
        res.redirect("/");
      }  
    }
  );
});


// delete  file

app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./files/${req.params.filename}`, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting file");
    } else {
      res.redirect("/");
    }
  });
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("_")}.txt`,
    req.body.details,
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error creating file");
      } else {
        res.redirect("/");
      }
    }
  );
});

app.listen(3000, () => {
  console.log("rinb");
});
