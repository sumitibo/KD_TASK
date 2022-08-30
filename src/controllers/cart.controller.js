async function generateCart(req, reply) {
  try {
    const { user_id } = req.body; //getting the user_id;

    let { cart_lines } = req.body; //getting the cart_lines;

    cart_lines = cart_lines?.[0];

    let userCartActive = await this.knex("cart").where("user_id", user_id);

    //finding the user cart already exists or not

    //if exists then we will not create a new cart;

    if (userCartActive.length > 0)
      return reply.code(200).send({ cart_id: userCartActive[0].cart_id });

    let data;
    let newcart = {
      user_id,
      order_number: Math.floor(Math.random() * 1000000000),
    };

    if (!cart_lines) {
      //if user cart not exists then we will create a new cart;
      const trx = await this.knex.transaction();

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
        });
      } catch (err) {
        await trx.rollback();
        throw err;
      }
    } else {
      const trx = await this.knex.transaction();
      try {
        data = await trx
          .insert(newcart)
          .into("cart")
          .returning(["cart_id", "order_number"]);

        data = await data[0];

        let cartLineData = {
          cart_id: data.cart_id,
          quantity_number: Number(cart_lines.quantity.quantity_number),
          offer_id: cart_lines.item.offer_id,
          cent_amount: cart_lines.unit_price.cent_amount,
          fraction: cart_lines.unit_price.fraction,
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
        throw err;
      }
    }
  } catch (err) {
    return reply.code(400).send(err);
  }
}

async function addCartLine(req, reply) {
  try {
    const cart_lines = req.body;
    //console.log(cart_lines,"Entered to route");
    const { cart_id } = req.params;

    const cartCheck = await this.knex("cart").where("cart_id", cart_id);

    if (cartCheck.length === 0)
      return reply.code(404).send({ status: "Cart not found" });
    const trx = await this.knex.transaction();
    try {
      //checking if product already exits in cart then only increase the quanity by 1 ;

      let productCheck = await trx
        .select()
        .where({ cart_id: cart_id, offer_id: cart_lines.item.offer_id })
        .into("cartline");

      if (productCheck.length > 0) {
        await trx
          .where({ cart_id: cart_id, offer_id: cart_lines.item.offer_id })
          .into("cartline")
          .update({
            quantity_number:
              Number(productCheck[0].quantity_number) +
              cart_lines.quantity.quantity_number,
          });

        await trx.commit();
      } else {
        //console.log("entered to else")
        let cartLineData = {
          cart_id,
          quantity_number: cart_lines.quantity.quantity_number,
          offer_id: cart_lines.item.offer_id,
          cent_amount: cart_lines.unit_price.cent_amount,
          fraction: cart_lines.unit_price.fraction,
        };
        await trx.insert(cartLineData).into("cartline");
        await trx.commit();
      }

      return reply.code(201).send({
        status: "Item added to cart successfully",
      });
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  } catch (err) {
    return reply.code(400).send(err);
  }
}

async function deleteCartLine(req, reply) {
  try {
    const { cart_id, cart_line_id } = req.params;
    const trx = await this.knex.transaction();
    try {
      let res = await trx
        .where({ cart_id: cart_id, cart_line_id: cart_line_id })
        .into("cartline")
        .del();
      console.log(res);
      await trx.commit();

      if (res === 0) return reply.code(409).send();

      return reply.code(204).send();
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  } catch (err) {
    return reply.code(400).send(err);
  }
}

async function updateQuantity(req, reply) {
  try {
    const { cart_id, cart_line_id } = req.params;
    const { quantity } = req.body;
    const trx = await this.knex.transaction();
    try {
      let res = await trx
        .where({ cart_id: cart_id, cart_line_id: cart_line_id })
        .into("cartline")
        .update({ quantity_number: quantity.quantity_number });

      await trx.commit();

      if (res === 0) return reply.code(409).send();

      return reply.code(204).send();
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  } catch (err) {
    return reply.code(400).send(err);
  }
}

async function getCartDetails(req, reply) {
  try {
    const { cart_id } = req.params;

    // const query = await this.knex("cartline").select('cart_line_id','offer_id','quantity_number','cent_amount').
    // where('cart_id',cart_id);

    const query = await this.knex
      .select(
        "cart.cart_id",
        "cart.order_number",
        "cartline.cart_line_id",
        "quantity_number",
        "cent_amount",
        "fraction",
        "offer_id"
      )
      .from("cart")
      .leftJoin("cartline", "cart.cart_id", "=", "cartline.cart_id")
      .where("cart.cart_id", cart_id);
    console.log(query);
    const order_number = query[0].order_number;

    //Performing operation to calculate some datas;

    let total_quantity = 0;
    let total_items = query[0].cart_line_id?query.length:0;
    let total_cent_amount = 0;

    //if not cart lines exist

    if (!query[0].cart_line_id)
      return reply
        .code(200)
        .send({ cart_id, order_number, total_quantity, total_items,cart_lines:[],totals: [
          {
            type: "GRAND_TOTAL",
            price: {
              cent_amount: total_cent_amount,
              currency: "INR",
              fraction: 10000,
            },
          },
        ],});

      //if cart_lines exists and contains cart lines then calculate all the mentioned data in format;

    let formattedData = query.map((item) => {
      total_quantity += item.quantity_number;
      let unitAmount = item.cent_amount / item.fraction;
      let cartLineAmount = item.quantity_number * unitAmount;
      total_cent_amount += cartLineAmount;
      return {
        cart_line_id: item.cart_line_id,
        unit_price: {
          cent_amount: item.cent_amount,
          currency: "INR",
          fraction: item.fraction,
        },
        quantity: {
          quantity_number: item.quantity_number,
        },
        item: {
          offer_id: item.offer_id,
        },
      };
    });

    let response = {
      cart_id,
      order_number,
      total_quantity,
      total_items,
      cart_lines: formattedData,
      totals: [
        {
          type: "GRAND_TOTAL",
          price: {
            cent_amount: total_cent_amount,
            currency: "INR",
            fraction: 10000,
          },
        },
      ],
    };
    //console.log(query);
    return reply.code(200).send(response);
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
