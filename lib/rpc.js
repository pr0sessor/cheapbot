const Web3 = require('web3');

const config = require('../config');
const web3 = new Web3(config.network.rpc);
const {convertHash} = require('../lib/common');


const getLatestBlock = async () => {
    return web3.eth.getBlock('latest');
}

const networkStats = async() => {
    const currentBlock = await getLatestBlock();
    const difficulty = currentBlock.difficulty;
    return {
        blockNumber: currentBlock.number,
        difficulty,
        hashrate: `${convertHash(difficulty / config.network.blockTime)}/s`,
    };
}

const createWallet = () => {
    return web3.eth.accounts.create();
}

const validateAddress = (address) => {
    return web3.utils.isAddress(address);
}

const getBalance = async (address) => {
    return web3.eth.getBalance(address);
}

const getTransaction = async (hash) => {
    return web3.eth.getTransaction(`0x${hash}`);
}

const getConfirmations = async (blockNumber) => {
    const currentBlock = await web3.eth.getBlock('latest');
    return currentBlock.number - blockNumber
}

const getBlock = async (blockNumber) => {
    return web3.eth.getBlock(blockNumber);
}

const toWei = (amount, option = 'eth') => {
    return web3.utils.toWei(amount.toString(), option);
}

const getGasLimit = async () => {
    return 21000;
}

const sendTransaction = async (amount, to, privateKey, gas) => {
    const gasLimit = gas || await getGasLimit();
    const tx = await web3.eth.accounts.signTransaction({
        to,
        chainId: config.network.chainId,
        value: web3.utils.toWei(amount.toString(), 'ether'),
        gasPrice: web3.utils.toWei(config.lottery.gas.toString(), 'Gwei'),
        gas: gasLimit,
    }, privateKey);
    await web3.eth.sendSignedTransaction(tx.rawTransaction);
    console.log('Sent', amount, 'to', to, tx.transactionHash);
    return tx;
}

module.exports = {
    getLatestBlock,
    networkStats,
    createWallet,
    validateAddress,
    getBalance,
    getTransaction,
    getConfirmations,
    getBlock,
    toWei,
    getGasLimit,
    sendTransaction
}