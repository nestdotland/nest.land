const request = require("request");

module.exports = (req, res) => {
  const requestOptions = {
    uri: "https://x.nest.land/api/packages",
    headers: {
      "X-Secret-Salt": process.env.X_SECRET_SALT,
      "X-Secret-Hash": process.env.X_SECRET_HASH,
    },
    json: true,
  };
  request.get(requestOptions, function (err, response, body) {
    if (err) {
      return res.status(500).json({ errorMessage: err });
    }
    res.status(201).json({ total: response.headers["x-total"] });
  });
};