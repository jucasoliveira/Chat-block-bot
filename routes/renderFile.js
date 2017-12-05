let express = require('express');
let router = express.Router();
let fs = require('fs');
let file = fs.readFileSync('./.well-known/pki-validation/31DA46F43E6F35E344DEB5D3581BBFBE.txt');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    res.end(file);
});

module.exports = router;
