const { v4: uuidv4 } = require("uuid");

async function generateCart(req, reply) {
  try{
    const {user_id} = req.body;//getting the user_id;
    
    const {cart_lines} =  req.body;//getting the cart_lines;
    
    if(! cart_lines){
      console.log("No cart lines");
    }else{
      console.log(cart_lines);
    }

    return reply.code(201).send({status: 'success'});
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
    const query = await this.knex('testing').select().from('testing');
    console.log(query)
    return reply.code(200).send(query.rows)
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
