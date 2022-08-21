const cart_line = {
  type: "object",
  properties: {
    quantity: {
      type: "integer",
      minimum: 1,
    },
    offer_id: { type: "string" },
    unit_price: {
      type: "object",
      properties: {
        cent_amount: { type: "integer" },
        currency: {
          type: "string",
          enum: ["INR"],
        },
        fraction: { type: "integer" },
      },
    },
  },
};

const new_cart_schema = {
  params: {
    type: "object",
    properties: {
      user_id: {
        type: "string",
        minLength: 1,
      },
    },
    required: ["user_id"],
  },
  body: cart_line,
  // response: {
  //   201: {
  //     type: "object",
  //     properties: {
  //       cart_id: { type: "string", format: "uuid" },
  //       order_number: { type: "string" },
  //       user_id: { type: "string" },
  //     },
  //   },
  // },
};

module.exports = { new_cart_schema };
