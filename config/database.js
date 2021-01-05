const mongoose = require("mongoose");
const { DB_URL } = require("./env");

module.exports = function () {
    mongoose
        .connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Successfully connected to the database");
        })
        .catch((err) => {
            console.log(
                "Could not connect to the database. Exiting now...",
                err
            );
            process.exit();
        });

    mongoose.connection.on("connected", function () {
        console.log("Mongoose default connection is open to ", DB_URL);
    });

    mongoose.connection.on("error", function (err) {
        console.log(
            "Mongoose default connection has occured " + err + " error"
        );
    });

    mongoose.connection.on("disconnected", function () {
        console.log("Mongoose default connection is disconnected");
    });

    process.on("SIGINT", function () {
        mongoose.connection.close(function () {
            console.log(
                "Mongoose default connection is disconnected due to application termination"
            );
            process.exit(0);
        });
    });
};
