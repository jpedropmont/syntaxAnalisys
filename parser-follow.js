/* 
    Nós:
    S → AB
    A → aA | a | 0
    B → bB | c

    Expressão passada:
    S->AB:A->aA|a|0:B->bB|c


    Exemplos:
    S->ABCDE:A->a|0:B->b|0:C->c:D->d|0:E->e|0
    S->Bb|Cd:B->aB|0:C->cC|0
    S->B|Cd:B->aB|0:C->cC|0
*/

function follow() {
  const gramatic = document.getElementById("follow").value.replace(/ /g, "");

  let nodes = retriveFollowNodes(gramatic);

  let mainExpression = nodes[0].expression;

  // Marking positions of the variables in the main expression
  for (var i = 1; i < nodes.length; i++) {
    for (var j = 0; j < mainExpression.length; j++) {
      if (mainExpression[j] === nodes[i].variable) {
        nodes[i].positions.push(j);
      }
    }
  }

  for (var i = 1; i < nodes.length; i++) {
    for (let position of nodes[i].positions) {
      let count = position + 1;
      let nextElement = mainExpression[count];
      while (true) {
        if (type(nextElement) === "Variable") {
          let pointedNode = nodes.find((node) => node.variable === nextElement);
          let pointedNodeElements = pointedNode.expression.split("|");
          if (pointedNodeElements.indexOf("0") !== -1) {
            nodes[i].followers = nodes[i].followers.concat(pointedNodeElements);
            count += 1;
            nextElement = mainExpression[count];
          } else {
            nodes[i].followers = nodes[i].followers.concat(pointedNodeElements);
            break;
          }
        } else if (type(nextElement) === "Terminal Symbol") {
          nodes[i].followers.push(nextElement);
          nodes[i].followers = nodes[i].followers.filter(
            (element) => element !== "0"
          );
          break;
        } else {
          nodes[i].followers.push("$");
          break;
        }
      }

      if (count !== nodes.length - 1) {
        nodes[i].followers = nodes[i].followers.filter(
          (element) => element !== "0"
        );
      }
    }

    nodes[i].followers = [...new Set(nodes[i].followers)];
    for (var x = 0; x < nodes[i].followers.length; x++) {
      if (nodes[i].followers[x] === "0") {
        nodes[i].followers[x] = "$";
      }
    }
    nodes[i].followers = nodes[i].followers.sort();
  }

  console.log("FOLLOW");
  for (let node of nodes) {
    node.followers = [...new Set(node.followers)];
    console.log(node.variable + " = " + node.followers);
  }
  console.log("=========================");
}

function type(char) {
  if (char !== undefined) {
    if (char.match(/[A-Z]/)) {
      return "Variable";
    } else if (char === "0") {
      return "Epslon";
    } else if (char.match(/[a-z]/)) {
      return "Terminal Symbol";
    } else {
      return "Symbol";
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
      positions: [],
    });
    i++;
  }

  return nodes;
}
