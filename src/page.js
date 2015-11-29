﻿let $expression;
let $table;
let $graph;
let $isTautology;
let $isNotTautology;

// This function is called when DOM is loaded
function loaded() {
  $expression = document.querySelector('#expression');
  $table = document.querySelector('#outcome-table');
  $graph = document.querySelector('#graph');
  $isTautology = document.querySelector('#is-tautology');
  $isNotTautology = document.querySelector('#is-not-tautology');
}

function onEnterPress(e) {
  if (e.keyCode === 13) {
    onCalculatePress();
  }

  return false;
}

// This function is called when the calculate button is pressed
// TODO: Add the same behaviour when user presses return in expression textbox
function onCalculatePress() {
  const val = $expression.value;
  const rpn = convertToRpn(val);
  const varList = getVariableInfo(rpn);
  const combinations = Math.pow(2, varList.length);

  const decToBin = (dec) => {
    let bin = (dec >>> 0).toString(2);

    // Add leading zeros
    while (bin.length !== varList.length) {
      bin = '0' + bin;
    }

    return bin;
  };

  // Prepare table header
  let tableHtml = '<tr>';
  for (let i = 0; i < varList.length; i++) {
    tableHtml += `<th>${varList[i]}</th>`;
  }

  tableHtml += '<th>Wynik</th></tr>';

  let firstResult = -1;
  let isTautology = true;

  for (let current = 0; current < combinations; current++) {
    const bin = decToBin(current);
    let vars = {};

    // Create vars object with <varName>:<value> pairs
    for (let i = 0; i < varList.length; i++) {
      vars[varList[i]] = bin[i];
    }

    let result = calculateExpression(rpn.slice(), vars);

    // Save first result
    if (firstResult === -1) {
      firstResult = result;
    } else if (result !== firstResult) {
      isTautology = false;
    }

    // Add row with calculation result
    tableHtml += '<tr>';
    for (let i = 0; i < varList.length; i++) {
      tableHtml += `<td>${vars[varList[i]]}</td>`;
    }

    tableHtml += `<td class="result">${result}</td></tr>`;
  }

  // Show the table
  $table.innerHTML = tableHtml;

  if (isTautology) {
    $isTautology.style.display = 'block';
    $isNotTautology.style.display = 'none';
  } else {
    $isTautology.style.display = 'none';
    $isNotTautology.style.display = 'block';
  }

  // Render the graph
  renderGraph(rpn);
}

function renderGraph(rpn) {
  let data = createGraph(rpn);
  let options = {
    interaction: {
      dragNodes: false,
      dragView: true,
      selectable: false,
      zoomView: true
    },
    layout: {
      hierarchical: {
        direction: 'UD'
      }
    }
  };

  let network = new vis.Network($graph, data, options);
}
