import { Router } from "express";
import { token, owner } from "./auth.js";
import { Octokit } from "@octokit/rest";

const pullRequest = Router();

pullRequest.get("/all", async (req, res) => {
  const repoName = req.query?.repo;
  if (!repoName) {
    res.send("Please provide a repository name");
    return;
  }
  const octokit = new Octokit({
    auth: `token ${token}`,
  });
  if (octokit == null) {
    res.send("Token not found");
    return;
  }
  await octokit.pulls
    .list({
      owner: owner,
      repo: repoName,
    })
    .then((response) => {
      if (response?.data?.length === 0) {
        res.send("No pull requests found");
      } else {
        var pullRequestData = [];
        response.data?.forEach((element) => {
          pullRequestData.push({
            title: element.title,
            number: element.number,
            body: element.body,
          });
        });
        res.send(pullRequestData);
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

pullRequest.post("/comment", async (req, res) => {
  const repoName = req.body?.repo;
  const prNumber = req.body?.pr;
  const comment = req.body?.comment;

  if (!repoName || !prNumber || !comment) {
    res.send("Please provide a repository name, pr number and comment");
    return;
  }
  const octokit = new Octokit({
    auth: `token ${token}`,
  });
  if (octokit == null) {
    res.send("Token not found");
    return;
  }
  await octokit
    ?.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner: owner,
      repo: repoName,
      issue_number: prNumber,
      body: comment,
      headers: {
        "x-github-api-version": "2022-11-28",
      },
    })
    .then((response) => {
      res.send("Comment added successfully");
    })
    .catch((error) => {
      res.send(error);
    });
});

export { pullRequest };
