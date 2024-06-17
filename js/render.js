import { roundToTwoDigits } from "./utils.js";


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
        rows.push(createRow(constraint.values, constraint.restriction, constraint.variable, x));
    }
    rows.push(createRow(table.fRow.values, table.fRow.F, "f"))
    if("mRow" in table){
        rows.push(createRow(table.mRow.values, table.mRow.M, "m"))
    } 
    // rows.push(createRow(Array(valuesCount).fill(""), "", "help"))
    
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
        let text = "";
        if(x >= valuesCount - yCount){
            text = document.createTextNode("y" + (x - valuesCount + yCount + 1));
        }else{
            text = document.createTextNode("x" + (x + 1));
        } 
        headcell.appendChild(text);
        tableHeadRow.appendChild(headcell)
    }

    const bi = document.createElement("div");
    bi.classList.add("col_bi", "row_head");
    bi.innerHTML = "bi";
    tableHeadRow.appendChild(bi);

    const biaij = document.createElement("div");
    biaij.classList.add("col_biaij", "row_head", "hidden");
    biaij.innerHTML = "bi/aij";
    tableHeadRow.appendChild(biaij);


    return tableHeadRow;
}

function createRow(values, biValue, rowId, index = -1){
    const row = document.createElement("div");
    const rowClass = "row_" + (index === -1 ? rowId : index);
    row.id = rowClass;
    row.dataset.variable = rowId;
    row.classList.add("row");
    
    const bv = document.createElement("div");
    bv.classList.add(rowClass, "col_bv");
    let bvText;
    if(Number(rowId) == rowId){
        bvText = rowId
        row.classList.add("row_data")
    }else{
        bvText = rowId.toUpperCase()
        if(rowId == "help"){
            row.classList.add("hidden")
        }
    }
    bv.innerText = bvText;
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
    biaij.classList.add(rowClass, "col_biaij", "biaij", "hidden");
    row.appendChild(biaij);

    return row;
}

export function createHelpRow(valuesCount){
    const helpRow = document.createElement("div");
    helpRow.id = "row_help";
    helpRow.classList.add("row", "hidden");

    const bv = document.createElement("div");
    bv.classList.add("col_bv", "row_help");
    bv.innerHTML = "H";
    helpRow.appendChild(bv);

    for(let x = 0; x < valuesCount; x++){
        const cell = document.createElement("div");
        cell.classList.add("col_var", "col_" + x);
        helpRow.appendChild(cell)
    }

    const bi = document.createElement("div");
    bi.classList.add("col_bi", "row_help");
    helpRow.appendChild(bi);

    const biaij = document.createElement("div");
    biaij.classList.add("col_biaij", "row_help", "hidden");
    helpRow.appendChild(biaij);

    return helpRow;
}

export function centerSimplexTableau(htmlElement, valuesCount){
    htmlElement.style.marginLeft = (50 / ((valuesCount + 2) * 2) + 1) + "%";
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