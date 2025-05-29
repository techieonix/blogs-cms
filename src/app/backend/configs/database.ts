const mongoose = require("mongoose");

const { MONGO_URL } = process.env;

exports.connect = () => {
    mongoose.connect(MONGO_URL as string).then((): void => {
        console.log("DB CONNECTED SUCCESSFULLY");
    }).catch((err: unknown): void => {
        console.log("DB CONNECTION FAILED")
        console.error(err)
        process.exit(1)
    });
};