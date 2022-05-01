module.exports = Object.freeze({
   // required. wallet privateKey, you can find it in your metamask
    privateKey : "<Your private key>",
    
    // required. Your wallet address   
    fromAddress : "<Your wallet address>".toLocaleLowerCase(),
    
    // reuiqred. Your target contract address
    toAddress: "<Your target contract address>".toLocaleLowerCase(),

    // required. Find out the contract creator address
    creatorAddress: "<The creator wallet address>".toLocaleLowerCase(),

    // required. The price of public mint. It should based on the smart contract
    price: "0.08",                    
    
    // required. How many items you wants to buy
    maxPriorityFeePerGas : "200", 
    
    // required. The collection contract address you want to buy                                                                           
    maxFeePerGas : "300",                    
    
    // required. The num you want to mint
    number: "1",

    // required. http provider from alchemy. It must be wss
    wssMainnet: "wss://eth-mainnet.alchemyapi.io/v2/<mainnet api key>",

    // required. http provider from alchemy. It must be wss
    wssRinkeby: "wss://eth-rinkeby.alchemyapi.io/v2/<Rinkeby api key>",

    // required. http provider from alchemy. It must be wss
    wssGoerli : "wss://eth-goerli.alchemyapi.io/v2/<Goerli api key>",

    // optional. debug usage. The value should be "Rinkeby" for rinkeby, "Goerli" for goerli or "" for mainnet
  //  network : "Goerlie value should be "Rinkeby" for rinkeby, "Goerli" for goerli or "" for mainnet
    network : "mainnet",

    // timere script const, the start time of dutch
    time: 1644069600,
});
