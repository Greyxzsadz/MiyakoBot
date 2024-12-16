const commands = [];
  await new Promise((resolve) => {
    if (!fs.existsSync(global.commandPath)) {
      fs.mkdirSync(global.commandPath);
    }
    function readdir(dirpath) {
      fs.readdirSync(dirpath).forEach((val) => {
        const fullpath = path.join(dirpath, val);
        if (path.extname(fullpath) === ".js") {
          commands.push(require(fullpath));
        } else if (fs.statSync(fullpath).isDirectory()) {
          readdir(fullpath);
        }
      });
    }
    readdir(path.join(__dirname, global.commandPath));
    resolve(commands);
  });


for (let command of commands) {
      if (command.cmds && command.cmds.includes(m.cmd)) {
        try {
          logger("info", `COMMAND ${m.cmd}`, `From: ${m.userId}`);
          if (command.autoRead) {
            await nexsock.readMessages([m.key]);
          }
          if (command.presence) {
            const presenceOptions = [
              "unavailable",
              "available",
              "composing",
              "recording",
              "paused",
            ];
            await nexsock.sendPresenceUpdate(
              presenceOptions.includes(command.presence)
                ? command.presence
                : "composing",
              m.id
            );
          }
          if (command.react) {
            await nexsock.sendMessage(m.id, {
              react: {
                key: m.key,
                text: command.react,
              },
            });
          }
          if (command.onlyOwner && !m.itsMe && !m.isOwner)
            return m.reply(global.mess.onlyOwner);
          if (command.handle) {
            await command.handle(nexsock, m);
            await nexsock.sendMessage(m.id, {
              react: {
                key: m.key,
                text: "✅",
              },
            });
          }
        } catch (err) {
          m.replyError(err.message);
        }
      } else {
        switch (m.cmd) {
          default:
            break;
        }
      }
                 }
