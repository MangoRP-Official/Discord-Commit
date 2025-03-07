const core = require("@actions/core");
const github = require("@actions/github");
const webhook = require("../src/discord.js");

async function run() {
  try {
    const payload = github.context.payload;
    const { repository, commits, sender, compare } = payload;
    if (!commits || commits.length === 0)
      return console.log("No commits, skipping...");
    if (sender.type === "Bot") return console.log("Commit by bot, skipping...");

    const id = core.getInput("id");
    const token = core.getInput("token");
    const pusher = commits[0].committer.name;

    console.log(
      `Processing ${commits.length} commit(s) for ${repository.name}...`
    );
    await webhook.send(id, token, commits, pusher);
    console.log("Webhook sent successfully!");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
