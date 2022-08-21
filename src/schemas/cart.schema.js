const new_cart_schema ={
    params: {
      type:"object",
      properties:{
        user_id:{
          type:"string",
          minLength:5
        }
      }
    },
    response:{
      201:{
        type:"object",
        properties:{
          order_number:{type:"string"},
          data:{
            type:"object",
          }
        }
      },
    //   400:{
    //     type:"object",
    //     properties:{
    //       error:{type:"string"}
    //     }
    //   }
    }
}

module.exports ={new_cart_schema}