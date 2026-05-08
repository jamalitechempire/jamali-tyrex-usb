 const { cmd } = require("../command");
const fetch = require("node-fetch");

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        }
    };
};

cmd({
  pattern: 'gitclone',
  alias: ["git"],
  desc: "Download GitHub repository as a zip file.",
  react: '📦',
  category: "downloader",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  args,
  reply,
  sender
}) => {
  if (!args[0]) {
    return reply("Where is the GitHub link?\n\nExample:\n.gitclone https://github.com/username/repository\n\n> ® Powered by Tyrex Tech");
  }

  if (!/^(https:\/\/)?github\.com\/.+/.test(args[0])) {
    return reply("Invalid GitHub link. Please provide a valid GitHub repository URL.\n\n> ® Powered by Tyrex Tech");
  }

  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
    const match = args[0].match(regex);

    if (!match) {
      throw new Error("Invalid GitHub URL.");
    }

    const [, username, repo] = match;
    const zipUrl = `https://api.github.com/repos/${username}/${repo}/zipball`;

    const response = await fetch(zipUrl, { method: "HEAD" });
    if (!response.ok) {
      throw new Error("Repository not found.");
    }

    const contentDisposition = response.headers.get("content-disposition");
    const fileName = contentDisposition ? contentDisposition.match(/filename=(.*)/)[1] : `${repo}.zip`;

    await conn.sendMessage(from, { 
      text: `📥 *Downloading repository...*\n\n*Repo:* ${username}/${repo}\n*File:* ${fileName}\n\n> ® Powered by Tyrex Tech`, 
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: m });

    await conn.sendMessage(from, {
      document: { url: zipUrl },
      fileName: fileName,
      mimetype: 'application/zip',
      caption: `📦 *${repo}*\n\n> ® Powered by Tyrex Tech`,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: m });
 
  } catch (error) {
    console.error("Error:", error);
    reply("Failed to download the repository. Please try again later.\n\n> ® Powered by Tyrex Tech");
  }
});
