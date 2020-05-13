/* 
    Nós:
    S → A | B
    A → aA | a
    B → bB | c

    Expressão passada:
    S->A|B:A->aA|a:B->bB|c
  */

function parse() {
  const gramatic = document.getElementById("input").value.replace(/ /g, "");

  let nodes = retrieveNodes(gramatic);

  for (let node of nodes) {
    for (var i = 0; i < node.possibleFirstElements.length; i++) {
      console.log(node.possibleFirstElements.length);
      while (true) {
        if (isVariable(node.possibleFirstElements[i])) {
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
        } else {
          node.terminalSymbols.push(node.possibleFirstElements[i]);
          break;
        }
      }
    }
  }

  console.log(nodes);
}

function isVariable(char) {
  return char === char.toUpperCase() ? true : false;
}

function getPossibleFirstElements(node) {
  let possibleFirstElements = [];

  possibleFirstElements.push(node.split("->")[1][0]).toString();

  if (node.includes("|")) {
    possibleFirstElements.push(node[node.indexOf("|") + 1]).toString();
  }

  if (node.includes("E")) {
    possibleFirstElements.push("E").toString();
  }

  // Turning into a distinct array
  possibleFirstElements = possibleFirstElements.filter(
    (item, i, ar) => ar.indexOf(item) === i
  );

  return possibleFirstElements;
}

function retrieveNodes(gramatic) {
  let nodes = [];
  let nodesTemp = gramatic.split(":");

  for (let nodeTemp of nodesTemp) {
    nodes.push({
      variable: nodeTemp[0],
      possibleFirstElements: getPossibleFirstElements(nodeTemp),
      terminalSymbols: [],
    });
  }

  return nodes;
}
