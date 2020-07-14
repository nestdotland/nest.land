const request = require("request");

module.exports = (req, res) => {
  const requestOptions = {
    uri: "https://x.nest.land/api/package/" + req.body.data.name,
    json: true,
  };
  request.get(requestOptions, function (err, response, body) {
    if (err) {
      return res.status(500).json(
        { errorMessage: err },
      );
    }
    res.status(201).json({ body });
  });
};