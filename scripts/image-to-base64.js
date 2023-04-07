const fs = require("fs");

const base64Encode = file => {
  const bitmap = fs.readFileSync(file);

  return Buffer.from(bitmap).toString("base64");
};

console.log("result : ", base64Encode("./the_hunger_games.jpeg"));
