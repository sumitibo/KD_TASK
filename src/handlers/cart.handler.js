const {generateCart,addCartLine,deleteCartLine,updateQuantity} = require('../controllers/cart.controller');
const {new_cart_schema,add_cart_line,delete_cart_line,update_cart_line} = require('../schemas/cart.schema');

const create_new_cart = {
  schema:new_cart_schema,
  handler:generateCart
}

const add_cart_lines ={
  schema:add_cart_line,
  handler:addCartLine
}

const delete_cart_lines = {
  schema:delete_cart_line,
  handler:deleteCartLine
}

const update_cart ={
  schema:update_cart_line,
  handler:updateQuantity
}

module.exports ={create_new_cart,add_cart_lines,delete_cart_lines,update_cart}