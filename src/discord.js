const { EmbedBuilder, WebhookClient } = require("discord.js");
 const MAX_MESSAGE_LENGTH = 72;
 
 module.exports.send = async (id, token, commits, pusher) => {
   try {
     const client = new WebhookClient({ id, token });
     const changelog = getChangeLog(commits);
     if (!changelog) return console.log("No valid commits");
 
     const embed = createEmbed(commits, pusher, changelog);
     await client.send({ username: "MangoRP", embeds: [embed] });
   } catch (error) {
     console.error("Error sending webhook:", error.message);
     throw new Error(error.message);
   }
 };
 
 function createEmbed(commits, pusher, changelog) {
   return new EmbedBuilder()
     .setColor("#FFA62B")
     .setAuthor({
       name: `${pusher} heeft ${commits.length} update${
         commits.length === 1 ? "" : "s"
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
     .setTimestamp(Date.parse(commits[0].timestamp));
 }
 
 function getChangeLog(commits) {
   const filteredCommits = commits.filter(
     (commit) =>
       !commit.message.includes("Merge") && !commit.message.includes("-hide")
   );
   if (filteredCommits.length === 0) return;
 
   let changelog = filteredCommits
     .slice(0, 10)
     .map((commit) => {
       const message =
         commit.message.length > MAX_MESSAGE_LENGTH
           ? commit.message.substring(0, MAX_MESSAGE_LENGTH) + "..."
           : commit.message;
       return `— ${message}`;
     })
     .join("\n");
 
   if (filteredCommits.length > 10)
     changelog += `\n+ ${filteredCommits.length - 10} meer...`;
   return changelog;
 }
