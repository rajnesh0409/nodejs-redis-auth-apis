const assert = require("assert");
const token = require('../helpers/tokenHelper');

const validToken = "144108a382ca94f42e309df8f7afe9f4b85d227b5ea0bd5f4906582aaf179559d0095bf25d6637c2494f90c0f523e7467512ba1725f01106fa23c54c6909afb6";


describe('Create and Store a Token with Data', function () {
	it('should generate a token of 32*2 chars length', function () {
		token.createToken(function (err, token) {
			assert.equal(32 * 2, token.length);
		});
	});

	it('should throw an Error if userdata is empty', function () {
		assert.throws(
			function () {
				token.saveToken(validToken, validToken, function (err) {
					throw err;
				});
			},
			function (err) {
				if ((err instanceof Error) && /data is not a valid Object/.test(err)) {
					return true;
				}
			}
		);

		assert.throws(
			function () {
				token.createAndStoreToken(undefined, function (err) {
					throw err;
				});
			},
			function (err) {
				if ((err instanceof Error) && /data is not a valid Object/.test(err)) {
					return true;
				}
			}
		);

		assert.throws(
			function () {
				token.createAndStoreToken("", function (err) {
					throw err;
				});
			},
			function (err) {
				if ((err instanceof Error) && /data is not a valid Object/.test(err)) {
					return true;
				}
			}
		);
	});
});