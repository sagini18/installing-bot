import { Router } from "express";
import dotenv from "dotenv";
import { token } from "./auth.js";
import { Octokit } from "@octokit/rest";
import axios from "axios";

dotenv.config();

const repo = Router();

repo.get("/all", (req, res) => {
  axios
    .get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${token}`,
      },
    })
    .then((response) => {
      const repos = [];
      response.data.forEach((element) => {
        repos.push(element.name);
      });
      res.send(repos);
    })
    .catch((error) => {
      res.send(error);
    });
});

export { repo};
