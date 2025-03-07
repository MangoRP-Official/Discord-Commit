const { EmbedBuilder, WebhookClient } = require("discord.js");
const MAX_MESSAGE_LENGTH = 72;

module.exports.send = async (id, token, commits, pusher) => {
  if (!commits || commits.length === 0) return console.log("No valid commits");

  const client = new WebhookClient({ id, token });

  try {
    const { changelog, totalCommits } = getChangeLog(commits);
    if (!changelog) return console.log("No valid commits");

    const embed = createEmbed(
      commits[0].timestamp,
      pusher,
      changelog,
      totalCommits
    );

    await client.send({ username: "MangoRP", embeds: [embed] });
  } catch (error) {
    console.error("Error sending webhook:", error.message);
    throw new Error(error.message);
  } finally {
    client.destroy();
  }
};

function createEmbed(timestamp, pusher, changelog, totalCommits) {
  console.log(`https://github.com/${pusher}.png?size=64`);
  return new EmbedBuilder()
    .setColor("#FFA62B")
    .setAuthor({
      name: `${pusher} heeft ${totalCommits} update${
        totalCommits === 1 ? "" : "s"
      } toegevoegd`,
      iconURL: `https://github.com/${pusher}.png?size=64`,
    })
    .setTitle("MangoRP Changelog")
    .setThumbnail("https://images.mangorp.nl/global/logo.png")
    .setDescription(changelog)
    .setFooter({
      text: "MangoRP Changelogs",
      iconURL: "https://images.mangorp.nl/global/logo.png",
    })
    .setTimestamp(Date.parse(timestamp));
}

function getChangeLog(commits) {
  const validCommits = commits.filter(
    ({ message }) => !message.includes("Merge") && !message.includes("-hide")
  );

  if (validCommits.length === 0) return null;

  const totalCommits = validCommits.length;
  const changelog = validCommits
    .slice(0, 10)
    .map(
      ({ message }) =>
        `— ${
          message.length > MAX_MESSAGE_LENGTH
            ? message.substring(0, MAX_MESSAGE_LENGTH) + "..."
            : message
        }`
    )
    .join("\n");

  return {
    changelog:
      totalCommits > 10
        ? `${changelog}\n+ ${totalCommits - 10} meer...`
        : changelog,
    totalCommits,
  };
}
