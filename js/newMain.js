import { clearIterations, setVariableIndexPairing, solve } from "./solver.js";
import { formatProblem, fillProblemDropdown, returnPlainProblem } from "./generator.js";
import { renderEndTable, renderHistory } from "./history.js";
import { getVariableToCssClassPairing, renderProblem, renderTable } from "./render.js";


let simplexIterations = [];

document.addEventListener("DOMContentLoaded", function() {
    
    const problemDropdown = document.getElementById("selectSimplexproblems");
    const stepsContainer = document.getElementById("stepsContainer");
    const solutionContainer = document.getElementById("solutionContainer");

    fillProblemDropdown(problemDropdown);
    init(problemDropdown[problemDropdown.options.selectedIndex].value);

    document.getElementById("selectSimplexproblems").addEventListener("change", (e) => handleChangeDropdown(e));
    document.getElementById("showSteps").addEventListener("click", () => handleShow(stepsContainer));
    document.getElementById("showSolution").addEventListener("click", () => handleShow(solutionContainer));
    document.getElementById("showTransformedProblem").addEventListener("click", handleShowTransformedProblem);

    
});
    
function init(id){
    const mainTable = document.getElementById("mainTable");
    const simplextable = formatProblem(id)
    const yCount = simplextable.constraints.filter(x => x.variable.includes("y")).length;
    setVariableIndexPairing(getVariableToCssClassPairing(simplextable.constraints[0].values.length - yCount, yCount ))
    simplexIterations = solve(simplextable);
    
    initSimplexTables(simplexIterations);
    
    const problemUntransformed = document.getElementById("problemUntransformed");
    const problemTransformed = document.getElementById("problemTransformed");
    
    renderProblem(problemUntransformed, returnPlainProblem(id))
    renderProblem(problemTransformed, formatProblem(id))
}

function initSimplexTables(simplexIterations){
    const mainTable = document.getElementById("mainTable");

    renderTable(simplexIterations[0], mainTable);
    renderEndTable(simplexIterations);
    renderHistory(simplexIterations);
    if(!stepsContainer.classList.contains("displayNone")) handleShow(stepsContainer);
    if(!solutionContainer.classList.contains("displayNone")) handleShow(solutionContainer);

}

function handleShow(node){
    if(node.classList.contains("displayNone")){
        node.classList.remove("displayNone")
    }else{
        node.classList.add("displayNone")
    }
}

function handleChangeDropdown(e){
    const index = e.target.options.selectedIndex;
    const id = e.target.options[index].value
    clearIterations();
    init(id);
    handleShowTransformedProblem()
}

function handleShowTransformedProblem(){
    const headline = document.getElementById("problemTransformedHeadline");
    const problem = document.getElementById("problemTransformed");
    const button = document.getElementById("showTransformedProblem");
    if(headline.classList.contains("displayNone")){
        headline.classList.remove("displayNone")
        problem.classList.remove("displayNone")
        button.classList.add("displayNone")
    }else{
        headline.classList.add("displayNone")
        problem.classList.add("displayNone")
        button.classList.remove("displayNone")
    }
}
