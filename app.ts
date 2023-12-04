import express, { Request, Response } from "express";
import "dotenv/config";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";

const app = express();
app.use(express.json());

// ROUTER
import godsRouter from "./entities/gods/router";

app.use(cors());
app.get("/", (Request, Response) => {
  Response.send("Healcheck: ok");
});
app.use("/gods/", godsRouter);
app.use(errorHandler);

app.listen(3000, () => console.log("Servidor levantado en 3000"));
