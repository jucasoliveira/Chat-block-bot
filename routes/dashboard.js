let express = require('express');
let router = express.Router();

/* GET dashboard page. */
router.get('/', function(req, res, next) {
    res.render('./dashboard/dashboard',  {user: req.user});
});

module.exports = router;
