const { v4:uuidv4} = require("uuid");
const fs = require("fs");
const path = require("path");
function generateCart(req, reply) {
  try {
    fs.readFile(path.join(__dirname, "../data")+ "/users.json","utf-8",(err, data)=>{
      if(err) {
        console.log(err);
      }else{
        let users = JSON.parse(data);
        let {user_id} = req.params; //geting the user id to get the exact user from the list;

        let actual_user = users.filter((e)=>{
          return e.id == user_id;
        })
        let cart
        if(!actual_user.cart_active){
          cart ={
            cart_id:uuidv4(),
            order_number: Math.floor(Math.random() * 1000000),
            cart_lines: req.body.cart_line_id ? [req.body] : [],
            user_id:user_id,
          }
          let data = JSON.stringify([cart], null, 2);
          fs.writeFile(path.join(__dirname, "../data")+ "/cart.json",
            data,
            (err) => {
              if (err) throw err;
              console.log("Data written to file");
            }
          );
        }
        replyer(cart)
        console.log(actual_user)
      }
    });

    function replyer(data){
      return reply.code(201).send({
      order_number:"dhhdd",
      data
    })
    }
    
  } catch (err) {
    return reply.code(400).send(err);
  }
}

module.exports = { generateCart };
