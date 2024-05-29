import { roundToTwoDigits } from "./utils.js";

const mode = 1;
let step = 0;
let iteration = 0;
let simplexIterations;
let HTMLSelectors;

export function setInitialData(si, html){
    simplexIterations = si;
    HTMLSelectors = html;
}

export function callAnimation(mode){
    if(iteration === 0) iteration++;
    switch(Number(mode)){
        case 1:
            step++;
            console.log(step);
            animateStepFull()
            break;
        case 2:
            animateStepScarce()
            break;
        case 3:
            animateStepNone()
            break;
    }
}

function animateStepFull(){
    const pivotrowid = simplexIterations[iteration].pivot.row;
    const pivotcolid = simplexIterations[iteration].pivot.col;
    switch (step){
        case 1:
            /*
                wenn Optimierungspotenzial vorhanden
                    F-Zeile hervorheben
                else
                    F-Zeile hervorheben
                    F-Wert hervorheben
                    Resultat anzeigen
             */ 
                    if(simplexIterations.length >= iteration){
                        toggleHighlightFRow(true, HTMLSelectors.fRow.children);
                    }else{

                    }
            break;
        case 2:
            toggleHighlightFRow(false, HTMLSelectors.fRow.children);
            for(let node of HTMLSelectors.fRow.children){
                if(node.classList.contains("col_" + pivotcolid)){
                    node.classList.add("pivot_select_active")
                }
            }
            break;
        case 3:
            togglePivot(true, "col");
            break;
        case 4:
            toggleHighlightBiRow(true)
            break;
        case 5:
            fillBiaiCol();
            toggleShowBiaiCol(true)
            break;
        case 6:
            toggleHighlightBiRow(false)
            for(let node of HTMLSelectors.biaiData){
                if(node.classList.contains("row_" + pivotrowid)){
                    node.classList.add("pivot_select_active")
                }
            }
            break;
        case 7:
            togglePivot(true, "row");
            toggleShowBiaiCol(false)
            break;
        case 8:
            togglePivotElement(true);
            break;
        case 9:
            toggleHighlightVariables(true);
            break;
        case 10:
            toggleHighlightVariables(false);
            swapBase();
            togglePivot(false, "col");
            break;
        case 11:
            fillRow(pivotrowid);
            [...document.getElementById("row_" + pivotrowid).children].forEach((node) => {
                cleanClasses(node);
            })
            break;
        case 12:    
            [...document.getElementsByClassName("row")].filter(row => row.id != "row_head" && row.id != "row_help" && row.id != ("row_" + pivotrowid)).forEach((row) => {
                [...row.children].forEach(node => node.classList.add("transformation_undone"))
            })
           break;

        case 13:
            document.getElementById("row_help").classList.remove("hidden");
            break;

    }
}

function toggleHighlightFRow(show, HTMLSelector) {
    for(let node of HTMLSelector){
        if(node.classList.contains("col_var")){
            if(show){
                node.classList.add("highlight");
            }else{
                node.classList.remove("highlight");
            }
        }
    }
}

function toggleHighlightBiRow(show) {
    for(let node of HTMLSelectors.biCol){
        if(!node.classList.contains("row_f") && !node.classList.contains("row_head")){
            if(show){
                node.classList.add("highlight");
            }else{
                node.classList.remove("highlight");
            }
        }
    }
}


// selector has to be string "row" or "col"
function togglePivot(show, selector){
    let elements = document.getElementsByClassName(selector + "_" + simplexIterations[iteration].pivot[selector]);
    for(let node of elements){
        if(show){
            node.classList.add("pivot_select_active")
        }else {
            node.classList.remove("pivot_select_active")
        }
    }
}

function fillBiaiCol(){
    for(const [i, node] of Object.entries([...HTMLSelectors.biaiData])){
        const si = simplexIterations;
        const constraint = si[iteration-1].newTable.constraints[i];
        node.innerText = constraint.restriction + "/" + constraint.values[si[iteration].pivot.col] + " = " + si[iteration].biai[i]

    }
}

function toggleShowBiaiCol(show){
    console.log([...HTMLSelectors.biaiCol]);
    [...HTMLSelectors.biaiCol].forEach(element => {
        if(show){
            element.classList.remove("hidden");
        }else{
            element.classList.add("hidden");
        }
    });
}

function togglePivotElement(show){
    const row = document.getElementById("row_" + simplexIterations[iteration].pivot.row);
    for(let node of row.children){
        if(node.classList.contains("col_" + simplexIterations[iteration].pivot.col)){
            if(show){
                node.classList.add("pivotElement")
            }else{
                node.classList.remove("pivotElement")
            }
        }
    }
}
function toggleHighlightVariables(show){
    let nbv, bv;
    [...document.getElementById("row_head").children].forEach((node) => {
        if(node.classList.contains("pivot_select_active")) nbv = node;
    });
    console.log(document.getElementById("row_" + simplexIterations[iteration].pivot.row));
    [...document.getElementById("row_" + simplexIterations[iteration].pivot.row).children].forEach((node) => {
        if(node.classList.contains("col_bv")) bv = node;
    })
    if(show){
        nbv.classList.add("baseSwap")
        bv.classList.add("baseSwap")
    }else{
        nbv.classList.remove("baseSwap")
        bv.classList.remove("baseSwap")
    }
}

function swapBase(){
    const pivotrowid = simplexIterations[iteration].pivot.row;
    let node;
    [...document.getElementById("row_" + pivotrowid).children].forEach((el) => {
        if(el.classList.contains("col_bv")){
            node = el
        }
    })
    node.innerText = "X" + simplexIterations[iteration].newTable.constraints[pivotrowid].variable;
}

function fillRow(rowid){
    const constraint = simplexIterations[iteration].newTable.constraints[rowid];
    for( let node of document.getElementById("row_" + rowid).children){
        const classList = [...node.classList];
        
        if (classList.includes("col_bv")){
            node.innerHTML = "X" + constraint.variable
        } else if (classList.includes("col_bi")){
            node.innerHTML = roundToTwoDigits(constraint.restriction);
        } else if (classList.includes("col_var")){
            const colId = classList.filter(className => className.includes("col") && className !== "col_var")[0].split("_")[1];
            node.innerHTML = roundToTwoDigits(constraint.values[colId])
            
        }
    }
}

function cleanClasses(node){
    node.classList.remove("highlight");
    node.classList.remove("pivot_select_active");
    node.classList.remove("pivotElement");
    node.classList.remove("baseSwap");
}