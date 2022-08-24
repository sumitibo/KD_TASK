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

function getCartDetails(req, reply) {
  try{

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
