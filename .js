if (useCode.isTrue && !nexsock.authState.creds.registered) {
    await inquirer
      .prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "Terhubung menggunakan pairing code?",
          default: true,
        },
      ])
      .then(async ({ confirm }) => {
        useCode.isTrue = confirm;
        if (confirm) {
          inquirer
            .prompt([
              {
                type: "number",
                name: "number",
                message: "Masukkan nomor WhatsApp: +",
              },
            ])
            .then(async ({ number }) => {
              let code = await nexsock.requestPairingCode(number);
              logger(
                "primary",
                `Pairing Code for +${number}:`,
                code.match(/.{1,4}/g)?.join("-") || code
              );
            });
        } else {
          start();
        }
      })
      .catch(console.log);
                  }
