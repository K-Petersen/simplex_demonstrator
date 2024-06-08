import {
    generateProblem,
    formatProblemToSimplexTable,
    formatSimplexTableToDataFormat,
    addSlackVariables,
    formatMProblem
} from "./generator.js";

import { solve } from "./solver.js";

import {
    renderSimplexTable,
    centerSimplexTableau,
    fillRow,
    fillFRow,
    fillBiaiCol
} from "./render.js";
import { callAnimation, setInitialData } from "./animate.js";
import { renderHistory } from "./history.js";


let iteration = 0;
let step = 0;
let simplexIterations = [];

let HTMLSelectors = {};

document.addEventListener("DOMContentLoaded", function() {

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);

    const id = params.get('id');
    const mode = params.get('mode');

    // const simplextable = formatSimplexTableToDataFormat(formatProblemToSimplexTable(generateProblem(id)));
    console.log("simplextableM", formatMProblem(generateProblem(3)))
    const simplextable = formatSimplexTableToDataFormat(addSlackVariables(generateProblem(3)));
    console.log(simplextable)
    simplexIterations = solve(simplextable);

    const rows = renderSimplexTable(simplexIterations[0].newTable.fRow.values.length, simplexIterations[0].newTable.constraints.length);

    HTMLSelectors.simplexTable = document.getElementById("simplexTableau");
    for(let x = 0; x < rows.length; x++){
        HTMLSelectors.simplexTable.appendChild(rows[x]);
    }
    centerSimplexTableau(HTMLSelectors.simplexTable, simplextable)

    HTMLSelectors.biCol = document.getElementsByClassName("col_bi");
    HTMLSelectors.biaiCol = document.getElementsByClassName("col_biai");
    HTMLSelectors.biaiData = document.getElementsByClassName("biai");
    HTMLSelectors.rowData = document.getElementsByClassName("row_data");
    HTMLSelectors.fRow = document.getElementById("row_f");
    HTMLSelectors.stepCountIndicator = document.getElementById("stepCount");
    HTMLSelectors.iterationCountIndicator = document.getElementById("iterationCount");

    const history = document.getElementById("history");
    document.getElementById("showHistory").addEventListener("click", () => handleShowHistory(history))
    document.getElementById("stepForth").addEventListener("click", () => handleStepper(1))
    // setInitialData(simplexIterations, HTMLSelectors)
    // document.getElementById("stepForth").addEventListener("click", () => callAnimation(mode))

    renderHistory(simplexIterations);
    initTable();
});

function initTable(){
    const table = simplexIterations[iteration].newTable;
    for(let node of HTMLSelectors.rowData){
        const rowId = node.dataset.variable;
        const constraint = table.constraints[rowId];
        fillRow(constraint, node);
    }
    fillFRow(table.fRow, HTMLSelectors.fRow);
}

function handleStepper(direction){
    // if(iteration === 0) iteration++;
    if(direction === 1){
        if(step < 6) {
            step++;
        }else if(iteration < simplexIterations.length - 2){
            iteration++;
            step = 0;
        }
    }else if(direction === 0){
        if(iteration + step > 0){
            if(step > 0) {
                step--
            }else{
                iteration--;
                step = 6;
            }
        }
    }
    
    checkStepAction();
}

function handleShowHistory(history){
    if(history.classList.contains("displayNone")){
        history.classList.remove("displayNone")
    }else{
        history.classList.add("displayNone")
    }
}


/**
 * 
 * STEP1:   Select Pivot Col
 * STEP2:   Calculate and show BIAIS
 * STEP3:   Select Pivot Row
 * STEP4:   Hide BIAIS and Select Pivot Element
 * STEP5:   Calculate new Pivot row
 * STEP6a:  Solve all other rows  
 * STEP6b:  Mark other rows as undone
 *          Disable stepper until all rows marked as done
 *          Rows solve on click
 * 
 */
function checkStepAction(){
    const table = simplexIterations[iteration];

    const stepDescription = [
        "Initial Table",
        "Select Pivot Column",
        "Calculate all bi/aij",
        "Select Pivot Row",
        "Select Pivot Element",
        "Calculate new Pivot Row",
        "Calculate all other rows",
    ];

    switch (step){
        case 1:
            step1();
            break;
        case 2:
            step2();
            break;
        case 3:
            step3();
            break;
        case 4:
            step4();
            break;
        case 5:
            step5();
            break;
        case 6:
            step6();
            break;
    }
    HTMLSelectors.stepCountIndicator.innerHTML = step + ": " + stepDescription[step];
    HTMLSelectors.iterationCountIndicator.innerHTML = iteration;
}

function selectPivot(selector){
    let elements = document.getElementsByClassName(selector + "_" + simplexIterations[iteration].pivot[selector]);
    for(let node of elements){
        node.classList.add("pivot")
    }
}

function unselectPivot(){
    const rows = [...document.getElementsByClassName("row_" + simplexIterations[iteration].pivot.row)];
    const cols = [...document.getElementsByClassName("col_" + simplexIterations[iteration].pivot.col)];

    const elements = rows.concat(cols);

    for(let node of elements){
        node.classList.remove("pivot")
    }
    unselectPivotElement();
}

function selectPivotElement(){
    const row = document.getElementById("row_" + simplexIterations[iteration].pivot.row);
    for(let node of row.children){
        if(node.classList.contains("col_" + simplexIterations[iteration].pivot.col)){
            node.classList.add("pivotElement")
        }
    }
}

function unselectPivotElement(){
    const row = document.getElementById("row_" + simplexIterations[iteration].pivot.row);
    for(let node of row.children){
        if(node.classList.contains("col_" + simplexIterations[iteration].pivot.col)){
            node.classList.remove("pivotElement")
        }
    }
}


function showBiaiCol(){
    [...HTMLSelectors.biaiCol].forEach(element => {
        element.classList.remove("hidden");
    });
}

function hideBiaiCol(){
    [...HTMLSelectors.biaiCol].forEach(element => {
        element.classList.add("hidden");
    });
}

function markCell(row, col){
    const row_elems = [].slice.call(document.getElementsByClassName("row_" + (isNaN(row) ? row : row + 1)));
    const cell = row_elems.filter((elem) => {return elem.classList.contains("col_" + (isNaN(col) ? col : "x" + (col + 1)))})[0];
    cell.classList.add("mark_cell");
}

function step1(){
    selectPivot("col");
}

function step2(){
    showBiaiCol();
    fillBiaiCol(simplexIterations[iteration].biai, HTMLSelectors.biaiData);
}

function step3(){
    selectPivot("row");

}

function step4(){
    hideBiaiCol();
    fillBiaiCol(Array(simplexIterations[iteration].biai.length).fill(""), HTMLSelectors.biaiData);
    selectPivotElement();
}

function step5(){
    const rowId = simplexIterations[iteration].pivot.row;
    const rowNode = document.getElementById("row_" + rowId)
    unselectPivot();
    fillRow(simplexIterations[iteration + 1].newTable.constraints[rowId], rowNode)
}

function step6(){
    const table = simplexIterations[iteration + 1].newTable;
    for(let node of HTMLSelectors.rowData){
        const rowId = node.dataset.variable;
        if(rowId !== "row_" + simplexIterations[iteration].pivot.row){
            fillRow(table.constraints[rowId], node)

        }
    }
    fillFRow(table.fRow, HTMLSelectors.fRow);
}