import { problems } from "../resources/problems.js"
import { invertArrayEntries } from "./utils.js"
export function fillProblemDropdown(node){
    for(let x = 0; x < problems.length; x++){
        const newOption = document.createElement("option");
        newOption.value = x;
        newOption.innerText = problems[x].title
        node.appendChild(newOption)
    }
}

export function returnPlainProblem(id){
    return problems[id].problem;
}

export function formatProblemToSimplexTable(table){
    const length = table.constraints.length;
    const originalValuesCount = table.function.values.length;
    table.function.values = table.function.values.map(v => v* -1);

    for (let x = 0; x < length; x++){
        table.function.values.push(0);
        table.constraints[x].variable = "x" + (originalValuesCount + x + 1)
        for (let y = 0; y < length; y++){
            table.constraints[y].values.push(x == y ? 1 : 0)
        }
    } 
    return table
}

export function formatSimplexTableToDataFormat(table){
    table.fRow.values = table.function.values;
    delete table.function;

    const c = table.constraints;
    for(var x = 0; x < c.length ; x++){
        c[x].restriction = c[x].restriction.value
    }
    return table;
}

function doesRestrictionGetM(res){
    return res.type !== "lessthan" && res.value === Math.abs(res.value)
}

export function formatProblem(id){
    const table = problems[id].problem;
    let newTable = structuredClone(table);
    const originalValuesCount = table.function.values.length;
    newTable.function = minToMax(table.function)
    const c = newTable.constraints;
    let m = false;
    for(var x = 0; x < c.length; x++){
        newTable.constraints[x] = transformConstraint(c[x])
        if(doesRestrictionGetM(c[x].restriction)) m = true;
    }
    newTable = addSlackVariables(newTable);
    newTable.fRow = getFRow(newTable);
    if(m){
        newTable.mRow = getMRow(newTable, originalValuesCount);
    }

    delete newTable.function;
    for(var x = 0; x < c.length; x++){
        newTable.constraints[x].restriction = c[x].restriction.value
    }
    return newTable
}

function getFRow(table){
    const newFRowValues = structuredClone(table.function.values);  
    const newFRow = {
        values: newFRowValues,
        F: 0
    }
    return newFRow
}

export function addSlackVariables(table){
    let newTable = structuredClone(table);
    const originalValuesCount = newTable.function.values.length;
    let slack = [];
    let m = [];
    const constraints = newTable.constraints;

    newTable.fRow.values = newTable.function.values;

    for(var x = 0; x < constraints.length; x++){
        const res = constraints[x].restriction;
        if(res.type === "lessthan"){
            slack[x] = 1;
            m[x] = undefined;
        }
        if(res.type === "greaterthan"){
            slack[x] = -1;
            m[x] = 1
        }
        if(res.type === "equal"){
            slack[x] = undefined;
            m[x] = 1
        }
    }
    let yCount = 0;
    for(var x = 0; x < constraints.length; x++){
        let newConstraint = structuredClone(constraints[x]);
        const slackLength = slack.filter(x => x!== undefined).length;
        const mLength = m.filter(x => x!== undefined).length;

        for(var y = 0; y < slackLength + mLength; y++){
            let val = 0;
            newTable.fRow.values[originalValuesCount + y] = 0;
            if(y < slackLength){
                const undefinedCount = slack.slice(0, x + 1).length - slack.slice(0, x + 1).filter(x=>x!=undefined).length;
                if(slack[y + undefinedCount] != null && x == y + undefinedCount){
                    val = slack[x];
                    newConstraint.variable = "x" + (originalValuesCount + y + 1);
                }else{
                    val = 0;
                }
            }else{
                const undefinedCount = m.slice(0, x + 1).length - m.slice(0, x + 1).filter(x=>x!=undefined).length;
                const index = y - slackLength + undefinedCount
                if(m[index] != null && x == index){
                    val = m[index]
                    yCount++;
                    newConstraint.variable = "y" + yCount; 
                }else{
                    val = 0;
                }
            }
            newConstraint.values.push(val);
        }
        newTable.constraints[x] = newConstraint;
    }
    return newTable;
    
}

function transformConstraint(constraint){
    let newConstraint = structuredClone(constraint);
    const res = newConstraint.restriction;
    if(res.value < 0){
        newConstraint.restriction.value = res.value * -1;
        newConstraint.values = invertArrayEntries(newConstraint.values);
        if(res.type === "lessthan"){
            newConstraint.restriction.type = "greaterthan"
        }else if(res.type === "greaterthan") {
            newConstraint.restriction.type = "lessthan";
        } 
    }
    return newConstraint;
}



function minToMax(func){
    let newFunction = structuredClone(func);
    if(newFunction.type === "min"){
        newFunction.type = "max";
    }else{
        newFunction.values = invertArrayEntries(newFunction.values)
    }
    return newFunction
}

function getMRow(table){
    const newTable = structuredClone(table);
    const yCount = newTable.constraints.filter(x => x.variable.includes("y")).length;
    let mRow = {};
    mRow.M = 0;
    mRow.values = Array(newTable.constraints[0].values.length).fill(0);
    for(var x = 0; x < newTable.constraints.length; x++){
        const c = newTable.constraints[x];
        if(c.variable.includes("y")){
            for(var y = 0; y < c.values.length - yCount; y++){
                const val =  c.values[y];
                if(val != null){
                    mRow.values[y] -= val;
                }
            }
            mRow.M -= c.restriction.value
        }
    }
    return mRow
}