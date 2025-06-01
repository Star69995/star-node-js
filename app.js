const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const app = express()

app.use(express.json());

app.use(morgan("dev"))

const port = process.env.PORT ?? 3000

// Configure CORS with authorized origins only
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            `http://localhost:${port}`,
        ];

        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions)) 

app.get("/a", (req, res) => {
    console.log(req.query);
    res.send("hello world");

})


app.use("/api/users", require("./routes/user"))
app.use("/api/login", require("./routes/auth"))
app.use("/api/cards", require("./routes/card"))


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to database");
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    })
}).catch((err) => {
    console.log(err);
})

app.all(/.*/, (req, res) => {
    console.log(req.method + " " + req.url);
    res.send("goodbye world");
})



