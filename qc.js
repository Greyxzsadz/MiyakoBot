case 'qc': {
if (!q) return reply(`📌Example: ${prefix + command} hallo`)
if (text.length > 100) return reply(`Max 100 character.`)

let [...message] = text.split(' ');
message = message.join(' ');
await XeonStickWait()
let obj = {
type: 'quote',
format: 'png',
backgroundColor: '#ffffff',
width: 512,
height: 768,
scale: 2,
messages: [
{
entities: [],
avatar: true,
from: {
id: 1,
name: pushname,
photo: { 
url: await conn.profilePictureUrl(m.sender, "image").catch(() => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'),
}
},
text: message,
replyMessage: {},
},
],
};
let response = await axios.post('https://quotly.netorare.codes/generate', obj, {
headers: {
'Content-Type': 'application/json',
},
});
let buffer = Buffer.from(response.data.result.image, 'base64');
conn.sendImageAsSticker(m.chat, buffer, m, { packname: `${global.packname}`, author: `${global.author}`})
}
break
