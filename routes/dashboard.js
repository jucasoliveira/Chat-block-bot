let express = require('express');
let router = express.Router();

/* GET dashboard page. */
router.get('/', function(req, res, next) {
    if(req.user){
        req.user.filelist.forEach(d => console.log(d.name));
        res.render('./dashboard/dashboard',  {user: req.user, 'fileList': req.user.filelist});
    } else {
        res.redirect('/singing');
    }

});

module.exports = router;
