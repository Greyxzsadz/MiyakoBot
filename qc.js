const { join } = require('path');
const { readdirSync, existsSync, readFileSync } = require('fs');
const { watch } = require('fs');
const syntaxerror = require('syntax-error');
const { format } = require('util');

const pluginFolder = join(__dirname, './plugins/index');
const pluginFilter = filename => /\.js$/.test(filename);
global.plugins = {};

async function filesInit() {
  for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      let file = join(pluginFolder, filename);
      const module = require(file);
      global.plugins[filename] = module.default || module;
    } catch (e) {
      console.error(e);
      delete global.plugins[filename];
    }
  }
}

filesInit()
  .then(() => console.log(Object.keys(global.plugins)))
  .catch(console.error);

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    let dir = join(pluginFolder, filename);
    if (filename in global.plugins) {
      if (existsSync(dir)) console.info(`re - require plugin '${filename}'`);
      else {
        console.warn(`deleted plugin '${filename}'`);
        return delete global.plugins[filename];
      }
    } else console.info(`requiring new plugin '${filename}'`);

    let err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    });
    if (err) console.error(`syntax error while loading '${filename}'\n${format(err)}`);
    else
      try {
        delete require.cache[require.resolve(dir)]; // Clear cache to reload updated file
        const module = require(dir);
        global.plugins[filename] = module.default || module;
      } catch (e) {
        console.error(`error require plugin '${filename}\n${format(e)}'`);
      } finally {
        global.plugins = Object.fromEntries(
          Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b))
        );
      }
  }
};

Object.freeze(global.reload);
watch(pluginFolder, (eventType, filename) => {
  if (filename) global.reload(eventType, filename).catch(console.error);
});

(async () => {
  await global.reloadHandler();
})();
