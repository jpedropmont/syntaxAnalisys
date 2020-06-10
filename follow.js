var followers = function follow(gramatic) {
  let nodes = retriveFollowNodes(gramatic);
  var firsts = require("./first")(gramatic);

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
};

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

module.exports = followers;
