var firsts = function first(gramatic) {
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

  for (let node of nodes) {
    node.firsts = node.firsts.sort();
  }
  return nodes;
};

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
      line: nodeTemp,
      firsts: [],
    });
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

module.exports = firsts;
