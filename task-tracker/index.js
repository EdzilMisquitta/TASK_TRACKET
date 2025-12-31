import express from "express";
import taskRouter from "./routes/task.router";
const app = express();
const port = 8000;
app.use("/tasks", taskRouter);
app.listen(port, () => console.log("The server has started"));
