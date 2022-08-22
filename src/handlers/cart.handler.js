const {
  generateCart,
  addCartLine,
  deleteCartLine,
  updateQuantity,
  getCartDetails,
} = require("../controllers/cart.controller");
const {
  new_cart_schema,
  add_cart_line,
  delete_cart_line,
  update_cart_line,
  get_cart_detail,
} = require("../schemas/cart.schema");

const create_new_cart = {
  schema: new_cart_schema,
  handler: generateCart,
};

const add_cart_lines = {
  schema: add_cart_line,
  handler: addCartLine,
};

const delete_cart_lines = {
  schema: delete_cart_line,
  handler: deleteCartLine,
};

const update_cart = {
  schema: update_cart_line,
  handler: updateQuantity,
};

const get_cart_details = {
  schema: get_cart_detail,
  handler: getCartDetails,
};

module.exports = {
  create_new_cart,
  add_cart_lines,
  delete_cart_lines,
  update_cart,
  get_cart_details,
};
