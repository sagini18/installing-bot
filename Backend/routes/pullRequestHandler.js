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


const handlePullRequestOpened = async (payload) => {
  const installationId = payload?.installation?.id;
  const app = new App({
    appId: appId,
    privateKey: privateKey,
    webhooks: {
      secret: webhookSecret,
    },
    installationId,
  });
  const octokit = await app.getInstallationOctokit(installationId);

  console.log(`Received a pull request event for #${payload?.number}`);
  console.log(`The title: ${payload?.pull_request?.title}`);
  console.log(`The comment_contents: ${payload?.pull_request?.body}`);

  const messageForNewPRs =
    "Thanks for opening a new PR! Please follow our contributing guidelines to make your PR easier to review.";

  try {
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
  req.body.action === "opened" && handlePullRequestOpened(req.body);
});

export { pullRequestHandler };
