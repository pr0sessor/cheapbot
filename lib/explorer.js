const request = require('axios')

const getTransactions = async (address) => {    
    try {
	    const res = await request.get(`https://explore.cheapswap.io/api/explorer/account/${address}/txs`);
        return res.data.data;
    }catch(e){
		console.log(e.message)
        return false;
    }
}

module.exports = {
    getTransactions,
}