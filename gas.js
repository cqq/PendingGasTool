const AlchemyWeb3 = require("@alch/alchemy-web3");
const _ = require("lodash");
const Tx = require('ethereumjs-tx').Transaction
const abiDecoder = require('abi-decoder');
const ethers = require('ethers'); // Require the ethers library
const utils = require('ethers').utils;
const config = require('./config.js')
let json = require('./abi.json');

var gasRank = [];
var gasPriRank = [];

const pendingTrasactions = async () => {
  let web3URL;
  let targetContract;
  let creator;


  console.log('Network Mode:', config.network);
  switch(config.network) {
    //---------------- TEST USAGE-------------------------
    case 'Rinkeby':{
      web3URL = config.wssRinkeby;
      targetContract = "";
      creator = "";
      break;
    }
    case 'Goerli':{
      web3URL = config.wssGoerli;
      targetContract = "";
      creator = "";
      break;
    }
    //-----------------------------------------------------
    default: {
      web3URL = config.wssMainnet;
      targetContract = config.toAddress;
      creator = config.creatorAddress;
    }
  }

  console.log('Web3URL:', web3URL);
  const web3 = AlchemyWeb3.createAlchemyWeb3(web3URL);
  // UNIT TEST
  const txn = await web3.eth.getTransaction('0xd2ee24ed3d2e3ce23ec33f8c7470260bc0b1bdc465bff30c3bd8a1cb7e69df52');
  console.log("Unit test passed: " ,txn.gasPrice)
  if(txn.gasPrice === '102838100199'){
    console.log("Unit test passed")
  }
  else{
    throw new Error("Your web3 setting is failing...")
  }
  // DEBUG SECTION
  //sendMinimalLondonTx(web3,data,targetContract,config.price);

  web3.eth
    .subscribe("alchemy_filteredNewFullPendingTransactions", {        // monitor confirm txn gas, change the pendinngT.... to logs
      address: targetContract.toLocaleLowerCase(), 
    })
    .on("data", async (blockHeader) => {
      // console.log('xxxxxx blockHeader:', blockHeader);
      let maxFeePerGas;
      let maxPriorityFeePerGas;
      if('maxPriorityFeePerGas' in blockHeader){
        maxFeePerGas = web3.utils.fromWei(blockHeader.maxFeePerGas, 'gwei');
        maxPriorityFeePerGas = web3.utils.fromWei(blockHeader.maxPriorityFeePerGas, 'gwei');
      }
      else{
        if('gasPrice' in blockHeader){
          maxFeePerGas = web3.utils.fromWei(blockHeader.gasPrice, 'gwei');
          maxPriorityFeePerGas = (web3.utils.fromWei(blockHeader.gasPrice, 'gwei') > 60)? web3.utils.fromWei(blockHeader.gasPrice, 'gwei') - 60 : 0;
        }
      }
      // console.log("gas",maxFeePerGas,maxPriorityFeePerGas, typeof maxPriorityFeePerGas);
      gasRank.push([parseFloat(maxFeePerGas),parseFloat(maxPriorityFeePerGas)]);
      gasPriRank.push(parseFloat(maxPriorityFeePerGas))
    });
};

function roundTo(num) {
  return Math.round(num * 100) / 100
}

const sortRank = () => {
  setInterval(function(){
    let copyRank = JSON.parse(JSON.stringify(gasRank));
    gasRank = [];
    copyRank.sort(function(a, b) {
        return b[0] - a[0];
    });


    let copyPri = JSON.parse(JSON.stringify(gasPriRank));
    gasPriRank = [];
    copyPri.sort(function(a, b) {
        return b - a;
    });
    console.log("copyPri",copyPri)
    let sum = 0.0;
    let pri= 0.0
    copyRank = copyRank.slice(0,200);
    for(let i of copyRank){
      // console.log("i[0]", i[0])
      // console.log("i[1]", i[1])
      sum += i[0];
     // pri += i[1];
    }
   
    for(let j of copyPri){
      //  console.log("j[0]", i[0])
      //  console.log("j[1]", i[1])
  
      pri += j;
    }
    console.log("sum", sum,"pri",pri)
    if(copyRank.length){
      console.log("PENDING TXN (",copyRank.length ,") MAX TIPS(GWEI)", roundTo(copyRank[0][0]), "MIN TIPS(GWEI)", roundTo(copyRank[copyRank.length-1][0]), "Average(GWEI)", roundTo(sum/copyRank.length));
      console.log("PENDING TXN (",copyPri.length ,") MAX maxPriorityFeePerGas(GWEI)", roundTo(copyPri[0]), "MIN maxPriorityFeePerGas(GWEI)", roundTo(copyPri[copyPri.length-1]), "Average Priority", roundTo(pri/copyPri.length));
    }
    else{
      console.log("No pending txn");
    }
  },15000)
}

pendingTrasactions();
sortRank();
  