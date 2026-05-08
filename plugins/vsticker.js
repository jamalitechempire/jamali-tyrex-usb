const path = require("path");
const { fetchGif, fetchImage, gifToSticker } = require('../lib/sticker-utils');
const { tmpdir } = require("os");
const fetch = require("node-fetch");
const Crypto = require("crypto");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require("../lib/functions");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { cmd } = require('../command');
const { videoToWebp } = require('../lib/video-utils');
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
const config = require("../config");

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

cmd(
  {
    pattern: 'vsticker',
    alias: ['gsticker', 'g2s', 'gs', 'v2s', 'vs',],
    desc: 'Convert GIF/Video to a sticker.',
    category: 'sticker',
    use: '<reply media or URL>',
    filename: __filename,
  },
  async (conn, mek, m, { quoted, args, reply, from, sender }) => {
    try {
      if (!mek.quoted) {
        return reply('*Reply to a video or GIF to convert it to a sticker!*\n\n> ® Powered by Tyrex Tech');
      }

      const mime = mek.quoted.mtype;
      if (!['videoMessage', 'imageMessage'].includes(mime)) {
        return reply('*Please reply to a valid video or GIF.*\n\n> ® Powered by Tyrex Tech');
      }

      const media = await mek.quoted.download();

      const webpBuffer = await videoToWebp(media);

      const sticker = new Sticker(webpBuffer, {
        pack: config.STICKER_NAME || '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
        author: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃', 
        type: StickerTypes.FULL,
        categories: ['🤩', '🎉'],
        id: '12345',
        quality: 75,
        background: 'transparent',
      });

      const stickerBuffer = await sticker.toBuffer();
      return conn.sendMessage(mek.chat, { 
        sticker: stickerBuffer,
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: mek });

    } catch (error) {
      console.error(error);
      reply(`❌ An error occurred: ${error.message}\n\n> ® Powered by Tyrex Tech`);
    }
  }
);