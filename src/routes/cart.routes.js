const {create_new_cart,add_cart_lines,delete_cart_lines,update_cart} = require('../handlers/cart.handler');

const cartRoutes = (fastify,options,done) => {

    //create a new cart
    fastify.post('/cart',create_new_cart)
    fastify.post('/cart/:cart_id/cart_line',add_cart_lines)
    fastify.delete('/cart/:cart_id/cart_line/:cart_line_id',delete_cart_lines)
    fastify.patch('/cart/:cart_id/cart_line/:cart_line_id',update_cart)
    done()
}

module.exports = cartRoutes;