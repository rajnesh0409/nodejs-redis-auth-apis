const express = require('express');
const userRoutes = require("./routes/userRoute");
const { PORT } = require("./config/env");
const db = require("./config/database");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// call the database connectivity function
db();

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization"
	);
	next();
});

// set routes
userRoutes(app);

// Home page
app.get('/', function (req, res) {
	res.send('Welcome to demo project!!')
})


// intialise server
app.listen(PORT, () => {
	console.log(`Server is up and running on ${PORT} port.`);
});

module.exports = app;
