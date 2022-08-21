const fastify = require('fastify')({logger:false});
const port = process.env.PORT || 7448



const start = async () => {
    try {
      await fastify.listen({ port });
      console.log(`Server is listening on port ${port}`);
    } catch (err) {
      console.log(err.message);
      process.exit(1);
    }
  };
  start();