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

    let {user_id} = req.body; //getting the id from params
    user_id = user_id.trim() //to avoid white spaces;
    let status

    fs.readFile(path.join(__dirname, "../data")+ "/users.json","utf-8",(err, data)=>{
      if(err) {
        throw new Error(err);
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
          if(req.body.cart_lines[0])req.body.cart_lines[0].cart_line_id = uuidv4();
          //console.log(req.body.cart_lines)
          cart ={
            cart_id:uuidv4(),
            order_number: Math.floor(Math.random() * 1000000),
            cart_lines: req.body.cart_lines[0] ? [...req.body.cart_lines] : [],
            user_id:user_id,
          }

          let newCarter = JSON.stringify([...cartAll,cart], null, 2);//merging all existing carts with new one cart;

          fs.writeFile(path.join(__dirname, "../data")+ "/cart.json",
          newCarter,
            (err) => {
              if (err) throw new Error(err);
               //console.log("Data written to file");
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
              if (err) throw new Error(err);
              //console.log("Data written to file");
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

function addCartLine(req,reply){
  try{
    let {cart_id} = req.params;
    let allCarts
    fs.readFile(path.join(__dirname, "../data")+ "/cart.json","utf-8",(err, data)=>{
      if(err) throw new Error(err);
      else{
        allCarts = JSON.parse(data);
        let user_cart = allCarts.filter((item)=>{
          return item.cart_id == cart_id
        })

        if(user_cart.length === 0){

          return reply.code(400).send({status:"Cart not found"})

        }else{

        user_cart = user_cart[0];//getting the exact user;

          //need to check whther the same offer_id(product ) is already present in the cart lines of user or not

          let itemPresent = false;

          for(let i=0;i<user_cart.cart_lines.length;i++){
            if(user_cart.cart_lines[i].item.offer_id == req.body.item.offer_id){
              itemPresent = true;
              break;
            }
          }

          if(itemPresent){

            //item is already present in the cart lines of user;

            //let's get that cart line first and that product with the help of the offer_id and increase the quantity by 1 if user tries to add the same product multiple times
            let updatedCart = user_cart.cart_lines.map((e)=>{

              if(e.item.offer_id == req.body.item.offer_id) e.quantity.quantity_number+=1;
                
               return e;
            })
            //console.log(updatedCart)

            user_cart.cart_lines = updatedCart;

            //filtering out the user_cart to avoid duplication while rewriting the cart database;

            let existingcarts = allCarts.filter((item)=>{
              return item.cart_id != cart_id
            })

            let modifiedCarts = JSON.stringify([...existingcarts,user_cart],null,2);

            fs.writeFile(path.join(__dirname, "../data")+ "/cart.json",
              modifiedCarts,
            (err) => {
              if (err) throw new Error(err);
              //console.log("Data written to file");
            }
            );


            replyer("Item already present in the cart,quantity gets updated")
          }else{
            //item is not present in the cart lines of user;

            user_cart.cart_lines =[...user_cart.cart_lines,{...req.body,cart_line_id:uuidv4()}]
        
        let filterCart = allCarts.filter((item)=>{ //filtering the data so to avoid the duplication of carts due to fs module rewrite;
          return item.cart_id != cart_id;
        })

            let newModifiedCart = JSON.stringify([...filterCart,user_cart],null,2);//merging the existing carts with new modified cart;
        //console.log(newModifiedCart)
        fs.writeFile(path.join(__dirname, "../data")+ "/cart.json",
        newModifiedCart,
          (err) => {
            if (err) throw new Error(err);
            //console.log("Data written to file");
          }
        );
        replyer("Item added to cart successfully");
          }
        }
        
      }
    })
    function replyer(data){
      return reply.code(201).send({status:data})
    }
    
  }catch(err){
    return reply.code(400).send(err);
  }
}

function deleteCartLine(req, reply){
  try{
    let {cart_id,cart_line_id} = req.params;
    fs.readFile(path.join(__dirname, "../data")+ "/cart.json","utf-8",(err, data)=>{
      if(err) throw new Error(err);
      else{
        data = JSON.parse(data);
        let userCart = data.filter((item)=>{ //getting that cart in which we need to delete that  cartline given in request;
          return item.cart_id == cart_id;
        })
        userCart = userCart[0] //getting the exact cart;

        //console.log(userCart,cart_line_id);

        let deletedCart = userCart.cart_lines.filter((item)=>{
           return item.cart_line_id != cart_line_id
        })

        userCart.cart_lines = deletedCart;
        //filter the cart to avoid duplication of the same cart;

        let allCarts = data.filter((item)=>{
          return item.cart_id != cart_id;
        })

        //now merging the all carts with our current user cart as fs will rewrite the whole database;

        let modifiedCartDatas = JSON.stringify([...allCarts,userCart],null,2);

        fs.writeFile(path.join(__dirname, "../data")+ "/cart.json",
        modifiedCartDatas,
          (err) => {
            if (err) throw new Error(err);
            //console.log("Data written to file");
          }
        );
      }
    })

    return reply.code(200).send({status:"deleteCartLine"});
  }catch(err){
    return reply.code(400).send(err);
  }
}

function updateQuantity(req,reply){
  try{

    fs.readFile(path.join(__dirname, "../data") + "/cart.json" , "utf-8" ,(err, data) =>{

      if(err) throw new Error(err);

      data = JSON.parse(data);

      let {cart_id,cart_line_id} = req.params;

      let {quantity} = req.body 

      let requiredCart = data.filter((item)=>{
        return item.cart_id == cart_id;
      })

      if(requiredCart.length == 0) return replyer(400,"Cart not found")

      requiredCart = requiredCart[0];

      let updatedCart = requiredCart.cart_lines.map((item)=>{ //filtering the cart and then updating its quantity;

          if(item.cart_line_id == cart_line_id) item.quantity.quantity_number = quantity.quantity_number;
            
           return item;
        
      })

      requiredCart.cart_lines = updatedCart; //assigning the updated cart with new quantity ;
      
      let allCarts = data.filter((item)=>{
        return item.cart_id != cart_id;
      })

      let modifiedCartDatas = JSON.stringify([...allCarts,requiredCart],null,2);

      fs.writeFile(path.join(__dirname, "../data")+ "/cart.json",
      modifiedCartDatas,
        (err) => {
          if (err) throw new Error(err);
          //console.log("Data written to file");
        }
      );

      replyer(200,"Quantity updated successfully");
    })
    function replyer(code,message){
      return reply.code(code).send({status:message})
    }
    
  }catch(err){
    return reply.code(400).send(err);
  }
}

function getCartDetails(req,reply){
  try{
    let {cart_id} = req.params;

    //will find that cart using cart_id;

    fs.readFile(path.join(__dirname, "../data")+ "/cart.json","utf-8",(err, data) =>{

      if(err) throw new Error(err);
      else{

        data = JSON.parse(data);

        let requiredCart = data.filter((item)=>{
          return item.cart_id == cart_id;
        })

        if(requiredCart.length == 0) return replyer(400,"Cart not found");

        requiredCart = requiredCart[0];

        //console.log(requiredCart);

        let total_quantity=0
        let cent_amount =0;

        let total_items=  requiredCart.cart_lines.length;

        requiredCart.cart_lines.forEach((item)=>{ //calculating the total cent_amount and total quantity;
          total_quantity += item.quantity.quantity_number;
          cent_amount += item.unit_price.cent_amount * item.quantity.quantity_number ;
        })

        let response ={
          cart_id:requiredCart.cart_id,
          order_number:requiredCart.order_number,
          total_quantity:total_quantity,
          total_items:total_items,
          cart_lines:requiredCart.cart_lines,
          totals:[
            {
              type:"GRAND_TOTAL",
              price:{
                cent_amount:cent_amount,
                currency:"INR",
                fraction:100
              }
            }
          ]

        }

        replyer(200,response)

      }
    })

    function replyer(code,message){
      return reply.code(code).send(message)
    }
  }catch(err){
    return reply.code(400).send(err);
  }
}

module.exports = { generateCart,addCartLine,deleteCartLine,updateQuantity,getCartDetails};