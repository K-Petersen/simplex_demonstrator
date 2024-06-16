import { renderSimplexTable } from './render.js';
import { roundToTwoDigits } from './utils.js'

export function renderEndTable(simplexIterations){
    const node = document.getElementById("solution");

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

function createHistory(simplexIterations){
    let history = [];
    const valuesCount = simplexIterations[0].newTable.fRow.values.length;
    for(var i = 0; i < simplexIterations.length; i++){
        const table = simplexIterations[i].newTable;
        const node = document.createElement("div");

        const yCount = table.constraints.filter(x => x.variable.includes("y")).length;
        
        node.classList.add("historyEntry", "simplexTableau")

        const tableHeadRow = document.createElement("div");
        tableHeadRow.id = "row_head";
        tableHeadRow.classList.add("row");

        const bv_head = document.createElement("div");
        bv_head.classList.add("col_bv", "row_head");
        bv_head.innerHTML = "BV";
        tableHeadRow.appendChild(bv_head);

        for(let x = 0; x < valuesCount; x++){
            const headcell = document.createElement("div");
            headcell.classList.add("row_head", "col_" + x, "col_var", (x === simplexIterations[i].pivot.col ) ? "pivot" : null);
            let text = "";
            if(x >= valuesCount - yCount){
                text = document.createTextNode("y" + (x - valuesCount + yCount + 1));
            }else{
                text = document.createTextNode("x" + (x + 1));
            } 
            headcell.appendChild(text);
            tableHeadRow.appendChild(headcell)
        }

        const bi_head = document.createElement("div");
        bi_head.classList.add("col_bi", "row_head");
        bi_head.innerHTML = "bi";
        tableHeadRow.appendChild(bi_head);

        if(i < simplexIterations.length - 1){
            const biaij = document.createElement("div");
            biaij.classList.add("col_biaij", "row_head");
            biaij.innerHTML = "bi/aij";
            tableHeadRow.appendChild(biaij);
        }

        node.appendChild(tableHeadRow);
        for(var x = 0; x < simplexIterations[i].newTable.constraints.length; x++){
            const constraint = table.constraints[x];
            const pivotcolid = simplexIterations[i].pivot.col;
            const isPivotRow = (x === simplexIterations[i].pivot.row);
            const row = document.createElement("div");
            row.classList.add("row");
    
            const bv = document.createElement("div");
            bv.classList.add("col_bv", "row_" + x, (x === simplexIterations[i].pivot.row ) ? "pivot" : null);
            bv.innerText = constraint.variable;
            row.appendChild(bv);
    
            for(let y = 0; y < valuesCount; y++){
                const cell = document.createElement("div");
                cell.classList.add("row_" + x, "col_var", "col_" + y, ((y === simplexIterations[i].pivot.col || isPivotRow ? "pivot" : null)), ((y === simplexIterations[i].pivot.col && (x === simplexIterations[i].pivot.row ) ? "pivotElement" : null)));
                cell.innerText = roundToTwoDigits(constraint.values[y]);  
                row.appendChild(cell)
            }
            const bi = document.createElement("div");
            bi.classList.add("row_" + x, "col_bi", (isPivotRow ? "pivot" : null));
            bi.innerText = constraint.restriction;  
            row.appendChild(bi);
    
            if(i < simplexIterations.length - 1){
                const biaij = document.createElement("div");
                biaij.classList.add("row_" + x, "col_biaij", "biaij", (isPivotRow ? "pivot" : null));
                biaij.innerText = simplexIterations[i].biaijs !== undefined ? constraint.restriction + " / " + constraint.values[pivotcolid] + " = " + roundToTwoDigits(simplexIterations[i].biaijs[x]) : "";  
                row.appendChild(biaij);
            }
            node.appendChild(row);
        }
        
        const fRow = document.createElement("div");
        fRow.classList.add("row");
    
        const bv = document.createElement("div");
        bv.classList.add("col_bv");
        bv.innerText = "F";
        fRow.appendChild(bv);
    
        for(let x = 0; x < valuesCount; x++){
            const cell = document.createElement("div");
            cell.classList.add("col_var", "col_" + x, (x === simplexIterations[i].pivot.col ? "pivot" : null));
            cell.innerText = roundToTwoDigits(simplexIterations[i].newTable.fRow.values[x]);
            fRow.appendChild(cell)
        }
    
        const bi = document.createElement("div");
        bi.id = "FValue";
        bi.classList.add("col_bi");
        bi.innerHTML = table.fRow.F;
        fRow.appendChild(bi);
        if(i < simplexIterations.length - 1){
            const biaij = document.createElement("div");
            biaij.classList.add("col_biaij", "hidden");
            fRow.appendChild(biaij);
        }

        node.appendChild(fRow);

        if("mRow" in simplexIterations[i].newTable){

            const mRow = document.createElement("div");
            mRow.classList.add("row");

            const bv = document.createElement("div");
            bv.classList.add("col_bv");
            bv.innerText = "M";
            mRow.appendChild(bv);
            for(let x = 0; x < valuesCount; x++){
                const cell = document.createElement("div");
                cell.classList.add("col_var", "col_" + x, (x === simplexIterations[i].pivot.col ? "pivot" : null));
                cell.innerText = roundToTwoDigits(simplexIterations[i].newTable.mRow.values[x]);
                mRow.appendChild(cell)
            }

            const bi = document.createElement("div");
            bi.id = "MValue";
            bi.classList.add("col_bi");
            bi.innerHTML = table.mRow.M;
            mRow.appendChild(bi);
            if(i < simplexIterations.length - 1){
                const biaij = document.createElement("div");
                biaij.classList.add("col_biaij", "hidden");
                mRow.appendChild(biaij);
            }
            
            node.appendChild(mRow);

        }
        history.push(node);
    }
    return history;
}