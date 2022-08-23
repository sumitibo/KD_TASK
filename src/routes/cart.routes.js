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

const cartRoutes = async (fastify, options) => {
  //create a new cart
  fastify.route({
    method:"POST",
    url: "/cart",
    schema: new_cart_schema,
    handler: generateCart,
  });

  //add a cart line
  fastify.route({
    method:"POST",
    url:"/cart/:cart_id/cart_line",
    schema: add_cart_line,
    handler: addCartLine,
  });

  //delete a cart line
  fastify.route({
    method:"DELETE",
    url:"/cart/:cart_id/cart_line/:cart_line_id",
    schema: delete_cart_line,
    handler: deleteCartLine,
  });

  //update a cart line quantity
  fastify.route({
    method:"PATCH",
    url:"/cart/:cart_id/cart_line/:cart_line_id",
    schema: update_cart_line,
    handler: updateQuantity,
  });

  //get specific cart details
  fastify.route({
    method:"GET",
    url:"/cart/:cart_id",
    schema: get_cart_detail,
    handler: getCartDetails,
  });

};

module.exports = cartRoutes;
