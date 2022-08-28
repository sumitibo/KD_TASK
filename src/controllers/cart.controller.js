const { default: knex } = require("knex");
const { v4: uuidv4 } = require("uuid");

async function generateCart(req, reply) {
  try {
    const { user_id } = req.body; //getting the user_id;

    const { cart_lines } = req.body; //getting the cart_lines;

    let userCartActive = await this.knex("cart").where("user_id", user_id);

    //finding the user cart already exists or not

    //if exists then we will not create a new cart;

    if (userCartActive.length > 0)
      return reply.code(200).send({ status: "Cart already exists" });

    let data;

    if (!cart_lines) {
    
      //if user cart not exists then we will create a new cart;

      let newcart = {
        user_id,
        order_number: Math.floor(Math.random() * 1000000000),
      };

      await this.knex.transaction(async function (trx) {
        try {
          data = await trx
            .insert(newcart)
            .into("cart")
            .returning(["order_number", "cart_id"]);

          //if insertion is successful we will come to this line,now we can commit ;
          data = await data[0];

          await trx.commit();

          //destructuring the returned data that's inserted;

          return reply.code(201).send({
            cart_id: data.cart_id,
            order_number: data.order_number,
            status: "Cart created successfully",
          });
        } catch (err) {
          //if insertion at any point gets fail,we will be in catch block;

          await trx.rollback();
        }
      });
    } else {
      console.log(cart_lines);
    }
  } catch (err) {
    return reply.code(400).send(err);
  }
}

function addCartLine(req, reply) {
  try {
  } catch (err) {
    return reply.code(400).send(err);
  }
}

function deleteCartLine(req, reply) {
  try {
  } catch (err) {
    return reply.code(400).send(err);
  }
}

function updateQuantity(req, reply) {
  try {
  } catch (err) {
    return reply.code(400).send(err);
  }
}

async function getCartDetails(req, reply) {
  try {
    const query = await this.knex("testing").select().from("testing");
    console.log(query);
    return reply.code(200).send(query.rows);
  } catch (err) {
    return reply.code(400).send(err);
  }
}

module.exports = {
  generateCart,
  addCartLine,
  deleteCartLine,
  updateQuantity,
  getCartDetails,
};
