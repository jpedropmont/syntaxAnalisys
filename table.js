var table = function makePredictiveSyntacticTable(gramatic) {
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
        f[i][j] = "erro";
      }
    }
  }

  f[0][column - 1] = "$";
  f[0][0] = null;

  let expressionsFirst = require("./first")(gramatic);
  let expressionsFollow = require("./follow")(gramatic);

  let posX;
  let posY;

  for (i = 0; i < expressionsFirst.length; i++) {
    for (j = 0; j < expressionsFirst[i].firsts.length; j++) {
      for (z = 0; z < f.length; z++) {
        if (f[z][0] === expressionsFirst[i].variable) {
          posY = z;
        }
      }
      if (expressionsFirst[i].firsts.indexOf("0") !== -1) {
        for (m = 0; m < expressionsFollow.length; m++) {
          if (expressionsFollow[m].followers.indexOf("$") !== -1) {
            posX = f[0].length - 1;
          } else {
            for (n = 0; n < expressionsFollow[m].followers.length; n++) {
              for (o = 0; o < f[0].length; o++) {
                if (f[0][o] === expressionsFollow[m].followers[n]) {
                  posX = o;
                }
              }
            }
          }
        }
      } else {
        for (x = 0; x < f[0].length; x++) {
          if (f[0][x] === expressionsFirst[i].firsts[j]) {
            posX = x;
          }
        }
      }
      f[posY][posX] = expressionsFirst[i].line;
    }
  }

  return f;
};

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

module.exports = table;
