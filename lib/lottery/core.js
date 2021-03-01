const config = require('../../config');
const {toFixedFloat} = require('../common');

const selectWinner = (entries) => {
    let array = [];
    let total = 0;
    entries.forEach(entry => {
        total += parseInt(entry.tickets);
        if ( entry.tickets > 0 ) {
            for( let i=0; i<entry.tickets; i++ ) {
                array.push({discord: entry.discord, tickets: entry.tickets});
            }
        }
    });
    const winner = array[Math.floor(Math.random() * array.length)];
    winner.luck = toFixedFloat(((winner.tickets / total) * 100), 2);
    return winner;
}

const getJackpotPrize = (entries) => {
    let total = 0;
    entries.forEach(entry => {
        if ( entry.tickets > 0 ) {
            total += (entry.tickets * config.lottery.price)
        }
    });
    return (total - (total * config.lottery.fee/100));
}

module.exports = {
    selectWinner,
    getJackpotPrize
}