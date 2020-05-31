/* 
    Nós:
    S → AB
    A → aA | a | 0
    B → bB | c

    Expressão passada:
    S->AB:A->aA|a|0:B->bB|c


    Exemplos:
    S->ABCDE:A->a|0:B->b|0:C->c:D->d|0:E->e|0
*/

function follow() {
  const gramatic = document.getElementById("follow").value.replace(/ /g, "");

  let nodes = retriveFollowNodes(gramatic);

  let mainExpression = nodes[0].expression;

  for (var i = 0; i < mainExpression.length; i++) {
    if (typeOfElement(mainExpression[i]) === "Variable") {
      let pointedNode = nodes.find(
        (node) => node.variable === mainExpression[i]
      );
      pointedNode = pointedNode.followers.concat(mainExpression[i + 1]);
    } else if (typeOfElement(mainExpression[i]) === "Terminal Symbol") {
      console.log("Terminal Symbol");
    } else if (typeOfElement(mainExpression[i]) === "Epslon") {
      console.log("Epslon");
    } else {
      console.log("Undefined");
    }
  }

  console.log("=======");

  console.log(nodes);
}

function typeOfElement(char) {
  if (char !== undefined) {
    if (char.match(/[A-Z]/)) {
      return "Variable";
    } else if (char === "0") {
      return "Epslon";
    } else {
      return "Terminal Symbol";
    }
  } else {
    return "Undefined";
  }
}

function retriveFollowNodes(gramatic) {
  let nodes = [];
  let nodesTemp = gramatic.split(":");

  var i = 0;

  while (i < nodesTemp.length) {
    nodes.push({
      variable: nodesTemp[i][0],
      expression: nodesTemp[i].split("->")[1],
      followers: i === 0 ? ["$"] : [],
    });
    i++;
  }

  return nodes;
}
