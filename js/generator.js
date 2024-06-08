export function generateProblem(id){
    let problem;
    const simplextable = {
        F:0,
        function:{
            type: "max",
            values: [10,20]
        },
        constraints:[
            {
                values:[1,1],
                restriction:{
                    type:"lessthan",
                    value:100,
                }
            },
            {
                values:[6,9],
                restriction:{
                    type:"lessthan",
                    value:720,
                }
            },
            {
                values:[0,1],
                restriction:{
                    type:"lessthan",
                    value:60,
                }
            }
        ]
    };

    const simplextable2 = {
        F: 0,
        function:{
            type: "max",
            values: [3,4]
        },
        constraints:[
            {
                values:[3,2],
                restriction:{
                    type:"lessthan",
                    value:1200,
                }
            },
            {
                values:[5,10],
                restriction:{
                    type:"lessthan",
                    value:3000,
                }
            },
            {
                values:[0,(1/2)],
                restriction:{
                    type:"lessthan",
                    value:125,
                }
            }
        ]
    };

    const mMethodTable = {
        F: 0,
        function:{
            type: "min",
            values: [1, -1.5]
        },
        constraints:[
            {
                values:[1,1],
                restriction:{
                    type:"greaterthan",
                    value:2,
                }
            },
            {
                values:[-1,1],
                restriction:{
                    type:"equal",
                    value:1,
                }
            },
            {
                values:[3, 2],
                restriction:{
                    type:"lessthan",
                    value:12,
                }
            }
        ]
    };

    switch(Number(id)){
        default:
        case 1:
            problem = simplextable;
            break;
        case 2:
            problem = simplextable2;
            break;
        case 3:
            problem = mMethodTable;
    }
    return problem;
}

export function formatProblemToSimplexTable(table){
    const length = table.constraints.length;
    const originalValuesCount = table.function.values.length;
    table.function.values = table.function.values.map(v => v* -1);

    for (let x = 0; x < length; x++){
        table.function.values.push(0);
        table.constraints[x].variable = (originalValuesCount + x + 1)
        for (let y = 0; y < length; y++){
            table.constraints[y].values.push(x == y ? 1 : 0)
        }
    } 
    return table
}

export function formatSimplexTableToDataFormat(table){
    table.fRow = table.function.values;
    delete table.function;

    const c = table.constraints;
    for(var x = 0; x < c.length ; x++){
        c[x].restriction = c[x].restriction.value
    }
    return table;
}

function isTableStandard(table){
    for(var x = 0; x < table.constraints.length; x++){
        if(!isRestrictionStandard(table.constraints[x].restriction)) return false
    }
    return true
}

function isRestrictionStandard(res){
    return res.type === "lessthan" && res.value === Math.abs(res.value)
}

function doesRestrictionGetSlack(res){
    return res.type === "lessthan" || res.type === "greaterthan";
}

function doesRestrictionGetM(res){
    return res.type !== "lessthan" && res.value === Math.abs(res.value)
}

document.addEventListener("DOMContentLoaded", () => {
    formatMProblem(generateProblem(3))
})

function formatMProblem(table){
    let newTable = structuredClone(table);
    newTable.function = minToMax(newTable.function)
    for(var x = 0; x < newTable.constraints.length; x++){
        newTable.constraints[x] = transformConstraint(newTable.constraints[x])
    }
    addSlackVariables(newTable);
    return newTable
}

function addSlackVariables(table){
    let newTable = structuredClone(table);
    const originalValuesCount = newTable.function.values.length;
    let slack = [];
    let m = [];
    const constraints = newTable.constraints;

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
    
    for(var x = 0; x < constraints.length; x++){
        let newConstraint = structuredClone(constraints[x]);
        const slackLength = slack.filter(x => x!== undefined).length
        const mLength = m.filter(x => x!== undefined).length

        for(var y = 0; y < slackLength + mLength; y++){
            let val = 0;
            if(y < slackLength){
                const undefinedCount = slack.slice(0, x + 1).length - slack.slice(0, x + 1).filter(x=>x!=undefined).length;
                val = (slack[y + undefinedCount] != null && x == y + undefinedCount) ? slack[x] : 0;
            }else{
                const undefinedCount = m.slice(0, x + 1).length - m.slice(0, x + 1).filter(x=>x!=undefined).length;
                const index = y - slackLength + undefinedCount
                val = (m[index] != null && x == index) ? m[index] : 0;
            }
            newConstraint.values.push(val);
        }
        newTable.constraints[x] = newConstraint;
    }

    console.log(newTable)
    // for(var x = 0; x < constraints.length; x++){
    //     let constraint = structuredClone(constraints[x]);
    //     for(var y = 0; y < slack + mCounter; y++){
    //         let newValue = 0;
    //         if(isRestrictionStandard(constraint.restriction)){
    //             if(y === x) newValue = 1;
    //         }else{
    //             if(constraint.restriction === "greaterthan"){
    //                 if(y === x) newValue = -1;
    //                 if()
    //             }
    //         }
    //         constraint.values.push(newValue)
    //     }
    // }
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
        newFunction.values = invertArrayEntries(newFunction.values)
    }
    return newFunction
}

function invertArrayEntries(arr){
    return arr.map(x => {return x * -1})
}