import express from "express";
import 'dotenv/config';
import initializeServer from "./server"; 

const app = express();
const port = process.env.PORT ; 

initializeServer(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
