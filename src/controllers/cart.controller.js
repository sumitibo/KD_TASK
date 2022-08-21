const fs = require("fs");
const path = require("path");
function generateCart(req, reply) {
  try {
    const filePath = path.join(__dirname, "../data") + "/users.json";
    const readFile = async () => {
      try {
        const data = await fs.promises.readFile(filePath, "utf8");
        return data;
      } catch (err) {
        console.log(err);
      }
    };
    readFile()
      .then((res) => JSON.parse(res))
      .then((res) => {
        return reply.code(201).send({
          order_number: "dhhdd",
          res,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    return reply.code(400).send(err);
  }
}

module.exports = { generateCart };
