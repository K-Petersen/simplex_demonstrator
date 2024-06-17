import { renderSimplexTable } from './render.js';
import { roundToTwoDigits } from './utils.js'

export function renderEndTable(simplexIterations){
    const node = document.getElementById("solution");

    node.replaceChildren()

    const newTable = document.createElement("div");
    newTable.classList.add("simplexTable");

    const rows = renderSimplexTable(simplexIterations[simplexIterations.length - 1])
    for(let x = 0; x < rows.length; x++){
        rows[x].lastChild.classList.add("displayNone");
        newTable.appendChild(rows[x]);
    }
    node.appendChild(newTable);
}

export function renderHistory(simplexIterations){
    const node = document.getElementById("steps");

    node.replaceChildren()

    for(let x = 0; x < simplexIterations.length - 1; x++){
        const newTable = document.createElement("div");
        newTable.classList.add("simplexTable");

        const rows = renderSimplexTable(simplexIterations[x])
        for(let y = 0; y < rows.length; y++){
            rows[y].lastChild.classList.remove("hidden");
            for(let z = 0; z < [...rows[y].children].length; z++){
                if(y === simplexIterations[x].pivot.row + 1){
                    if(z === simplexIterations[x].pivot.col + 1){
                        [...rows[y].children][z].classList.add("pivotElement")
                    }else{
                        [...rows[y].children][z].classList.add("pivot")
                    }
                }else{
                    if(z === simplexIterations[x].pivot.col + 1){
                        [...rows[y].children][z].classList.add("pivot")
                    }
                }
            }
            newTable.appendChild(rows[y]);
        }
        node.appendChild(newTable);
    }
}