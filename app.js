require("dotenv").config();
const express = require("express");
const cors = require("cors");

const blogs = require("./routes/blogs");
const user = require("./routes/user");

const app = express();
const PORT = process.env.PORT

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/blogs", blogs);
app.use("/api/v1/user", user);

const dbConnect = require("./db/dbConnect");
dbConnect()

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
