// // const data = require('../data/users.json');
// // console.log(data.users);

// const fs = require("fs");

// // fs.readFile("../data/users.json", "utf-8", function (err, users) {
// //   if (err) {
// //     console.log(err);
// //   } else {
// //     try {
// //       const data = JSON.parse(users);
// //       console.log(data.users);
// //     } catch (err) {
// //       console.log(err, "Error parsing users.json");
// //     }
// //   }
// // });

// let newer = {
//   id: 2,
//   name: "Sumit Doe",
//   email: "john.doe@example.com",
//   avatar: "https://example.com/avatar.png",
//   phone: "123-456-1234",
//   active: true,
//   cart_id: null,
//   cart_active: false,
// };
// function saver() {
//   let newSaver = [];
//   fs.readFile("../data/users.json", "utf-8", function (err, users) {
//     if (err) {
//       console.log(err);
//     } else {
//       try {
//         const data = JSON.parse(users);
//         newSaver = [...data, newer];
//         fs.writeFile(
//           "../data/users.json",
//           JSON.stringify(newSaver, null, 2),
//           (err) => {
//             if (err) {
//               console.log(err);
//             } else {
//               console.log("File saved successfully");
//             }
//           }
//         );
//       } catch (err) {
//         console.log(err, "Error parsing users.json");
//       }
//     }
//   });

//   // fs.writeFile("../data/users.json",JSON.stringify(newer,null,2),err =>{
//   //     if(err) {
//   //         console.log(err);
//   //     }else{
//   //         console.log("File saved successfully");
//   //     }
//   // })
// }
// saver();
const {generateCart} = require('../controllers/cart.controller');
const create_new_cart = {
  schema:{
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
        200:{
          type:"object",
          properties:{
            token:{type:"string"}
          }
        },
        201:{
          type:"object",
          properties:{
            token:{type:"string"}
          }
        },
        400:{
          type:"object",
          properties:{
            error:{type:"string"}
          }
        }
      }
  },
  handler:generateCart
}

module.exports ={create_new_cart}