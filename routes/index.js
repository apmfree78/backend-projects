var express = require('express');
var router = express.Router();
const controller = require('./controller');
const { catchErrors } = require('../errorHandlers');
const { userValidationRules, validate } = require('./validators.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/shorturl', controller.loadForm);
// command line: curl -d 'url=https://yahoo.com' -X POST https://backend-projects1978.herokuapp.com/api/shorturl; echo;
router.post(
  '/api/shorturl',
  userValidationRules(),
  validate,
  catchErrors(controller.setURL)
);
router.get('/api/shorturl/:thecode', catchErrors(controller.redirect));

module.exports = router;
