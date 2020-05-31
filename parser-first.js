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

function first() {
  const gramatic = document.getElementById("first").value.replace(/ /g, "");

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
          node.firts.push("0");
          i++;
        } else {
          node.firts.push(node.possibleFirstElements[i]);
          break;
        }
      }
    }

    // Making values of firts unique.
    node.firts = [...new Set(node.firts)];

    var index = node.firts.indexOf(undefined);
    if (index !== -1) node.firts.splice(index, 1);

    if (hadReplacement) {
      if (node.possibleFirstElements[node.length - 1] !== "0") {
        node.firts = node.firts.filter(
          (terminalSymbol) => terminalSymbol !== "0"
        );
      }
    }
  }

  console.log("FIRST");
  for (let node of nodes) {
    console.log(node.variable + " = " + node.firts);
  }
  console.log("===============================");
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
      firts: [],
    });
  }

  return nodes;
}
