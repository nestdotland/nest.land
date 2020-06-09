const request = require("request");

module.exports = (req, res) => {
  let uri;
  if (process.env.DEBUG === "true") {
    uri = "http://localhost:8080/api/packages";
  } else {
    uri = "https://x.nest.land/api/packages";
  }
  const requestOptions = {
    uri: uri,
    headers: {
      "X-Secret-Salt": process.env.API_KEY
    },
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
