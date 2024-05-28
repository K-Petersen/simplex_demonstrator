export const problems = [
    {
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
    },
    {
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
    }
]