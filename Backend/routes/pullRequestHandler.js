import { Router } from "express";
import dotenv from "dotenv";
import { App } from "octokit";

import fs from "fs";

dotenv.config();

const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;

const privateKey = fs.readFileSync(privateKeyPath, "utf8");

const pullRequestHandler = Router();

const app = new App({
  appId: appId,
  privateKey: privateKey,
  webhooks: {
    secret: webhookSecret,
  },
});




const handlePullRequestOpened = async (octokit, payload ) => {
  console.log("Received a pull request event");
  console.log(
    `Received a pull request event for #${payload?.number}`
  );
  console.log(`The title: ${payload?.pull_request?.title}`);
  console.log(`The comment_contents: ${payload?.pull_request?.body}`);

  const messageForNewPRs =
    "Thanks for opening a new PR! Please follow our contributing guidelines to make your PR easier to review.";

  try {
    console.log(payload?.installation?.id);
    console.log(payload?.installation?.node_id);
    await octokit?.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: payload?.repository?.owner?.login,
        repo: payload?.repository?.name,
        issue_number: payload?.pull_request?.number,
        body: messageForNewPRs,
        headers: {
          "x-github-api-version": "2022-11-28",
        },
        installationId: payload?.installation?.node_id,
      }
    );
  } catch (error) {
    if (error.response) {
      console.error(
        `Error! Status: ${error.response.status}. Message: ${error.response.data.message}`
      );
    }
    console.error(error);
  }
};

pullRequestHandler.post("/webhook", (req, res) => {
  console.log("Received a POST request to /webhook");
  console.log(req.body);  
  handlePullRequestOpened(app.octokit, req.body);

  app.webhooks.onError((error) => {
    if (error.name === "AggregateError") {
      console.error(`Error processing request: ${error.event}`);
    } else {
      console.error(error);
    }
  });
});

export default pullRequestHandler;
