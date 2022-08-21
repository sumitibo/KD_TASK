const new_cart_schema ={
    params: {
      type:"object",
      properties:{
        user_id:{
          type:"string",
          minLength:1
        }
      }
    },
  
}

module.exports ={new_cart_schema}