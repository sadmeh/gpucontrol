var express = require('express');
var router = express.Router();
var nvidiaStatus = require('../modules/nvidiaStatus');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/status', async function(req, res, next) {
    var status = JSON.parse( await nvidiaStatus() );
    res.send(status)
});

module.exports = router;
