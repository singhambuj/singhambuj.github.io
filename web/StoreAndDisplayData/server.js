const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// configure middleware
app.use(bodyParser.json());
app.use(cors());

// configure database connection
mongoose.connect("mongodb://localhost:27017/mydb", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
	console.log("Connected to database");
});

// configure data model
const userSchema = new mongoose.Schema({
	name: String,
	email: String,
	age: Number,
});
const User = mongoose.model("User", userSchema);

// configure routes
app.post("/user", function (req, res) {
	const { name, email, age } = req.body;
	const user = new User({ name, email, age });
	user.save(function (err) {
		if (err) {
			console.log(err);
			res.send("Error saving user");
		} else {
			res.send("User saved successfully");
		}
	});
});

app.get("/user", function (req, res) {
	User.find(function (err, users) {
		if (err) {
			console.log(err);
			res.send("Error retrieving users");
		} else {
			res.send(users);
		}
	});
});

// start the server
app.listen(3000, function () {
	console.log("Server is running on port 3000");
});
