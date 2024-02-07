import { Router } from "express";
import dotenv from "dotenv";
import { token } from "./auth.js";
import { Octokit } from "@octokit/rest";
import axios from "axios";

dotenv.config();

const repo = Router();

const octokit = new Octokit({
  auth: token,
});

repo.get("/all",  (req, res) => {
  console.log("Token get:", token);

  //   await octokit
  //     ?.request("GET /user/repos", {
  //       headers: {
  //         "X-GitHub-Api-Version": "2022-11-28",
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //       res.send(response.data);
  //     })
  //     .catch((error) => {
  //       res.send(error);
  //     });
  axios.get("https://api.github.com/user/repos", {
    headers: {
      Authorization: `token ${token}`,
    },
  }).then((response) => {
    const repos = [];
    response.data.forEach((element) => {
      console.log(element.name);
      repos.push(element.name);
    });
    res.send(repos);
  } ).catch((error) => {
    res.send(error);
    });
});

export default repo;
