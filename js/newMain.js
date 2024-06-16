import { solve } from "./solver.js";
import { generateProblem, formatProblem } from "./generator.js";
import { renderEndTable, renderHistory } from "./history.js";
import { renderTable } from "./render.js";


let simplexIterations = [];

document.addEventListener("DOMContentLoaded", function() {
    
    const id = 1; //replace by dropdown value

    const simplextable = formatProblem(generateProblem(id))
    simplexIterations = solve(simplextable);

    initSimplexTables(simplexIterations);
});

function initSimplexTables(simplexIterations){
    const mainTable = document.getElementById("mainTable");
    const steps = document.getElementById("steps");
    const solution = document.getElementById("solution");

    renderTable(simplexIterations[0], mainTable);
    renderEndTable(simplexIterations);
    renderHistory(simplexIterations);
    handleShow(steps);
    handleShow(solution);

    document.getElementById("showSteps").addEventListener("click", () => handleShow(steps));
    document.getElementById("showSolution").addEventListener("click", () => handleShow(solution));
}

function handleShow(node){
    if(node.classList.contains("displayNone")){
        node.classList.remove("displayNone")
    }else{
        node.classList.add("displayNone")
    }
}
