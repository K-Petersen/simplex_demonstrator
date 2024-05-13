import { roundToTwoDigits } from "./utils.js";


export function renderSimplexTable(valuesCount, constraintCount){

    const tableheader = createTableHeader(valuesCount);
    const rows = createBvRows(valuesCount, constraintCount);
    const frow = createFRow(valuesCount);
    
    const allRows = [tableheader].concat(rows, [frow]);
    return allRows;
}

function createTableHeader(valuesCount){
    const tableHeadRow = document.createElement("div");
    tableHeadRow.id = "row_head";
    tableHeadRow.classList.add("row");

    const bv = document.createElement("div");
    // bv.id = "bv";
    bv.classList.add("col_bv", "row_head");
    bv.innerHTML = "BV";
    tableHeadRow.appendChild(bv);

    for(let x = 0; x < valuesCount; x++){
        const headcell = document.createElement("div");
        headcell.classList.add("row_head", "col_" + x, "col_var");
        const text = document.createTextNode("X" + (x + 1));
        headcell.appendChild(text);
        tableHeadRow.appendChild(headcell)
    }

    const bi = document.createElement("div");
    // bi.id = "bi";
    bi.classList.add("col_bi", "row_head");
    bi.innerHTML = "bi";
    tableHeadRow.appendChild(bi);

    const biai = document.createElement("div");
    // biai.id = "biai";
    biai.classList.add("col_biai", "row_head", "hidden");
    biai.innerHTML = "bi/aij";
    tableHeadRow.appendChild(biai);

    // tableHeadRow.childNodes.forEach((child) => {
    //     child.classList.add("cell");
    // })

    return tableHeadRow;
}

function createBvRows(valuesCount, constraintCount){
    let bvRows = []
    for(let x = 0; x < constraintCount; x++){
        const row = document.createElement("div");
        row.id = "row_"+ x;
        row.dataset.variable = x;
        row.classList.add("row", "row_data");

        const bv = document.createElement("div");
        bv.classList.add("col_bv", "row_" + x);
        row.appendChild(bv);

        for(let y = 0; y < valuesCount; y++){
            const cell = document.createElement("div");
            cell.classList.add("row_" + x, "col_" + y, "col_var");
            row.appendChild(cell)
        }
        const bi = document.createElement("div");
        bi.classList.add("row_" + x, "col_bi");
        row.appendChild(bi);

        const biai = document.createElement("div");
        biai.classList.add("row_" + x, "col_biai", "biai", "hidden");
        row.appendChild(biai);

        // row.childNodes.forEach((child) => {
        //     child.classList.add("cell");
        // })
        
        bvRows.push(row);
    }

    return bvRows;
}

function createFRow(valuesCount){
    const fRow = document.createElement("div");
    fRow.id = "row_f";
    fRow.classList.add("row");

    const bv = document.createElement("div");
    // bv.id = "F";
    bv.classList.add("col_bv", "row_f");
    bv.innerHTML = "F";
    fRow.appendChild(bv);

    for(let x = 0; x < valuesCount; x++){
        const cell = document.createElement("div");
        cell.classList.add("col_var", "col_" + x);
        fRow.appendChild(cell)
    }

    const bi = document.createElement("div");
    bi.id = "FValue";
    bi.classList.add("col_bi", "row_f");
    fRow.appendChild(bi);

    const biai = document.createElement("div");
    biai.classList.add("col_biai", "row_f", "hidden");
    fRow.appendChild(biai);

    return fRow;
}

export function centerSimplexTableau(htmlElement, valuesCount){
    htmlElement.style.marginLeft = (50 / ((valuesCount + 2) * 2) + 1) + "%";
}

export function fillRow(constraint, htmlNode){
    for( let node of htmlNode.children){
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

export function fillFRow(row, F, htmlNode){
    for( let node of htmlNode.children){
        if (node.classList.contains("col_bi")){
            node.innerHTML = F;
        } else if (node.classList.contains("col_var")){
            const classList = [...node.classList];
            const colId = classList.filter(className => className.includes("col") && className !== "col_var")[0].split("_")[1];
            node.innerHTML = roundToTwoDigits(row[colId])
            
        }
    }
}

export function fillBiaiCol(biais, biaiColHTML){
    for( let node of biaiColHTML){
        const classList = [...node.classList];
        const rowid = classList.filter(className => className.includes("row"))[0].split("_")[1];       
        node.innerHTML = biais[rowid] !== Infinity ? roundToTwoDigits(biais[rowid]) : ""
    }
}
