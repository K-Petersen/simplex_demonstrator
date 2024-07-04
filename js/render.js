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
        const biaijVal = ("biaijs" in simplexIterationObject ?  constraint.restriction + " / " +constraint.values[simplexIterationObject.pivot.col] + " = " + roundToTwoDigits(simplexIterationObject.biaijs[x]) : "")
        rows.push(createRow(constraint.values, constraint.restriction, biaijVal, constraint.variable, x));
    }
    rows.push(createRow(table.fRow.values, table.fRow.F, "", "F"))
    if("mRow" in table){
        rows.push(createRow(table.mRow.values, table.mRow.M, "", "M"))
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
    row.dataset.variable = rowId;
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
        cell.innerText = roundToTwoDigits(values[x])
        cell.classList.add(rowClass, "col_" + x, "col_var");
        row.appendChild(cell)
    }
    const bi = document.createElement("div");
    bi.innerText = biValue;
    bi.classList.add(rowClass, "col_bi");
    row.appendChild(bi);

    const biaij = document.createElement("div");
    biaij.innerText = biaijValue;
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
    for(var x = 0; x < func.values.length; x ++){
        if(func.values[x] === 0) continue;

        const values = func.values;
        const sign = (values[x] === Math.abs(values[x]) ? "+" : "-");
        const val = func.values[x];
        functionInnerHTML += (x > 0 ? " " + sign + " " + Math.abs(val) : val) + "x" + "<sub>" + (x + 1) + "</sub>"
    }
    functionNode.innerHTML = ( "type" in func ? capitalizeFirstLetter(func.type) : "Max") + " " + (plainProblem.function.type === "min" && transformed ? "G" : "F") + "(x) = " + functionInnerHTML;
    node.appendChild(functionNode)


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
                constraintInnerHTML += "<span></span>";
                continue;
            }else{
                valuesGreaterThanZero++;
            }
            const sign = (valuesGreaterThanZero > 1 && y > 0 ? (values[y] === Math.abs(values[y]) ? "+" : "-") : "");
            const val = (y > 0 ? " " + sign + " " + (Math.abs(values[y]) === 1 ? "" : values[y]) : (Math.abs(values[y]) === 1 ? (sign === "+" ? "" : values[y]) : values[y]))
            constraintInnerHTML += "<span>" + val + ( !(yCount > 0 && y + 1 > (func.values.length - yCount)) ? "x" + "<sub>" + (y + 1) + "</sub>": "y" + "<sub>" + (y + 1 - (func.values.length - yCount)) + "</sub>") + "</span>";
        }
        const sign = (constraint.restriction.type === "lessthan" ? "&le;" : (constraint.restriction.type === "greaterthan" ? "&ge;" : "="))
        const val = "<span>" + sign + "</span> <span>" + (constraint.restriction === Number(constraint.restriction) ? constraint.restriction : constraint.restriction.value) + "</span>"
        constraintNode.innerHTML = constraintInnerHTML + val;

        node.appendChild(constraintNode);
    }

    //>=0 CONSTRAINT
    const constraintNode = document.createElement("span");
    constraintNode.classList.add("constraint")
    let constraintInnerHTML = "";
    for(var x = 0; x < func.values.length; x++){
        constraintInnerHTML += "<span>" + ( !(yCount > 0 && x + 1 > (func.values.length - yCount)) ? "x" + "<sub>" + (x + 1) + "</sub>": "y" + "<sub>" + (x + 1 - (func.values.length - yCount)) + "</sub>") + (x + 1 < func.values.length ? "," : "") + "</span>";
    }
    constraintInnerHTML += "<span>&ge;</span> <span>0</span>";
    constraintNode.innerHTML = constraintInnerHTML;
    node.appendChild(constraintNode)
}

export function fillRow(constraint, htmlNode){
    for( let node of htmlNode.children){
        const classList = [...node.classList];
        if (classList.includes("col_bv")){
            node.innerHTML = constraint.variable
        } else if (classList.includes("col_bi")){
            node.innerHTML = roundToTwoDigits(constraint.restriction);
        } else if (classList.includes("col_var")){
            const colId = classList.filter(className => className.includes("col") && className !== "col_var")[0].split("_")[1];
            node.innerHTML = roundToTwoDigits(constraint.values[colId])
            
        }
    }
}

export function fillZRow(zRow, htmlNode, z){    
    for( let node of htmlNode.children){
        if (node.classList.contains("col_bi")){
            node.innerHTML = z === "f" ? zRow.F : zRow.M;
        } else if (node.classList.contains("col_var")){
            const classList = [...node.classList];
            const colId = classList.filter(className => className.includes("col") && className !== "col_var")[0].split("_")[1];
            node.innerHTML = roundToTwoDigits(zRow.values[colId])
            
        }
    }
}

export function fillBiaijCol(biaijs, biaijColHTML){
    for( let node of biaijColHTML){
        const classList = [...node.classList];
        const rowid = classList.filter(className => className.includes("row"))[0].split("_")[1];       
        node.innerHTML = biaijs[rowid] !== Infinity ? roundToTwoDigits(biaijs[rowid]) : ""
    }
}
 export function getVariableToCssClassPairing(valuesCount, yCount){
    let variableSelectorPairs = {};
     for(var y = 0; y < yCount; y++){
        variableSelectorPairs["y" + (y + 1)] = valuesCount + y;
    }
    return variableSelectorPairs;
 }

 export function hideYColumn(id){
    [...document.getElementById("simplexTableau").querySelectorAll(".col_" + id)].forEach(x => x.classList.add("displayNone"))
 }

 export function hideMRow(){
    document.getElementById("mRow").classList.add("displayNone")
 }