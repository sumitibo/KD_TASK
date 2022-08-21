const { v4:uuidv4} = require("uuid");
const fs = require("fs");
const path = require("path");
function generateCart(req, reply) {
  try {
    let cartAll;
    fs.readFile(path.join(__dirname, "../data")+ "/cart.json","utf-8",(err, data)=>{
      if(err) throw new Error(err);
      else{
        cartAll = JSON.parse(data);
      }
    })

    let {user_id} = req.params; //getting the user_id from params

    let status

    fs.readFile(path.join(__dirname, "../data")+ "/users.json","utf-8",(err, data)=>{
      if(err) {
        console.log(err,"Line no 21 se aa rha h");
      }else{
        let users = JSON.parse(data);
        //geting the user id to get the exact user from the list;

        let actual_user = users.filter((e)=>{
          return (e.id == user_id)
        })

        actual_user = actual_user[0]

        if(! actual_user) return reply.code(400).send({status:"User not found"});

        let cart

        if(!actual_user.cart_active && ! actual_user.cart_id){

          cart ={
            cart_id:uuidv4(),
            order_number: Math.floor(Math.random() * 1000000),
            cart_lines: req.body.cart_line_id ? [req.body] : [],
            user_id:user_id,
          }

          let newCarter = JSON.stringify([...cartAll,cart], null, 2);//merging all existing carts with new one cart;

          fs.writeFile(path.join(__dirname, "../data")+ "/cart.json",
          newCarter,
            (err) => {
              if (err) console.log("Line no 50 se aa rha h");
              else console.log("Data written to file");
            }
          );

          users = users.filter((item)=>{//separate the current user to avoid having duplicate data of user
            return item.id != user_id;
          })

          actual_user.cart_active = true;//after creating cart making it true and attaching cart_id no;

          actual_user.cart_id = cart.cart_id

         
          let revisedUser = JSON.stringify([...users,actual_user],null,2)

          fs.writeFile(path.join(__dirname, "../data")+ "/users.json",
          revisedUser,
            (err) => {
              if (err) console.log("line no 69 se aarha h");
              console.log("Data written to file");
            }
          );
          status = "Cart created successfully";

          replyer(cart)

        }else{
          fs.readFile(path.join(__dirname, "../data")+ "/cart.json","utf-8",(err, data)=>{

            if(err) throw new Error(err);
            else{
              data = JSON.parse(data);
              let user_cart = data.filter((item)=>{
                return item.user_id === user_id
              })

              user_cart = user_cart[0];

              status= "Cart already active"

              replyer(user_cart)
            }
          })          
        }
        
      }
    });

    function replyer(data){
      console.log(data,"dekhe to zara")
      return reply.code(201).send({
      cart_id:data.cart_id,
      user_id:data.user_id,
      order_number:data.order_number,
      status
    })
    }
    
  } catch (err) {
    return reply.code(400).send(err);
  }
}

module.exports = { generateCart };