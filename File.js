const { makeWASocket } = require('./wa-socket'); // Pastikan modul ini betul
const { connectionUpdate, saveCreds } = require('./connection'); // Sesuaikan mengikut keperluan
let handler;
let isInit = false;

global.reloadHandler = async function (restartConn) {
  try {
    const Handler = require('./handler.js');
    if (Object.keys(Handler || {}).length) handler = Handler;
  } catch (e) {
    console.error(e);
  }

  if (restartConn) {
    const oldChats = global.conn.chats;
    try {
      global.conn.ws.close();
    } catch (e) {
      console.error(e);
    }
    conn.ev.removeAllListeners();
    global.conn = makeWASocket({ ...connectionOptions, chats: oldChats });
    isInit = true;
  }

  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler);
    conn.ev.off('group-participants.update', conn.participantsUpdate);
    conn.ev.off('groups.update', conn.groupsUpdate);
    // conn.ev.off('message.delete', conn.onDelete);
    conn.ev.off('connection.update', conn.connectionUpdate);
    conn.ev.off('creds.update', conn.credsUpdate);
  }

  // Pesanan bot
  conn.welcome = '✧━━━━━━[ *WELCOME* ]━━━━━━✧\n\n┏––––––━━━━━━━━•\n│⫹⫺ @subject\n┣━━━━━━━━┅┅┅\n│( 👋 Hallo @user)\n├[ *INTRO* ]—\n│ *Nama:* \n│ *Umur:* \n│ *Gender:*\n┗––––––━━┅┅┅\n\n––––––┅┅ *DESCRIPTION* ┅┅––––––\n@desc\n\n*W E L C O M E*';
  conn.bye = '✧━━━━━━[ *GOOD BYE* ]━━━━━━✧\nSayonara *@user* 👋\n\n*G O O D B Y E*';
  conn.spromote = '@user sekarang admin!';
  conn.sdemote = '@user sekarang bukan admin!';
  conn.sDesc = 'Deskripsi telah diubah ke \n@desc';
  conn.sSubject = 'Judul grup telah diubah ke \n@subject';
  conn.sIcon = 'Icon grup telah diubah!';
  conn.sRevoke = 'Link group telah diubah ke \n@revoke';

  // Bind fungsi handler
  conn.handler = handler.handler.bind(global.conn);
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
  conn.onDelete = handler.deleteUpdate.bind(global.conn);
  conn.connectionUpdate = connectionUpdate.bind(global.conn);
  conn.credsUpdate = saveCreds.bind(global.conn);

  // Pasang semula event listeners
  conn.ev.on('messages.upsert', conn.handler);
  conn.ev.on('group-participants.update', conn.participantsUpdate);
  conn.ev.on('groups.update', conn.groupsUpdate);
  conn.ev.on('message.delete', conn.onDelete);
  conn.ev.on('connection.update', conn.connectionUpdate);
  conn.ev.on('creds.update', conn.credsUpdate);

  isInit = false;
  return true;
};
