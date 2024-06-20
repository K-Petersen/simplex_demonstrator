import { clearIterations, setVariableIndexPairing, solve } from "./solver.js";
import { formatProblem, fillProblemDropdown, returnPlainProblem } from "./generator.js";
import { renderEndTable, renderHistory } from "./history.js";
import { getVariableToCssClassPairing, renderProblem, renderTable } from "./render.js";
import { animateBackward, animateForward, initDataForAnimation } from "./animate.js";


let simplexIterations = [];
let iteration = 0;
let step = 0;

document.addEventListener("DOMContentLoaded", function() {
    
    const problemDropdown = document.getElementById("selectSimplexproblems");
    fillProblemDropdown(problemDropdown);
    init(problemDropdown[problemDropdown.options.selectedIndex].value);
    
    const stepsContainer = document.getElementById("stepsContainer");
    const solutionContainer = document.getElementById("solutionContainer");

    document.getElementById("selectSimplexproblems").addEventListener("change", (e) => handleChangeDropdown(e));
    document.getElementById("showSteps").addEventListener("click", () => handleShow(stepsContainer));
    document.getElementById("showSolution").addEventListener("click", () => handleShow(solutionContainer));
    document.getElementById("showTransformedProblem").addEventListener("click", handleShowTransformedProblem);
    document.getElementById("previousStep").addEventListener("click", () => handleAnimation(0))
    document.getElementById("nextStep").addEventListener("click", () => handleAnimation(1))
    
});
    
function init(id){

    step = 0; 
    iteration = 0;
    
    const simplextable = formatProblem(id)
    const yCount = simplextable.constraints.filter(x => x.variable.includes("y")).length;
    const vip = getVariableToCssClassPairing(simplextable.constraints[0].values.length - yCount, yCount );
    setVariableIndexPairing(getVariableToCssClassPairing(simplextable.constraints[0].values.length - yCount, yCount ))
    simplexIterations = solve(simplextable);



    initSimplexTables(simplexIterations);
    console.log(simplexIterations)
    initDataForAnimation(simplexIterations, vip);
    

    const problemUntransformed = document.getElementById("problemUntransformed");
    renderProblem(problemUntransformed, returnPlainProblem(id));

    const problemTransformed = document.getElementById("problemTransformed");
    renderProblem(problemTransformed, formatProblem(id));
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
    if(!document.getElementById("problemTransformed").classList.contains("displayNone")) handleShowTransformedProblem();
}

function handleAnimation(direction){
    const STEP_MAX = 15;
    if(iteration < simplexIterations.length - 1 || step < 1){
        if(direction === 1){
            if(step === STEP_MAX && iteration < simplexIterations.length){
                step = 0;
                iteration++;
            }else{
                    step++;
                    if(step === 11 && !("mRow" in simplexIterations[iteration].newTable)){
                        step+= 2;
                    }
                }
            animateForward(iteration, step);
        }
        
    }else{
        if(step === 0){
            if(iteration > 0){
                iteration--;
                step = STEP_MAX;
            }
        }else{
            step--;
        }
        animateBackward(iteration, step);

    }
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
