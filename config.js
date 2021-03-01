module.exports = {
    token: process.env.TOKEN,
    prefix: "-",
    gamePrefix: "$",
    salt: process.env.SALT,
    channels: ["813627414147629077", "813916019341000718", "812981256345223181"],
    gameChannels: ["814720986460323841", "813916019341000718", "812981256345223181"],
    network: {
        name: "CheapEth",
        symbol: "CTH",
        chainId: 777,
        rpc: "https://node.cheapeth.org/rpc",
        blockTime: 14.4,
        explorer: "https://explore.cheapswap.io"
    },
    lottery: {
	     enabled: false,
        join: 5,
        price: 0.1,
        confirmation: 10,
        interval: "5s",
        gas: 10,
        fee: 2,
        min: 5,
        address: process.env.ADDRESS,
        privateKey: process.env.PRIVATE_KEY,
        mods: ["547985246231199744", "803784130768535583"]
    },
    mongo: {
        url: process.env.MONGODB,
        options: {
          useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
    }
}
