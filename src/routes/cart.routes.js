const {
  create_new_cart,
  add_cart_lines,
  delete_cart_lines,
  update_cart,
  get_cart_details,
} = require("../handlers/cart.handler");

const cartRoutes = (fastify, options, done) => {
  //create a new cart
  fastify.post("/cart", create_new_cart);

  //add a cart line
  fastify.post("/cart/:cart_id/cart_line", add_cart_lines);

  //delete a cart line
  fastify.delete("/cart/:cart_id/cart_line/:cart_line_id", delete_cart_lines);

  //update a cart line quantity
  fastify.patch("/cart/:cart_id/cart_line/:cart_line_id", update_cart);

  //get specific cart details
  fastify.get("/cart/:cart_id", get_cart_details);

  done();
};

module.exports = cartRoutes;
