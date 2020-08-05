const request = require("request");

module.exports = (req, res) => {
  const signupOptions = {
    uri: "https://x.nest.land/api/signup",
    json: true,
    body: {
      username: req.body.data.username,
      password: req.body.data.password,
    },
  };
  request.post(signupOptions, function (err, response, body) {
    if (err) {
      return res.status(500).json({ message: err });
    }
    if (body.success) {
      res.status(201).json({ body });
    }
  });
};
