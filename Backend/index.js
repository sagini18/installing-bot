import  express from "express";
import {pullRequestHandler} from "./routes/pullRequestHandler.js";
import {auth} from "./routes/auth.js";
import cors from "cors";
import repo from "./routes/repo.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use("/api", pullRequestHandler);
app.use("/github-app",auth);
app.use("/repositories",repo);

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
