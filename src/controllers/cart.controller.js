const { v4: uuidv4 } = require("uuid");

function generateCart(req, reply) {
  try{

  }catch(err){
    return reply.code(400).send(err);
  }
}

function addCartLine(req, reply) {
  try{

  }catch(err){
    return reply.code(400).send(err);
  }
}

function deleteCartLine(req, reply) {
  try{

  }catch(err){
    return reply.code(400).send(err);
  }
}

function updateQuantity(req, reply) {
  try{

  }catch(err){
    return reply.code(400).send(err);
  }
}

async function getCartDetails(req, reply) {
  try{
    const query = await this.client.query("SELECT * FROM TESTING")
    console.log(query)
    return reply.code(200).send(query)
  }catch(err){
    return reply.code(400).send(err);
  }
}

module.exports = {
  generateCart,
  addCartLine,
  deleteCartLine,
  updateQuantity,
  getCartDetails,
};
