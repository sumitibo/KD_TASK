const {generateCart,addCartLine} = require('../controllers/cart.controller');
const {new_cart_schema,add_cart_line} = require('../schemas/cart.schema');

const create_new_cart = {
  schema:new_cart_schema,
  handler:generateCart
}

const add_cart_lines ={
  schema:add_cart_line,
  handler:addCartLine
}

module.exports ={create_new_cart,add_cart_lines}