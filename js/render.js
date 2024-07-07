import { returnPlainProblem, formatProblem } from "./generator.js";
import { capitalizeFirstLetter, invertArrayEntries, roundToTwoDigits } from "./utils.js";


export function renderTable(simplexIterationObject, node){

    node.replaceChildren()

    const rows = renderSimplexTable(simplexIterationObject);

    for(let x = 0; x < rows.length; x++){
        node.appendChild(rows[x]);
    }
}


export function renderSimplexTable(simplexIterationObject){
    const table = simplexIterationObject.newTable;
    const valuesCount = table.fRow.values.length
    const constraintCount = table.constraints.length
    const yCount = table.constraints.filter(x => x.variable.includes("y")).length;

    let rows = [];
    
    rows.push(createTableHeader(valuesCount, yCount));
    for(let x = 0; x < constraintCount; x++){
        const constraint = table.constraints[x];
        let biaijVal;
        if("biaijs" in simplexIterationObject){
            if(simplexIterationObject.biaijs[x] == Infinity){
                biaijVal = "-";
            }else{
                biaijVal = roundToTwoDigits(constraint.restriction) + " / " + roundToTwoDigits(constraint.values[simplexIterationObject.pivot.col]) + " = " + roundToTwoDigits(simplexIterationObject.biaijs[x])
            }
        }else{
            biaijVal = "";
        }
        rows.push(createRow(constraint.values, roundToTwoDigits(constraint.restriction), biaijVal, constraint.variable, x));
    }
    rows.push(createRow(table.fRow.values, roundToTwoDigits(table.fRow.F), "", "F"))
    if("mRow" in table){
        rows.push(createRow(table.mRow.values, roundToTwoDigits(table.mRow.M), "", "M"))
    } 
    
    return rows;
}

export function createTableHeader(valuesCount, yCount){
    const tableHeadRow = document.createElement("div");
    tableHeadRow.id = "row_head";
    tableHeadRow.classList.add("row");

    const bv = document.createElement("div");
    bv.classList.add("col_bv", "row_head");
    bv.innerHTML = "BV";
    tableHeadRow.appendChild(bv);

    for(let x = 0; x < valuesCount; x++){
        const headcell = document.createElement("div");
        headcell.classList.add("row_head", "col_" + x, "col_var");
        let html;
        if(x >= valuesCount - yCount){
            html = "<span>y<sub>" + (x - valuesCount + yCount + 1) +"</sub></span>";
        }else{
            html = "<span>x<sub>" + (x + 1) + "</sub></span>";
        } 
        headcell.innerHTML = html;
        tableHeadRow.appendChild(headcell)
    }

    const bi = document.createElement("div");
    bi.classList.add("col_bi", "row_head");
    bi.innerHTML = "<span>b<sub>i</sub></span>";
    tableHeadRow.appendChild(bi);

    const biaij = document.createElement("div");
    biaij.classList.add("col_biaij", "row_head", "hidden");
    biaij.innerHTML = "<span>b<sub>i</sub>/<span>a<sub>ij</sub></span></span>";
    tableHeadRow.appendChild(biaij);


    return tableHeadRow;
}

function createRow(values, biValue, biaijValue, rowId, index = -1){
    const row = document.createElement("div");
    const rowClass = "row_" + (index === -1 ? rowId : index);
    row.id = rowClass;
    row.classList.add("row");
    
    const bv = document.createElement("div");
    bv.classList.add(rowClass, "col_bv");

    const bvHTML = rowId.includes("y") || rowId.includes("x") ? "<span>" + rowId.split("")[0] + "<sub>" + rowId.split("")[1] + "</sub></span>": rowId;
    if(Number(rowId) == rowId){
        row.classList.add("row_data")
    }
    bv.innerHTML = bvHTML;
    row.appendChild(bv);

    for(let x = 0; x < values.length; x++){
        const cell = document.createElement("div");
        cell.innerText = roundToTwoDigits(values[x]) + (rowId === "M" ? "M" : "")
        cell.classList.add(rowClass, "col_" + x, "col_var");
        row.appendChild(cell)
    }
    const bi = document.createElement("div");
    bi.innerText = biValue  + (rowId === "M" ? "M" : "");
    bi.classList.add(rowClass, "col_bi");
    row.appendChild(bi);

    const biaij = document.createElement("div");
    biaij.innerText = biaijValue;
    if(biaijValue == "-"){
        biaij.classList.add("tooltip");
        biaij.title = "Restriktionswerte die durch 0 oder einen negativen Wert geteilt würden, werden bei der Pivotzeilenwahl nicht berücksichtigt."
    }
    biaij.classList.add(rowClass, "col_biaij", "hidden");
    if(rowId.includes("x") || rowId.includes("y")) biaij.classList.add("biaij");
    row.appendChild(biaij);

    return row;
}

