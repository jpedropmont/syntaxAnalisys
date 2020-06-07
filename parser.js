/* 
    Example of Nodes:
    S → ABCDE
    A → a|0
    B → b|0
    C → c
    D → d|0
    E → e|0
    
    Examples of Gramatics:
    S->ABCDE:A->a|0:B->b|0:C->c:D->d|0:E->e|0
    S->Bb|Cd:B->aB|0:C->cC|0
    S->B|Cd:B->aB|0:C->cC|0
    S->cAa:A->cB|B:B->bcB|0
*/

/* function makePredictiveSyntacticTable() {
  const gramatic = document
    .getElementById("expression")
    .value.replace(/ /g, "");
  let productions = retrieveProductions(gramatic);
  let information = tableInformation(gramatic);

  var row = information[0].length + 1;
  var column = information[1].length + 2;
  var f = new Array();

  for (i = 0; i < row; i++) {
    f[i] = new Array();
    for (j = 0; j < column; j++) {
      if (i === 0 && j > 0) {
        f[i][j] = information[1][j - 1];
      } else if (j === 0 && i > 0) {
        f[i][j] = information[0][i - 1];
      } else {
        f[i][j] = 0;
      }
    }
  }

  f[0][column - 1] = "$";
  f[0][0] = null;

  let firsts = first();

  for (let production of productions) {
  }

  console.table(f);
}

function tableInformation(gramatic) {
  let information = [];
  let variables = [];
  let terminalSymbols = [];

  for (let element of gramatic) {
    if (element.match(/[A-Z]/)) {
      variables.push(element);
    } else if (element.match(/[a-z]/)) {
      terminalSymbols.push(element);
    }
  }

  variables = [...new Set(variables)];
  terminalSymbols = [...new Set(terminalSymbols)];
  terminalSymbols = terminalSymbols.sort();

  information.push(variables);
  information.push(terminalSymbols);

  return information;
}

function retrieveProductions(gramatic) {
  let productions = [];
  let productionsTemp = gramatic.split(":");

  for (var i = 0; i < productionsTemp.length; i++) {
    if (productionsTemp[i].indexOf("|") !== -1) {
      let variable = productionsTemp[i][0];
      let p = productionsTemp[i].split("->")[1].split("|");
      for (var j = 0; j < p.length; j++) {
        productions.push(variable + "->" + p[j]);
      }
    } else {
      productions.push(productionsTemp[i]);
    }
  }

  return productions;
} */

function print() {
  const gramatic = document
    .getElementById("expression")
    .value.replace(/ /g, "");
  //makePredictiveSyntacticTable();
  console.log("FIRSTS");
  const firsts = first(gramatic);
  for (let first of firsts) {
    console.log(first.variable + " = " + first.firsts);
  }
  console.log("===================");
  console.log("FOLLOW");
  const followers = follow(gramatic);
  for (let follow of followers) {
    console.log(follow.variable + " = " + follow.followers);
  }
  console.log("===================");
  console.log("");
}

function follow(gramatic) {
  let nodes = retriveFollowNodes(gramatic);
  let firsts = first(gramatic);

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
                nodes[i].followers = nodes[i].followers.concat(
                  nodes[j].followers
                );
                break;
              }
            }
          }
        }
      }
    }
  }

  for (let node of nodes) {
    node.followers = [...new Set(node.followers)];
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
      return "Else";
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

function first(gramatic) {
  let nodes = retrieveFirstNodes(gramatic);

  for (let node of nodes) {
    let indexOflastIteratedVariable = 0;
    let hadReplacement = false;
    for (var i = 0; i < node.possibleFirstElements.length; i++) {
      while (true) {
        if (type(node.possibleFirstElements[i]) === "Variable") {
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
        } else if (type(node.possibleFirstElements[i]) === "Epslon") {
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
