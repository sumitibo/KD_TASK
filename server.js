const fastify = require("fastify");
const {client} = require("./src/config/db");
const fp = require("fastify-plugin");
const port = 7441;
const cartRoutes = require("./src/routes/cart.routes");
const { checkAuthentication } = require("./src/hooks/authentication");



const start = async () => {
  try {
    let app = fastify({ logger: false });

    app.register(cartRoutes);
    app.decorate('client',client);
    app.addHook("onRequest", checkAuthentication);
    client.connect();
    await app.listen({ port });
    console.log(`Server is listening on port ${port}`);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};
start();