export function renderProblem(node, problemID, transformed){

    node.replaceChildren()
    const plainProblem = returnPlainProblem(problemID);
    const problem = (transformed ? formatProblem(problemID) : returnPlainProblem(problemID));

    let yCount = 0;
    if("variable" in problem.constraints[0]){
        yCount = problem.constraints.filter(x => x.variable.includes("y")).length;
    }
    let func;
    if("function" in problem){
        func = problem.function
    }else{
        func = structuredClone(problem.fRow);
        func.values = invertArrayEntries(func.values);
    } 


    //FUNCTION
    const functionNode = document.createElement("span");
    functionNode.classList.add("problemFunction");
    let functionInnerHTML = "";
    let zeroValues = "";
    let mTerms = "";
    for(var x = 0; x < func.values.length; x ++){
        if(func.values[x] === 0){
            if(x < func.values.length - yCount){
                zeroValues += (zeroValues === "" ? "" : " + ");
                zeroValues += "x" + "<sub>" + (x + 1) + "</sub>";
            }else{
                const id = x - (func.values.length - yCount) + 1
                mTerms += " &minus; My<sub>" + id + "</sub>" 
            }
            continue;
        }

        const values = func.values;
        const sign = (values[x] === Math.abs(values[x]) ? "+" : "&minus;");
        let val = values[x];
        if( Math.abs(values[x]) === 1 ){
            val = "";
        }else {
            val = Math.abs(values[x])
        }

        functionInnerHTML += (x > 0 || sign !== "+" ? " " + sign + " " : "") + val + "x" + "<sub>" + (x + 1) + "</sub>"
    }
    zeroValues = zeroValues === "" ? "" : " + 0&times;(" + zeroValues + ")";
    functionNode.innerHTML = ( "type" in func ? capitalizeFirstLetter(func.type) : "Max") + " " + (plainProblem.function.type === "min" && transformed ? "G" : "F") + "(x) = " + functionInnerHTML + zeroValues + mTerms;
    node.appendChild(functionNode)

    //FUNCTION TRANSFORMED
    if(transformed && "mRow" in problem){
        const downArrows = document.createElement("span");
        downArrows.classList.add("downArrows")
        downArrows.innerHTML = "&#11015;&#11015;&#11015;&#11015;&#11015;";
        node.appendChild(downArrows);

        const functionTransformedNode = document.createElement("span");
        functionTransformedNode.classList.add("problemFunction", "tooltip");
        functionTransformedNode.title = "Hier steht eine zweite Funktion, da die Obere zum weiteren Vorgehen in diese Form transformiert werden muss. Um die M-Zeile zu erhalten, muss man diese Funktion hier nur nach demjenigen M-Wert umstellen, der keine zugehörige Variable hat.";

        functionTransformedNode.innerHTML = "Max " + (plainProblem.function.type === "min" && transformed ? "G" : "F") + "(x) = " + transformFunction(problem)
        
        function transformFunction(problem){
            const mRow = invertArrayEntries(problem.mRow.values);
            const fRow = invertArrayEntries(problem.fRow.values);
            let functionTransformed = "";
            for(let x = 0; x < mRow.length - yCount; x++){
                const mRowSign = mRow[x] === Math.abs(mRow[x]) ? "+" : "&minus;";
                const fRowSign = fRow[x] === Math.abs(fRow[x]) ? "+" : "&minus;";
                const variable = "x" + "<sub>" + (x + 1) + "</sub>";
                if(mRow[x] !== 0){
                    if(fRow[x] !== 0){
                        if(functionTransformed !== "") functionTransformed += " + ";
                        functionTransformed += "(" + (mRowSign !== "+" ? " " + mRowSign : "" ) + Math.abs(mRow[x]) + "M" + " " + fRowSign + " " + Math.abs(fRow[x]) + ")";
                        functionTransformed += "&times;" + variable;
                    }else{
                        functionTransformed += (functionTransformed !== "" ? " " + mRowSign : "") + " " +(Math.abs(mRow[x]) !== 1 ? Math.abs(mRow[x]) : "") + "M" + variable; 
                    }
                }else if(fRow[x] !== 0){
                    functionTransformed += (functionTransformed === "" && " " + fRowSign === "+" ? "" : fRowSign) + " " + (Math.abs(fRow[x]) !== 1 ? Math.abs(fRow[x]) : "") + variable; 
                }
            }

            const M = problem.mRow.M;
            const sign = M === Math.abs(M) ? "+" : "&minus;";
            functionTransformed += " " + sign + " " + Math.abs(M) + "M";
            
            return functionTransformed;
        }


        node.appendChild(functionTransformedNode)
    }


    //u.d.NB:
    const udnb = document.createElement("span");
    udnb.classList.add("udnb");
    udnb.innerText = "u.d.NB:"
    node.appendChild(udnb);

    //CONSTRAINTS
    for(var x = 0; x < problem.constraints.length; x++){
        const constraint = problem.constraints[x];
        const constraintNode = document.createElement("span");
        constraintNode.classList.add("constraint")

        let constraintInnerHTML = "";

        const values = constraint.values;
        let valuesGreaterThanZero = 0;
        for(var y = 0; y < values.length; y++){
            if(values[y] === 0){
                if (y > 0) constraintInnerHTML += "<span class='sign'></span>";
                constraintInnerHTML += "<span class='variable'></span>";
                continue;
            }else{
                valuesGreaterThanZero++;
            }
            const sign = values[y] < 0 ? "&minus;" : (valuesGreaterThanZero > 1 && y > 0 ? (values[y] === Math.abs(values[y]) ? "+" : "&minus;") : "");
            let val = values[y];
            if( Math.abs(values[y]) === 1 ){
                val = "";
            }else{
                val = Math.abs(values[y])
            }

            if (y > 0 || values[y] < 0) constraintInnerHTML += "<span class='sign'>" + sign +"</span>";
            constraintInnerHTML += "<span class='variable'>" + val + ( !(yCount > 0 && y + 1 > (func.values.length - yCount)) ? "x" + "<sub>" + (y + 1) + "</sub>": "y" + "<sub>" + (y + 1 - (func.values.length - yCount)) + "</sub>") + "</span>";
        }
        const sign = (constraint.restriction.type === "lessthan" ? "&le;" : (constraint.restriction.type === "greaterthan" ? "&ge;" : "="))
        const val = "<span class='sign'>" + sign + "</span> <span class='restriction'>" + (constraint.restriction === Number(constraint.restriction) ? constraint.restriction : constraint.restriction.value) + "</span>"
        constraintNode.innerHTML = constraintInnerHTML + val;

        node.appendChild(constraintNode);
    }

    //>=0 CONSTRAINT
    const constraintNode = document.createElement("span");
    constraintNode.classList.add("constraint", "zeroConstraint")
    let constraintInnerHTML = "";
    for(var x = 0; x < func.values.length; x++){
        constraintInnerHTML += "<span>" + ( !(yCount > 0 && x + 1 > (func.values.length - yCount)) ? "x" + "<sub>" + (x + 1) + "</sub>": "y" + "<sub>" + (x + 1 - (func.values.length - yCount)) + "</sub>") + (x + 1 < func.values.length ? ",&nbsp;" : "") + "</span>";
    }
    constraintInnerHTML += "<span class='sign'>&ge;</span> <span class='restriction'>0</span>";
    constraintNode.innerHTML = constraintInnerHTML;
    node.appendChild(constraintNode)
}

 export function getVariableToCssClassPairing(valuesCount, yCount){
    let variableSelectorPairs = {};
     for(var y = 0; y < yCount; y++){
        variableSelectorPairs["y" + (y + 1)] = valuesCount + y;
    }
    return variableSelectorPairs;
 }