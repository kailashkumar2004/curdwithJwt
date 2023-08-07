
const mongoose = require("mongoose");
class Database {
    constructor() {
        this.db_connect();
    }
  
    async db_connect() {
        try {
            this.database = await mongoose.connect('mongodb://127.0.0.1:27017/kumar', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("Database connected successfully");
        } catch (err) {
            console.error("Error connecting to the database:", err);
        }
    }
}

module.exports = new Database();
