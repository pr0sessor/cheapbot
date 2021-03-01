const Datastore = require('nedb');
const path = require('path');


const db = new Datastore({filename: path.join(__dirname, '../../database/lottery/draws.db')});
db.loadDatabase();

const find = (query) => {
    return new Promise((resolve, reject) => {
        db.find(query, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    }) 
}

const findOne = (query) => {
    return new Promise((resolve, reject) => {
        db.findOne(query, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    }) 
}

const insert = (query) => {
    return new Promise((resolve, reject) => {
        db.insert(query, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    }) 
}

const update = (query, records) => {
    return new Promise((resolve, reject) => {
        db.update(query, records, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    }) 
}

const remove = (query, options) => {
    return new Promise((resolve, reject) => {
        db.remove(query, options, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    }) 
}

module.exports = {
    find,
    findOne,
    insert,
    update,
    remove,
};