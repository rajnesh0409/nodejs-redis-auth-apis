const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        name: {
            type: String,
            unique: false,
            required: true,
        },
        description: {
            type: String,
            unique: false,
            required: false,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            unique: false,
            required: true,
        },
        userId: {
            type: String,
            unique: true,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

let User = mongoose.model("Users", userSchema);
module.exports = User;
