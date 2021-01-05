const { createClient } = require('redis');
const redisClient = createClient();
const { TOKEN } = require('../config/env');
const { randomBytes } = require('crypto');

/*
 * Creates a random token
 * @param {Function} callback(err, token): generated token 
 */

exports.createToken = function (callback) {
    randomBytes(TOKEN.TOKEN_LENGTH, function (ex, token) {
        if (ex) {
            callback(ex);
        } else {
            if (token) {
                callback(null, token.toString('hex'));
            }
            else {
                callback(new Error('Problem occur generating the token'));
            }
        }
    });
};

/*
 * Save token in RedisDB
 * @param {token} string : keyName
 * @param {userData} string : keyValue
 * @param {Function} callback(err, res): token saved 
 */

exports.saveToken = function (token, userData, callback) {
    redisClient.setex(token, TOKEN.TTL, JSON.stringify(userData), function (err, res) {
        if (err) {
            callback(err);
        } else {
            if (res) {
                callback(null, true);
            } else {
                callback(new Error('Unable to save token in redis'));
            }
        }
    });
};

/*
 * Get token by keyName
 * @param {token} string : keyName
 * @param {Function} callback(err, res): return token 
 */

exports.getToken = function (token, callback) {
    redisClient.get(token, function (err, userData) {
        if (err) {
            callback(err);
        } else {
            if (userData) {
                callback(null, JSON.parse(userData));
            } else {
                callback(new Error('Token Not Found'));
            }
        }
    });
};

/*
 * Delete token by keyName
 * @param {token} string : keyName
 * @param {Function} callback(err, res): delete token 
 */

exports.deleteToken = function (token, callback) {
    redisClient.del(token, function (err, res) {
        if (err) {
            callback(err);
        } else {
            if (res) {
                callback(null, true);
            } else {
                callback(new Error('Token Not Found'));
            }
        }
    });
};