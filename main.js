/*
  Examples of gramatics:
    S->ABCDE:A->a|0:B->b|0:C->c:D->d|0:E->e|0
    S->AB:A->aA|a:B->bB|b
*/

var input = require("./input");
var nodesFirsts = require("./first")(input);
var nodesFollowers = require("./follow")(input);
var table = require("./table")(input);

console.log("==========================================");
console.log("Firsts");
for (let nodeFirst of nodesFirsts) {
  console.log(nodeFirst.variable + " - " + nodeFirst.firsts);
}
console.log("==========================================");

console.log("Followers");
for (let nodeFollower of nodesFollowers) {
  console.log(nodeFollower.variable + " - " + nodeFollower.followers);
}
console.log("==========================================");

console.log("Preditive Syntatic Table");
console.table(table);
