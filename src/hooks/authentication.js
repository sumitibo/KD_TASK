function verifyToken(token) {
  let existingToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    if(token == existingToken) return true;

    return false;
}

async function checkAuthentication(req, reply) {
  //we can check the authentication here like we can extractt the bearer token and get match with jwt;
  
    const bearerToken = req.headers.authorization;
    //  console.log(bearerToken);
    //If not we will throw an error
    if (!bearerToken || !bearerToken.startsWith("Bearer "))
      return reply.status(400).send("Please provide a bearer token");

    const token = bearerToken.split(" ")[1];
    const flag = await verifyToken(token);

    if(! flag ) return reply.status(400).send({status:"User is not authorized to access this api"});
    
   console.log("Entered to onRequest custom hook", req.raw.url);
   console.log("Client IP address is:", req.socket.remoteAddress);
}

module.exports = {
  checkAuthentication,
};
