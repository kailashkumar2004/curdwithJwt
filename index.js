const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = 2000;
const router = require("./src/router");
const db = require('./src/db/db');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", router);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
