/* 
    Nodes:
    S → ABCDE
    A → a|0
    B → b|0
    C → c
    D → d|0
    E → e|0
    
    Examples:
    S->ABCDE:A->a|0:B->b|0:C->c:D->d|0:E->e|0
    S->Bb|Cd:B->aB|0:C->cC|0
    S->B|Cd:B->aB|0:C->cC|0
*/

function print() {
  console.log("FIRSTS");
  const firsts = first();
  for (let first of firsts) {
    console.log(first.variable + " = " + first.firsts);
  }
  console.log("===================");
  console.log("FOLLOW");
  const followers = follow();
  for (let follow of followers) {
    console.log(follow.variable + " = " + follow.followers);
  }
  console.log("===================");
  console.log("");
}

function follow() {
  const gramatic = document
    .getElementById("expression")
    .value.replace(/ /g, "");
  let nodes = retriveFollowNodes(gramatic);
  let firsts = first();

  for (var i = 0; i < nodes.length; i++) {
    for (var j = 0; j < nodes.length; j++) {
      if (i !== j) {
        for (var x = 0; x < nodes[j].expression.length; x++) {
          if (nodes[i].variable === nodes[j].expression[x]) {
            let count = 1;
            let nextElement = nodes[j].expression[x + count];
            while (true) {
              if (type(nextElement) === "Variable") {
                let firstsOfNextElement = findFirstExpression(
                  nextElement,
                  firsts
                );
                if (firstsOfNextElement.indexOf("0") !== -1) {
                  let tempFirstsOfNextElement = firstsOfNextElement.filter(
                    (element) => element !== "0"
                  );
                  nodes[i].followers = nodes[i].followers.concat(
                    tempFirstsOfNextElement
                  );
                  count += 1;
                  nextElement = nodes[j].expression[x + count];
                } else {
                  nodes[i].followers = nodes[i].followers.concat(
                    firstsOfNextElement
                  );
                  break;
                }
              } else if (type(nextElement) === "Terminal Symbol") {
                nodes[i].followers.push(nextElement);
                break;
              } else {
                nodes[i].followers.push("$");
                break;
              }
            }
          }
        }
      }
    }
  }

  return nodes;
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

function findFirstExpression(element, firsts) {
  let returnableNode;
  for (let first of firsts) {
    if (first.variable === element) {
      returnableNode = first.firsts;
    }
  }
  return returnableNode;
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

function first() {
  const gramatic = document
    .getElementById("expression")
    .value.replace(/ /g, "");

  let nodes = retrieveFirstNodes(gramatic);

  for (let node of nodes) {
    let indexOflastIteratedVariable = 0;
    let hadReplacement = false;
    for (var i = 0; i < node.possibleFirstElements.length; i++) {
      while (true) {
        if (
          typeOfPossibleFirstElement(node.possibleFirstElements[i]) ===
          "Variable"
        ) {
          let found = nodes.find(
            (element) => element.variable === node.possibleFirstElements[i]
          );
          node.possibleFirstElements = node.possibleFirstElements.filter(
            (possibleFirstElement) =>
              possibleFirstElement !== node.possibleFirstElements[i]
          );
          node.possibleFirstElements = node.possibleFirstElements.concat(
            found.possibleFirstElements
          );
          hadReplacement = true;
        } else if (
          typeOfPossibleFirstElement(node.possibleFirstElements[i]) === "Epslon"
        ) {
          if (hadReplacement) {
            if (
              node.expression[indexOflastIteratedVariable + 1].match(/[A-Z]/)
            ) {
              ++indexOflastIteratedVariable;
              node.possibleFirstElements.push(
                node.expression[indexOflastIteratedVariable]
              );
            }
          }
          node.firsts.push("0");
          i++;
        } else {
          node.firsts.push(node.possibleFirstElements[i]);
          break;
        }
      }
    }

    // Making values of firsts unique.
    node.firsts = [...new Set(node.firsts)];

    var index = node.firsts.indexOf(undefined);
    if (index !== -1) node.firsts.splice(index, 1);

    if (hadReplacement) {
      if (node.possibleFirstElements[node.length - 1] !== "0") {
        node.firsts = node.firsts.filter(
          (terminalSymbol) => terminalSymbol !== "0"
        );
      }
    }
  }

  /* console.log("FIRST"); */
  for (let node of nodes) {
    node.firsts = node.firsts.sort();
    /* console.log(node.variable + " = " + node.firsts); */
  }
  /* console.log("==============================="); */
  return nodes;
}

function typeOfPossibleFirstElement(char) {
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

function getPossibleFirstElements(node) {
  let possibleFirstElements = [];

  possibleFirstElements.push(node.split("->")[1][0]).toString();

  for (var i = 0; i < node.length; i++) {
    if (node[i] === "|") {
      possibleFirstElements.push(node[i + 1]).toString();
    } else if (node[i] === "0") {
      if (node[i + 1] !== undefined) {
        if (node[i + 1].match(/[A-Z]/)) possibleFirstElements.push(node[i + 1]);
      }
      possibleFirstElements.push("0");
    }
  }
  possibleFirstElements = [...new Set(possibleFirstElements)];

  return possibleFirstElements;
}

function retrieveFirstNodes(gramatic) {
  let nodes = [];
  let nodesTemp = gramatic.split(":");

  for (let nodeTemp of nodesTemp) {
    nodes.push({
      variable: nodeTemp[0],
      expression: nodeTemp.split("->")[1],
      possibleFirstElements: getPossibleFirstElements(nodeTemp),
      firsts: [],
    });
  }

  return nodes;
}
