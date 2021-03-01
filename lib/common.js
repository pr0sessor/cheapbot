const request = require('axios');

const convertHash = (hash) => {
	if(hash >= 1E15){
		return (hash / 1E15).toFixed(2) + " PH";
	}else if(hash >= 1E12){
		return (hash / 1E12).toFixed(2) + " TH";
	}else if(hash >= 1E9){
		return (hash / 1E9).toFixed(2) + " GH";
	}else if(hash >= 1E6){
		return (hash / 1E6).toFixed(2) + " MH";
	}else if(hash >= 1E3){
		return (hash / 1E3).toFixed(2) + " KH";
	}else{
		return hash + " H";
	}
}

const toFixedFloat = (number, decimal) => {
	return parseFloat(number.toFixed(decimal));
}

const getAddressStats = async (address, url) => {
    try {
	    const res = await request.get(`${url}api/accounts/${address}`);
        return res.data;
    }catch(e){
		console.log(e.message)
        return false;
    }
}

const getPoolStats = async (url) => {
    try {
	    const res = await request.get(`${url}api/stats`);
        return res.data;
    }catch(e){
		console.log(e.message)
        return false;
    }
}

const getMarket = async () => {
    try {
	    const res = await request.get('https://api.centex.io/v1/public/tickers');
        return res.data[7];
    }catch(e){
		console.log(e.message)
        return false;
    }
}

const getPrice = async () => {
    try {
	    const res = await request.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,GBP,EUR,CAD');
        return res.data;
    }catch(e){
		console.log(e.message)
        return false;
    }
}

module.exports = {
    convertHash,
	toFixedFloat,
	getAddressStats,
	getPoolStats,
	getMarket,
	getPrice
}