import { createTableHeader } from './render.js';
import { roundToTwoDigits } from './utils.js'

export function renderHistory(simplexIterations){
    const historyHTML = document.getElementById("history");
    const history = createHistory(simplexIterations);
    for(let node of history){
        historyHTML.appendChild(node)
    }
}
function createHistory(simplexIterations){
    let history = [];
    const valuesCount = simplexIterations[0].newTable.fRow.values.length;
    for(var i = 0; i < simplexIterations.length; i++){
        const table = simplexIterations[i].newTable;
        const node = document.createElement("div");
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
            const text = document.createTextNode("X" + (x + 1));
            headcell.appendChild(text);
            tableHeadRow.appendChild(headcell)
        }

        const bi_head = document.createElement("div");
        bi_head.classList.add("col_bi", "row_head");
        bi_head.innerHTML = "bi";
        tableHeadRow.appendChild(bi_head);

        if(i < simplexIterations.length - 1){
            const biai = document.createElement("div");
            biai.classList.add("col_biai", "row_head");
            biai.innerHTML = "bi/aij";
            tableHeadRow.appendChild(biai);
        }

        node.appendChild(tableHeadRow);
        for(var x = 0; x < simplexIterations[i].newTable.constraints.length; x++){
            const constraint = table.constraints[x];
            const pivotcolid = simplexIterations[i].pivot.col;
            const row = document.createElement("div");
            row.classList.add("row");
    
            const bv = document.createElement("div");
            bv.classList.add("col_bv", "row_" + x, (x === simplexIterations[i].pivot.row ) ? "pivot" : null);
            bv.innerText = constraint.variable;
            row.appendChild(bv);
    
            for(let y = 0; y < valuesCount; y++){
                const cell = document.createElement("div");
                cell.classList.add("row_" + x, "col_var", "col_" + y, ((y === simplexIterations[i].pivot.col || (x === simplexIterations[i].pivot.row ) ? "pivot" : null)), ((y === simplexIterations[i].pivot.col && (x === simplexIterations[i].pivot.row ) ? "pivotElement" : null)));
                cell.innerText = roundToTwoDigits(constraint.values[y]);  
                row.appendChild(cell)
            }
            const bi = document.createElement("div");
            bi.classList.add("row_" + x, "col_bi");
            bi.innerText = constraint.restriction;  
            row.appendChild(bi);
    
            if(i < simplexIterations.length - 1){
                const biai = document.createElement("div");
                biai.classList.add("row_" + x, "col_biai", "biai");
                biai.innerText = simplexIterations[i].biai !== undefined ? constraint.restriction + " / " + constraint.values[pivotcolid] + " = " + roundToTwoDigits(simplexIterations[i].biai[x]) : "";  
                row.appendChild(biai);
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
            const biai = document.createElement("div");
            biai.classList.add("col_biai", "hidden");
            fRow.appendChild(biai);
        }

        node.appendChild(fRow);

        history.push(node);
    }
    return history;
}