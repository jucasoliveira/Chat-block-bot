let express = require('express');
let router = express.Router();

/* GET dashboard page. */
router.get('/', function(req, res, next) {
    if(req.user){

        res.render('./dashboard/dashboard',  {user: req.user});
    } else {
        res.redirect('/singing');
    }

});

module.exports = router;
