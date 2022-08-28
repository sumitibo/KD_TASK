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
    item: {
      type: "object",
      properties: {
        offer_id: { type: "string" },
      },
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
      required: ["cent_amount", "currency", "fraction"],
    },
  },
  required: ["quantity", "item", "unit_price"],
};
//creating new cart
const new_cart_schema = {
  // params: {
  //   type: "object",
  //   properties: {
  //     id: {
  //       type: "string",
  //       minLength: 1,
  //     },
  //   },
  //   required: ["id"],
  // },
  body: {
    type: "object",
    properties: {
      user_id: { type: "string", minLength: 1 },
      cart_lines: { type: "array", items: cart_line },
    },
    required: ["user_id"],
  },
  response: {
    201: {
      type: "object",
      properties: {
        cart_id: { type: "string", format: "uuid" },
        order_number: { type: "string" },
        status: { type: "string" },
        cart_lines:{type:'array'}
      },
    },
  },
};
//adding cart_line to cart_lines
const add_cart_line = {
  params: {
    type: "object",
    properties: {
      cart_id: {
        type: "string",
        format: "uuid",
      },
    },
    required: ["cart_id"],
  },
  body: cart_line,
  response: {
    201: {
      type: "object",
      properties: {
        status: { type: "string" },
      },
    },
  },
};
//delete cart_line
const delete_cart_line = {
  params: {
    type: "object",
    properties: {
      cart_id: {
        type: "string",
        format: "uuid",
      },
      cart_line_id: {
        type: "string",
        format: "uuid",
      },
    },
    required: ["cart_id", "cart_line_id"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "string" },
      },
    },
  },
};
//update quantity of cart_line
const update_cart_line = {
  params: {
    type: "object",
    properties: {
      cart_id: {
        type: "string",
        format: "uuid",
      },
      cart_line_id: {
        type: "string",
        format: "uuid",
      },
    },
    required: ["cart_id", "cart_line_id"],
  },
  body: {
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
        required: ["quantity_number"],
      },
    },
    required: ["quantity"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "string" },
      },
    },
  },
};
//get the specific cart customised details;
const get_cart_detail = {
  params: {
    type: "object",
    properties: {
      cart_id: {
        type: "string",
        format: "uuid",
      },
    },
    required: ["cart_id"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        cart_id: { type: "string" },
        order_number: { type: "string" },
        total_quantity: { type: "integer" },
        total_items: { type: "integer" },
        cart_lines: { type: "array", items: cart_line },
        totals: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              price: {
                type: "object",
                properties: {
                  cent_amount: { type: "integer" },
                  currency: { type: "string" },
                  fraction: { type: "integer" },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = {
  new_cart_schema,
  add_cart_line,
  delete_cart_line,
  update_cart_line,
  get_cart_detail,
};
