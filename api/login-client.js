const request = require("request");

module.exports = (req, res) => {
  const requestTokenOptions = {
    uri: "https://x.nest.land/api/getkey",
    json: true,
    body: {
      username: req.body.data.username,
      password: req.body.data.password,
    },
  };
  request.post(requestTokenOptions, function (err, response, body) {
    if (err) {
      return res.status(500).json(
        { message: err },
      );
    }
    if (body.success) {
      res.status(201).json({ body });
    }
  });
};
