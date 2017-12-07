let express = require('express');
let router = express.Router();
let api = require('../config/api');

/* GET dashboard page. */
router.get('/', function(req, res, next) {
    if(req.user){
        api.sendID(req.sessionID);
        res.render('./dashboard/dashboard',  {user: req.user, 'fileList': req.user.filelist});
    } else {
        res.redirect('/singing');
    }

});

module.exports = router;
