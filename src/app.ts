import express from "express";
import postRoute from "./routes/post.routes";

const app = express();

app.use(express.json());

app.use("/api/posts", postRoute);

export default app
