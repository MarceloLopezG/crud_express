const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./app/models");
// Routes
const loginRoute = require('./app/routes/login.routes');
const userRoute = require('./app/routes/user.routes');
const app = express();


var corsOptions = {
  origin: "http://localhost:8081"
};


db.sequelize.sync();

app.use(cors(corsOptions));
app.use(bodyParser.json()); // content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // content-type - application/x-www-form-urlencoded

app.use('/api/auth', loginRoute); // login routing
app.use('/api/user', userRoute); // user routing


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});