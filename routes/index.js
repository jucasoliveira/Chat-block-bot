let express = require('express');
let router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { csrfToken: req.csrfToken() , user: req.user });
});

module.exports = router;
