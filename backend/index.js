import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import dotenv from "dotenv";
dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT_URI || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT_URI}`);
    });
  })
  .catch((err) => console.log("MongoBD connect Error: ", err.message));
