const { join } = require('path');
const { readdirSync, existsSync, readFileSync } = require('fs');
const { watch } = require('fs');
const syntaxerror = require('syntax-error');
const conn = { logger: console }; // Gantikan ini dengan logger sebenar anda jika ada

const pluginFolder = join(__dirname, './plugins/index');
const pluginFilter = filename => /\.js$/.test(filename);
global.plugins = {};

async function filesInit() {
  for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = join(pluginFolder, filename);
      const module = require(file);
      global.plugins[filename] = module.default || module;
    } catch (e) {
      conn.logger.error(e);
      delete global.plugins[filename];
    }
  }
}

filesInit()
  .then(() => console.log(Object.keys(global.plugins)))
  .catch(console.error);

global.reload = (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = join(pluginFolder, filename);
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(`re-require plugin '${filename}'`);
      else {
        conn.logger.warn(`deleted plugin '${filename}'`);
        return delete global.plugins[filename];
      }
    } else conn.logger.info(`requiring new plugin '${filename}'`);
    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) conn.logger.error(`syntax error while loading '${filename}'\n${err}`);
    else try {
      delete require.cache[require.resolve(dir)]; // Buang cache modul
      const module = require(dir);
      global.plugins[filename] = module.default || module;
    } catch (e) {
      conn.logger.error(`error require plugin '${filename}'\n${e}`);
    } finally {
      global.plugins = Object.fromEntries(
        Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b))
      );
    }
  }
};

Object.freeze(global.reload);
watch(pluginFolder, global.reload);
