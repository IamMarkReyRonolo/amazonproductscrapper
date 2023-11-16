const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const amazonScrapperAPI = require("./api/amazonScrapperAPI");

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));

// API ROUTES
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is up!" });
});
app.use("/api/scrape", amazonScrapperAPI);

// ERROR HANDLING
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    error.status = error.status || 500;
    res.status(error.status).json({ error_message: error.message });
});

// LISTEN
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is listening");
});
