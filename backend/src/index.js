import dotenv from "dotenv";
import connectDB from "../db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;

connectDB().then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
      });
    } catch (error) {
      console.error(
        `error while trying to run server through express!!! :: ${error}`
      );
    }
  })
  .catch((err) => {
    console.log(`MONGO DB Connection Failed!!! :: ${err}`);
  });

