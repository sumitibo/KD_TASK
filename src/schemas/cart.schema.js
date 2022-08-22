const cart_line = {
  type: "object",
  properties: {
    quantity: {
      type: "object",
      properties: {
        quantity_number: {
          type: "integer",
          minimum: 1,
        },
      },
    },
    item:{
      type: "object",
      properties: {
        offer_id: { type: "string" }
      }
    },
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
      required:["cent_amount", "currency","fraction"],
    },
  },
  required:["quantity", "item", "unit_price"]
};

const new_cart_schema = {
  params: {
    type: "object",
    properties: {
      id: {
        type: "string",
        minLength: 1,
      },
    },
    required: ["id"],
  },
  response: {
    201: {
      type: "object",
      properties: {
        cart_id: { type: "string", format: "uuid" },
        order_number: { type: "string" },
        user_id: { type: "string" },
        status:{type:'string'}
      },
    },
  },
};

const add_cart_line = {
  params: {
    type: "object",
    properties: {
      cart_id: {
        type: "string",
        // format: "uuid",
      },
    },
    required: ["cart_id"],
  },
  // body: cart_line,
  // response: {
  //   201: {
  //     type: "object",
  //     properties: {
  //       cart_id: { type: "string", format: "uuid" },
  //       order_number: { type: "string" },
  //       user_id: { type: "string" },
  //       status:{type:'string'}
  //     },
  //   },
  // },
};

module.exports = { new_cart_schema , add_cart_line};
