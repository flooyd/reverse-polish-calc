const readline = require("readline");

let outputs = [];
let formattedOutputs = [];
let retainedOutputs = [];
let exit = false;

const inputOutput = () => {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(">", (response) => {
    outputs.push(response);
    retainedOutputs.push(response);
    formatOutputs();
    console.log("Calculation: ", retainedOutputs);
    let invalid = false;
    if (checkForInvalidOperator()) {
      outputs = [];
      retainedOutputs = [];
      invalid = true;
    }
    if (formattedOutputs.length > 0) {
      calculate();
    }

    if (!invalid) {
      console.log("Result:", formattedOutputs);
    } else {
      console.log("Invalid Calculation. Calculation cleared.");
    }
    rl.close();
    inputOutput();
  });
};

const calculate = () => {
  let finished = false;
  while (!finished) {
    for (let i = 0; i < formattedOutputs.length; i++) {
      let operator = "";
      if (i === formattedOutputs.length - 1) {
        finished = true;
      }
      if (formattedOutputs[i].match(/^[*+\-/]$/)) {
        formattedOutputs[i - 2] = doOperation(
          formattedOutputs[i - 2],
          formattedOutputs[i - 1],
          formattedOutputs[i]
        ).toString();

        formattedOutputs.splice(i - 1, 2);
        outputs = formattedOutputs;
        break;
      }
    }
  }
};

const doOperation = (a, b, operator) => {
  a = parseInt(a);
  b = parseInt(b);
  switch (operator) {
    case "*":
      return a * b;
    case "-":
      return a - b;
    case "/":
      return a / b;
    case "+":
      return a + b;
    default:
      break;
  }
};

const checkForInvalidOperator = () => {
  let counter = {
    number: 0,
    operator: 0,
  };

  for (let i = 0; i < formattedOutputs.length; i++) {
    if (formattedOutputs[i].match(/^[*+\-/]$/)) {
      counter.operator += 1;
      if (counter.operator >= counter.number) {
        return true;
      }
    } else {
      counter.number += 1;
    }
  }

  return false;
};

const formatOutputs = () => {
  outputs.forEach((output, index) => {
    let newOutput = "";
    for (let i = 0; i < output.length; i++) {
      if (output[i].match(/^[*+\-/]$/) && i != 0) {
        newOutput += " " + output[i] + " ";
      } else {
        newOutput += output[i];
      }
    }

    outputs[index] = newOutput;
  });

  outputs = outputs.filter((output) => output !== "");
  formattedOutputs = [];

  for (let i = 0; i < outputs.length; i++) {
    if (outputs[i].includes(" ")) {
      outputArr = outputs[i].split(" ");
      outputArr.forEach((o) => {
        formattedOutputs.push(o);
      });
    } else {
      formattedOutputs.push(outputs[i]);
    }
  }

  formattedOutputs = formattedOutputs.filter((output) => output !== "");
};

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

process.stdin.on("keypress", (chunk, key) => {});

inputOutput();
