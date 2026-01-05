import { env } from "./config/processEnv.js";
import mongoose from "mongoose";
import express from "express";
import { authRouter } from "./routes/authRoutes.js";
import { contentRouter } from "./routes/contentRoutes.js";
import { linkRouter } from "./routes/linkRoutes.js";

const app = express();
const port = env.PORT;

app.use(express.json());
app.use("/sb/auth", authRouter);
app.use("/sb/content", contentRouter);
app.use("/sb/public", linkRouter);

app.get("/", (req, res) => {
  res.send("hello, frist time from TS");
});

async function main() {
  try {
    await mongoose.connect(env.DB_URL);
    console.log(`Connected to DB`);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.log(`Error connecting to DB: `, err);
  }
}

main();
