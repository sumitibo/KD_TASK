const {create_new_cart} = require('../handlers/cart.handler');

const cartRoutes = (fastify,options,done) => {

    //create a new cart
    fastify.post('/cart/new/:user_id',create_new_cart)

    done()
}

module.exports = cartRoutes;