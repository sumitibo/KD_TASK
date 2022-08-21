const fs = require("fs");
const path = require("path");
let readStream = fs.createReadStream(
  path.join(__dirname, "../data") + "/users.json",
  "utf8"
);

async function generateCart(req, reply) {
  try {
    let data = "";
    readStream
      .on("data", function (chunk) {
        data += chunk;
      })
      .on("end", function () {
        console.log(data);
      });
  } catch (err) {}
}

module.exports = { generateCart };
