export const problems = [
    {
        title:"Problem 1",
        problem:{
            fRow:{
                F: 0,
                values: []
            },        
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
        }
    },
    {
        title: "Problem 2",
        problem: {
            fRow:{
                F: 0,
                values: []
            },        
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
    },
    {
        title: "M-Method",
        problem: {
            fRow:{
                F: 0,
                values: []
            },
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
        }
    },
    {
        title: "Klausur WiSe 20/21",
        problem: {
            fRow:{
                F: 0,
                values: []
            },
            function:{
                type: "max",
                values: [7, 3, -4]
            },
            constraints:[
                {
                    values:[2,1,-1],
                    restriction:{
                        type:"lessthan",
                        value:18,
                    }
                },
                {
                    values:[1,3,0],
                    restriction:{
                        type:"lessthan",
                        value:17,
                    }
                },
            ]
        }
    },
    {
        title: "Klausur SoSe 21",
        problem: {
            fRow:{
                F: 0,
                values: []
            },
            function:{
                type: "max",
                values: [3,2]
            },
            constraints:[
                {
                    values:[2,1],
                    restriction:{
                        type:"lessthan",
                        value:18,
                    }
                },
                {
                    values:[1,3],
                    restriction:{
                        type:"lessthan",
                        value:15,
                    }
                },
                {
                    values:[4,1],
                    restriction:{
                        type:"lessthan",
                        value:16,
                    }
                },
            ]
        }
    },
    {
        title: "Thesis Beispiel: Standard",
        problem: {
            fRow:{
                F: 0,
                values: []
            },
            function:{
                type: "max",
                values: [2,5]
            },
            constraints:[
                {
                    values:[1,4],
                    restriction:{
                        type:"lessthan",
                        value:24,
                    }
                },
                {
                    values:[-1,-1],
                    restriction:{
                        type:"greaterthan",
                        value:-12,
                    }
                },
            ]
        }
    },
    {
        title: "Thesis Beispiel: Primale Degeneration",
        problem: {
            fRow:{
                F: 0,
                values: []
            },
            function:{
                type: "max",
                values: [2,5]
            },
            constraints:[
                {
                    values:[1,4],
                    restriction:{
                        type:"lessthan",
                        value:24,
                    }
                },
                {
                    values:[-1,-1],
                    restriction:{
                        type:"greaterthan",
                        value:-6,
                    }
                },
            ]
        }
    },
    {
        title: "Thesis Beispiel: Mehrdeutigkeit",
        problem: {
            fRow:{
                F: 0,
                values: []
            },
            function:{
                type: "max",
                values: [2,5]
            },
            constraints:[
                {
                    values:[1,4],
                    restriction:{
                        type:"lessthan",
                        value:24,
                    }
                },
                {
                    values:[-1,-1],
                    restriction:{
                        type:"greaterthan",
                        value:-12,
                    }
                },
                {
                    values:[1,2.5],
                    restriction:{
                        type:"lessthan",
                        value:15,
                    }
                },
            ]
        }
    },
    {
        title: "Thesis Beispiel: Unbeschränktheit",
        problem: {
            fRow:{
                F: 0,
                values: []
            },
            function:{
                type: "max",
                values: [2,5]
            },
            constraints:[
                {
                    values:[0,4],
                    restriction:{
                        type:"lessthan",
                        value:20,
                    }
                },
                {
                    values:[-1,1],
                    restriction:{
                        type:"lessthan",
                        value:10,
                    }
                },
            ]
        }
    }
]