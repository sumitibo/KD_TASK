const fastify = require("fastify");
const db = require("./src/db/db");
const port = 7441;
const cartRoutes = require("./src/routes/cart.routes");
const { checkAuthentication } = require("./src/hooks/authentication");



const start = async () => {
  try {
    let app = fastify({ logger: false });

    app.register(cartRoutes);
    app.decorate('knex',db);
    //app.addHook("onRequest", checkAuthentication);
    
    await app.listen({ port });
    console.log(`Server is listening on port ${port}`);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};
start();
