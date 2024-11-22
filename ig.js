import axios from "axios";

let handler = async (m, { conn, text, command }) => {
if (!text) return m.reply(`PENGGUNAAN DOWN INSTAGRAM\n\n• Example: *.${command} https://www.instagram.com/p/C-zw9aBh2qg/?chaining=true`);
m.reply(wait)
try {
let data = await instagram(text);
if (data.downloads.length > 0) {
let message = `◕ TITLE: ${data.title || "Tidak Ditemukan!!"}}\n◕ URL: ${data.source}\n`;
let imageSent = false; 
for (let download of data.downloads) {
if (download.ext === 'mp4') {
await conn.sendFile(m.chat, download.url, '', message, m);
} else if (['jpg', 'png', 'jpeg'].includes(download.ext)) {
if (!imageSent) {
await conn.sendFile(m.chat, download.url, '', message, m);
m.reply("_Sisa Gambar Akan Di Krim Ke Private Chat!_");
imageSent = true;
} else {
await delay(4000);
await conn.sendFile(m.sender, download.url, '', '', m);
}
}
}
} else {
m.reply("Gagal mengunduh konten");
}
} catch (e) {
console.log("Gagal mengunduh konten", e);
m.reply(e.message);
}
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
handler.help = ["instagram"];
handler.tags = ["downloader"];
handler.command = /^(ig(dl)?|instagram(dl)?)$/i;
handler.limit = 3;
export default handler;


async function instagram(url) {
try {
let response = await axios.get(`https://vkrdownloader.vercel.app/server?vkr=${url}`);
let data = response.data.data;
if (data.downloads && Array.isArray(data.downloads)) {
let downloads = data.downloads.map(d => ({
url: d.url,
format_id: d.format_id,
ext: d.ext,
size: d.size || "TIDAK TERSEDIA"
}));
return {
title: data.title,
url: data.url,
source: data.source,
description: data.description,
downloads: downloads
};
} else {
throw new Error("Tidak ada data unduhan yang tersedia.");
}
} catch (error) {
throw new Error(error.message);
}
}


/*import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `*Contoh:* ${usedPrefix}${command} https://www.instagram.com/p/ByxKbUSnubS/?utm_source=ig_web_copy_link`
    m.reply(wait)
    try {
        const api = await fetch(`https://api.lolhuman.xyz/api/instagram?apikey=${lolkey}&url=${args[0]}`)
        const res = await api.json()
            conn.sendFile(m.chat, res.result[1], 'KhususVideo.mp4', `*Instagram Downloader*`, m)
    } catch (e) {
        throw `*Server Down!*`
    }
}

handler.help = ['instagram'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(ig|instagram|igdl|instagramdl|igstroy)$/i
handler.limit = true

export default handler*/
