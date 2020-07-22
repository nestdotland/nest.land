const request = require('request');

module.exports = (req, res) => {
  if (!req.body.data.token) {
    return res.status(400).json({ message: 'reCaptcha Token is required' });
  }
  const verifyCaptchaOptions = {
    uri: 'https://www.google.com/recaptcha/api/siteverify',
    json: true,
    form: {
      secret: process.env.CAPTCHA_SECRET,
      response: req.body.data.token
    }
  };

  request.post(verifyCaptchaOptions, function(err, response, body) {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Oops, something went wrong on our side' });
    }
    if (!body.success) {
      return res.status(500).json({ message: body['error-codes'].join('.') });
    }
    res.status(201).json({ success: true });
  });
};
