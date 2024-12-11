require('./config.js');

const { createRequire } = require("module"); // Untuk menyokong `require` jika perlu
const path = require('path');
const { platform } = require('process');
const pino = require('pino');
const ws = require('ws');
const {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  readFileSync,
  watch
} = require('fs');
const chalk = require('chalk');
const yargs = require('yargs');
const { spawn } = require('child_process');
const lodash = require('lodash');
const syntaxerror = require('syntax-error');
const { tmpdir } = require('os');
const { format } = require('util');
const { Low, JSONFile } = require('lowdb');
const { mongoDB, mongoDBV2 } = require('./lib/mongoDB.js');
const store = require('./lib/store.js');
const { makeWASocket, protoType, serialize } = require('./lib/simple.js');

const {
  useMultiFileAuthState,
  DisconnectReason
} = require('@adiwajshing/baileys');

global.__filename = (pathURL = __filename, rmPrefix = platform !== 'win32') => rmPrefix ? pathURL.replace(/^file:\/\/\//, '') : pathURL;
global.__dirname = path.dirname(global.__filename);
global.__require = createRequire(__dirname);

const { CONNECTING } = ws;
const { chain } = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

protoType();
serialize();

global.API = (name, path = '/', query = {}, apikeyqueryname) => {
  const base = global.APIs?.[name] || name;
  return `${base}${path}${query || apikeyqueryname ? `?${new URLSearchParams({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[base] } : {}) })}` : ''}`;
};

global.timestamp = {
  start: new Date
};

global.opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
global.prefix = new RegExp('^[' + (opts['prefix'] || 'xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

const dbFile = new JSONFile('db.json');
global.db = new Low(dbFile);

global.loadDatabase = async () => {
  if (global.db.READ) return new Promise(resolve => setInterval(async function () {
    if (!global.db.READ) {
      clearInterval(this);
      resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
    }
  }, 1000));
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = { users: {}, chats: {}, stats: {}, msgs: {}, sticker: {}, settings: {}, ...(global.db.data || {}) };
  global.db.chain = chain(global.db.data);
};
await global.loadDatabase();

global.authFile = 'auth_info.json';
const { state, saveCreds } = await useMultiFileAuthState(global.authFile);

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      ignore: 'hostname',
      translateTime: true
    }
  }
}).child({ class: 'baileys' });

const connectionOptions = {
  version: [2, 2308, 7],
  printQRInTerminal: true,
  auth: state,
  logger: pino({ level: 'silent' }),
  patchMessageBeforeSending: message => {
    const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
    if (requiresPatch) {
      message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadataVersion: 2,
              deviceListMetadata: {},
            },
            ...message,
          },
        },
      };
    }
    return message;
  },
};

global.conn = makeWASocket(connectionOptions);
conn.isInit = false;

// Kod tambahan sama dengan versi asal
//...
