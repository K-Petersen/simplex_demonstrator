export function generateProblem(){
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


    return simplextable
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