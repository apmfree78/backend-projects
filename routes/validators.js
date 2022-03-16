const { body, validationResult } = require('express-validator');
const userValidationRules = () => {
  return [
    // url must be valid
    body('url').isURL(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  } else {
    return res.json({ error: 'invalid url' });
  }
};

module.exports = {
  userValidationRules,
  validate,
};
