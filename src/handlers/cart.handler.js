const {generateCart} = require('../controllers/cart.controller');
const {new_cart_schema} = require('../schemas/cart.schema');

const create_new_cart = {
  schema:new_cart_schema,
  handler:generateCart
}

module.exports ={create_new_cart}