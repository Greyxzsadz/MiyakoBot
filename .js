version,
    logger: pino({ level: "fatal" }).child({ level: "fatal" }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(
        state.keys,
        pino({}).child({ level: "fatal" })
      ),
    },
    browser: Browsers.ubuntu("Firefox"),
    defaultQueryTimeoutMs: undefined,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      if (store) {
        const m = await store.loadMessage(key.remoteJid, key.id);
        return m;
      } else return proto.Message.fromObject({});
    },
    markOnlineOnConnect: true,
    msgRetryCounterCache,
    printQRInTerminal: !useCode.isTrue,
    shouldSyncHistoryMessage: () => true,
    syncFullHistory: true,
