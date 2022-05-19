exports.getRepositories = getRepositories;

const https = require("https");

function getRepositories(username, callback) {
  var options = {
    host: "api.github.com",
    path: "/users/" + username + "/repos",
    method: "GET",
    headers: { "user-agent": "node.js" },
  };

  var request = https.request(options, function (response) {
    var body = "";
    response.on("data", function (chunk) {
      body += chunk.toString("utf8");
    });

    response.on("end", function () {
      const respositories = JSON.parse(body);
      callback(respositories);
    });
  });
  request.end();
}

