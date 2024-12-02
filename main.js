const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))

const pluginFilter = filename => /\.js$/.test(filename)

global.plugins = {}

async function filesInit() {

  for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {

    try {

      let file = global.__filename(join(pluginFolder, filename))

      const module = await import(file)

      global.plugins[filename] = module.default || module

    } catch (e) {

      conn.logger.error(e)

      delete global.plugins[filename]

    }

  }

}

filesInit().then(_ => console.log(Object.keys(global.plugins))).catch(console.error)



global.reload = async (_ev, filename) => {

  if (pluginFilter(filename)) {

    let dir = global.__filename(join(pluginFolder, filename), true)

    if (filename in global.plugins) {

      if (existsSync(dir)) conn.logger.info(`re - require plugin '${filename}'`)

      else {

        conn.logger.warn(`deleted plugin '${filename}'`)

        return delete global.plugins[filename]

      }

    } else conn.logger.info(`requiring new plugin '${filename}'`)

    let err = syntaxerror(readFileSync(dir), filename, {

      sourceType: 'module',

      allowAwaitOutsideFunction: true

    })

    if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)

    else try {

      const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))

      global.plugins[filename] = module.default || module

    } catch (e) {

      conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)

    } finally {

      global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))

    }

  }

}

Object.freeze(global.reload)

watch(pluginFolder, global.reload)

await global.reloadHandler()
