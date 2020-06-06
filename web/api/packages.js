const request = require("request");

module.exports = (req, res) => {
  const waitingOnOscar = true; // TODO: CHANGE THIS WHEN OSCAR IS DONE WITH API
  if (waitingOnOscar) {
    return res.status(400).json({ errorMessage: "cheese" });
  } else {
    const requestOptions = {
      uri: "https://api.nest.land/packages",
      json: true,
      form: {
        // TODO: FILL THIS IN
        // secret: process.env.CAPTCHA_SECRET
      },
    };
    request.post(requestOptions, function (err, response, body) {
      if (err) {
        return res.status(500).json(
          { errorMessage: "oops, something went wrong on our side" },
        );
      }
      res.status(201).json({ data: body });
    });
  }
};
