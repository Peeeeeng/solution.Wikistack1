const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const views = require("./views")
const notFoundPage = require("./views/notFoundPage")

app.use(morgan("dev")); //logging middleware
app.use(express.static(path.join(__dirname, "./public"))); //serving up static files (e.g. css files)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send(views.error("Something goes wrong", err))
})


app.use("/wiki", require("./routes/wiki"));
app.use("/users", require("./routes/users"));

app.get('/', function(req, res) {
    res.redirect('/wiki/');
});

app.use((req, res, next) => {
    res.status(404).send(notFoundPage())
})







app
module.exports = app;