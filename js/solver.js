let simplexIterations = [];

export function solve(simplextable){
    let iteration = 0;
    simplexIterations.push({newTable:simplextable});

    while(checkOptimizationPotential(simplexIterations[iteration].newTable.fRow)){
        iteration += 1;
        simplexIterations.push({});
        initializeIterationObject(iteration);
        iterate(simplexIterations[iteration - 1].newTable, iteration);
    }
    
    console.log(simplexIterations);
    return simplexIterations;
}

function initializeIterationObject(iteration){
    simplexIterations[iteration].pivot = {};
    simplexIterations[iteration].newTable = {};
    simplexIterations[iteration].newTable.constraints = [];
}

function iterate(table, iteration){
    const i = iteration;
    const pivotcol = returnPivotColId(table.fRow);
    simplexIterations[i].pivot.col = pivotcol;
    simplexIterations[i].biai = calculateBiais(table, i);
    const pivotrow = returnPivotRowId(simplexIterations[i].biai);
    simplexIterations[i].pivot.row = pivotrow;
    simplexIterations[i].newTable.constraints[simplexIterations[i].pivot.row] = calculateNewPivotRow(table.constraints[pivotrow], i);
    
    const newTable = calculateNewTable(table, i);
    for(var x = 0; x < newTable.constraints.length; x++){
        if(Object.keys(newTable.constraints[x]).length > 0){
            simplexIterations[i].newTable.constraints[x] = newTable.constraints[x];
        }
    }
    simplexIterations[i].newTable.F = newTable.F;
    simplexIterations[i].newTable.fRow = newTable.fRow;
}

function checkOptimizationPotential(fRowValues){
    return fRowValues.some(x => x < 0);
}

function returnPivotColId(fRowValues){
    const min = Math.min(...fRowValues);
    return fRowValues.indexOf(min);
}

function calculateBiais(table, iteration){
    let biais = [];
    const c = table.constraints;
    for(let x = 0; x < c.length; x++){
        let biai;
        if(iteration > 1 && x == simplexIterations[iteration - 1].pivot.row){
            biai = Infinity;
        }else{
            biai = c[x].restriction / c[x].values[simplexIterations[iteration].pivot.col];
        }
        biais.push(biai)
    }
    return biais;
}

function returnPivotRowId(biais){
    const min = Math.min(...biais);
    return biais.indexOf(min);
}

function calculateNewPivotRow(oldPivotRow, iteration){
    const pivotcolid = simplexIterations[iteration].pivot.col;
    let newPivotRow = [];
    const pivotElement = oldPivotRow.values[pivotcolid];
    for(let x = 0; x < oldPivotRow.values.length; x++){
        newPivotRow.push(oldPivotRow.values[x] / pivotElement);
    }
    const newBi = oldPivotRow.restriction / pivotElement;
    const newVariable = pivotcolid + 1;
    const newConstraint = {
        values: newPivotRow,
        restriction: newBi,
        variable: newVariable
    }

    return newConstraint;
}

function calculateNewTable(table, iteration){
    const c = table.constraints;
    const pivotcolid = simplexIterations[iteration].pivot.col;
    const pivotrowid = simplexIterations[iteration].pivot.row;
    const pivotrow = simplexIterations[iteration].newTable.constraints[pivotrowid];
    
    let newConstraints = [];
    for(let x = 0; x < c.length ; x++){
        let newConstraint = {};
        if(x !== pivotrowid){
            const newBi = (pivotrow.restriction * -1 * c[x].values[pivotcolid]) + c[x].restriction;
            newConstraint = {
                values: calculateNewRow(c[x].values, iteration),
                restriction: newBi,
                variable: c[x].variable
            }
        }
        newConstraints.push(newConstraint);
    }
    const newFRow = calculateNewRow(table.fRow, iteration);
    let newF = table.F + (pivotrow.restriction * -1 * table.fRow[pivotcolid])

    const newTable = {
        F: newF,
        fRow: newFRow,
        constraints: newConstraints
    }

    return newTable;
}

function calculateNewRow(row, iteration){
    const pivotcolid = simplexIterations[iteration].pivot.col;
    const pivotrowid = simplexIterations[iteration].pivot.row;
    const pivotrow = simplexIterations[iteration].newTable.constraints[pivotrowid];
    let newRow = [];
    for(var x = 0; x < row.length; x++){
        const newValue = (pivotrow.values[x] * -1 * row[pivotcolid]) + row[x];
        newRow.push(newValue);
    }
    
    return newRow;
}