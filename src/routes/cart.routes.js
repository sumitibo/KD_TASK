const {create_new_cart,add_cart_lines} = require('../handlers/cart.handler');

const cartRoutes = (fastify,options,done) => {

    //create a new cart
    fastify.post('/cart/:id',create_new_cart)
    fastify.post('/cart/:cart_id/line',add_cart_lines)
    done()
}

module.exports = cartRoutes;