async function generateCart(req, reply) {
  try {
    const { user_id } = req.body; //getting the user_id;

    let { cart_lines } = req.body; //getting the cart_lines;

    cart_lines = cart_lines?.[0];

    let userCartActive = await this.knex("cart").where("user_id", user_id);

    //finding the user cart already exists or not

    //if exists then we will not create a new cart;

    if (userCartActive.length > 0)
      return reply.code(200).send({ status: "Cart already exists" });

    let data;
    let newcart = {
      user_id,
      order_number: Math.floor(Math.random() * 1000000000),
    };

    if (!cart_lines) {
      //if user cart not exists then we will create a new cart;
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
            cart_lines: [],
            status: "Cart created successfully",
          });
        } catch (err) {
          //if insertion at any point gets fail,we will be in catch block;

          await trx.rollback();
        }
      });
    } else {
      await this.knex.transaction(async function (trx) {
        try {
          data = await trx
            .insert(newcart)
            .into("cart")
            .returning(["cart_id", "order_number"]);

          data = await data[0];

          let cartLineData = {
            cart_id: data.cart_id,
            quantity_number: cart_lines.quantity.quantity_number,
            offer_id: cart_lines.item.offer_id,
            cent_amount: cart_lines.unit_price.cent_amount,
          };
          let cartRes = await trx
            .insert(cartLineData)
            .into("cartline")
            .returning([
              "cart_line_id",
              "quantity_number",
              "offer_id",
              "cent_amount",
              "fraction",
              "currency",
            ]);

          cartRes = await cartRes[0];

          await trx.commit();

          return reply.code(201).send({
            cart_id: data.cart_id,
            order_number: data.order_number,
            status: "Cart created successfully",
            cart_lines: [
              {
                cart_line_id: cartRes.cart_line_id,
                quantity: {
                  quantity_number: cartRes.quantity_number,
                },
                item: {
                  offer_id: cartRes.offer_id,
                },
                unit_price: {
                  cent_amount: cartRes.cent_amount,
                  currency: cartRes.currency,
                  fraction: cartRes.fraction,
                },
              },
            ],
          });
        } catch (err) {
          await trx.rollback();
        }
      });
    }
  } catch (err) {
    return reply.code(400).send(err);
  }
}

async function addCartLine(req, reply) {
  try {
    let cart_lines = req.body;

    let { cart_id } = req.params;

    let cartCheck = await this.knex("cart").where("cart_id", cart_id);

    if (cartCheck.length === 0)
      return reply.code(404).send({ status: "Cart not found" });

    await this.knex.transaction(async function (trx) {
      try {
        //checking if product already exits in cart then only increase the quanity by 1 ;

        let productCheck = await trx
          .select()
          .where("cart_id", cart_id)
          .andWhere("offer_id", cart_lines.item.offer_id)
          .into("cartline");

        if (productCheck.length > 0) {
          await trx
            .where("cart_id", cart_id)
            .andWhere("offer_id", cart_lines.item.offer_id)
            .into("cartline")
            .update({ quantity_number: productCheck[0].quantity_number + 1 });

          await trx.commit();
        } else {
          let cartLineData = {
            cart_id,
            quantity_number: cart_lines.quantity.quantity_number,
            offer_id: cart_lines.item.offer_id,
            cent_amount: cart_lines.unit_price.cent_amount,
          };
          await trx.insert(cartLineData).into("cartline");
          await trx.commit();
        }

        return reply.code(201).send({
          status: "Item added to cart successfully",
        });
      } catch (err) {
        await trx.rollback();
      }
    });
  } catch (err) {
    return reply.code(400).send(err);
  }
}

async function deleteCartLine(req, reply) {
  try {
    let { cart_id, cart_line_id } = req.params;

    await this.knex.transaction(async function (trx) {
      try {
        await trx
          .where("cart_id", cart_id)
          .andWhere("cart_line_id", cart_line_id)
          .into("cartline")
          .del();

        await trx.commit();

        return reply.code(204).send();
      } catch (err) {
        await trx.rollback();
      }
    });
  } catch (err) {
    return reply.code(400).send(err);
  }
}

async function updateQuantity(req, reply) {
  try {
    let { cart_id, cart_line_id } = req.params;
    let { quantity } = req.body;
    await this.knex.transaction(async function (trx) {
      try {
        await trx
          .where("cart_id", cart_id)
          .andWhere("cart_line_id", cart_line_id)
          .into("cartline")
          .update({ quantity_number: quantity.quantity_number });

        await trx.commit();

        return reply.code(200).send({ status: "Quanity updated successfully" });
      } catch (err) {
        await trx.rollback();
      }
    });
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
