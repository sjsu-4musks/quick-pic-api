// const permutator = inputArr => {
//   const result = [];

//   const permute = (arr, m = []) => {
//     if (arr.length === 0) {
//       result.push(m);
//     } else {
//       for (let i = 0; i < arr.length; i++) {
//         const curr = arr.slice();
//         const next = curr.splice(i, 1);
//         permute(curr.slice(), m.concat(next));
//       }
//     }
//   };

//   permute(inputArr);

//   return result;
// };

// console.log(
//   "result : ",
//   permutator([
//     "TO KILL A",
//     "MOCKINGBIRD",
//     "WINNER",
//     "of the",
//     "PULITZER",
//     "PRIZE",
//     "HARPER LEE",
//     "MODERNCLASSICS"
//   ])
// );
