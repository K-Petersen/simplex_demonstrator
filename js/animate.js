import { renderTable } from "./render.js";
import { roundToTwoDigits } from "./utils.js";
let HTMLSelectors = {};
let simplexIterations;
let originalProblem;
let iteration;
let step;
let variableIndexPairing;

function initHTMLSelectors(mainTable){
    HTMLSelectors.output = document.getElementById("output");

    HTMLSelectors.biCol = mainTable.querySelectorAll(".col_bi");
    HTMLSelectors.biaijCol = mainTable.querySelectorAll(".col_biaij");
    HTMLSelectors.biaijData = mainTable.querySelectorAll(".biaij");
    HTMLSelectors.fRow = mainTable.querySelectorAll(".row_F")
    if("mRow" in simplexIterations[0].newTable)
    HTMLSelectors.mRow = mainTable.querySelectorAll(".row_M");
}

export function initDataForAnimation(si, vip, op) {
    const mainTable = document.getElementById("mainTable");

    simplexIterations = si;
    variableIndexPairing = vip;
    originalProblem = op;
    
    initHTMLSelectors(mainTable);
    setHTML("Das ist das Starttableau.</br>Überprüfe zunächst das Optimierungspotenzial.");

}

export function animateBackward(i, s){
    iteration = i;
    step = s;

    const mainTable = document.getElementById("mainTable");

    initHTMLSelectors(mainTable);

    const table = simplexIterations[iteration];
    const pivotrowid = table.pivot.row;
    const pivotcolid = table.pivot.col;

    const isM = ("mRow" in simplexIterations[iteration].newTable);
    let yCol;
    if(isM){
        yCol = mainTable.querySelectorAll(".col_" + variableIndexPairing[simplexIterations[iteration].newTable.constraints[pivotrowid].variable]);
    }
    switch (step){
        case 0:
            toggleHighlightRow(false, true, (isM ? HTMLSelectors.mRow : HTMLSelectors.fRow));
            setHTML( (iteration === 0 ? "Das ist das Starttableau.</br>" : "") + "Überprüfe zunächst das Optimierungspotenzial.");
            break;
        case 1:

            setHTML("Wenn noch negative Werte in der " + (isM ? "M" : "F") + "-Zeile sind, ist die optimale Basislösung noch nicht gefunden.");

            toggleHighlightRow(true, false, (isM ? HTMLSelectors.mRow : HTMLSelectors.fRow));
            for(let node of (isM ? HTMLSelectors.mRow : HTMLSelectors.fRow)){
                if(node.classList.contains("col_" + pivotcolid)){
                    node.classList.remove("pivot")
                }
            }
            break;
        case 2:
            setHTML("Wähle den negativsten Wert aus.")
            toggleHighlightRow(false, false, (isM ? HTMLSelectors.mRow : HTMLSelectors.fRow));
            togglePivot(false, "col");
            for(let node of (isM ? HTMLSelectors.mRow : HTMLSelectors.fRow)){
                if(node.classList.contains("col_" + pivotcolid)){
                    node.classList.add("pivot")
                }
            }
            break;
        case 3:
            setHTML("Das ist deine Pivotspalte.");
            toggleHighlightBiRow(false)
            break;
        case 4:
            setHTML("Als nächstes schau dir die Werte in der b<sub>i</sub>-Spalte an.");
            toggleShowBiaijCol(false)
            break;
        case 5:
            setHTML("Teile die Werte in der grünen b<sub>i</sub>-Spalte durch die Werte a<sub>ij</sub> der Pivotspalte.");
            toggleHighlightBiRow(true)
            for(let node of HTMLSelectors.biaijData){
                if(node.classList.contains("row_" + pivotrowid)){
                    node.classList.remove("pivot")
                }
            }
            break;
        case 6:
            setHTML("Wähle das niedrigste Ergebnis aus.")
            togglePivot(false, "row");
            togglePivot(true, "col");
            fillBiaijCol(simplexIterations);
            toggleShowBiaijCol(true)
            for(let node of HTMLSelectors.biaijData){
                if(node.classList.contains("row_" + pivotrowid)){
                    node.classList.add("pivot")
                }
            }

            break;
        case 7:
            setHTML("Das ist deine Pivotzeile.")
            togglePivotElement(false);
            break;
        case 8:
            setHTML("Das Element, wo sich Pivotspalte und Pivotzeile kreuzen, ist dein Pivotelement.")
            toggleHighlightVariables(false);
            break;
        case 9:
            setHTML("Diese beiden Variablen werden jetzt miteinander 'getauscht'. Die Variable links verlässt die Basis, die Variable oben betritt die Basis.")
            togglePivot(true, "col");
            swapBase(true);
            toggleHighlightVariables(true);
            break;
        case 10:
            setHTML("Die neue Basisvariable wird links in die Basis geschrieben und jedes Element in der Zeile wird durch das rot markierte Pivotelement geteilt.")
            fillRow(pivotrowid, simplexIterations[iteration].newTable.constraints[pivotrowid]);
            if(isM){
                for(let x = 0; x < yCol.length; x++){
                    const node = yCol[x];
                    cleanClasses(node);
                    node.classList.remove("blackout");
                }
                if(!("mRow" in simplexIterations[iteration + 1].newTable)){
                    for(let node of HTMLSelectors.mRow){
                        node.classList.remove("blackout")
                    }
                }
            }
            [...mainTable.querySelectorAll(".row")].filter(row => row.id != "row_head" && row.id != ("row_" + pivotrowid)).forEach((row) => {
                [...row.children].forEach(node => node.classList.remove("transformation_undone"))
            });
            togglePivot(true, "row");
            togglePivotElement(true);
            break;
        case 11:    
            if(isM){
                let html = "Wenn eine y-Variable die Basis verlässt, kannst du diese Variable aus dem Tableau streichen.</br>"
                for(let x = 0; x < yCol.length; x++){
                    const node = yCol[x];
                    cleanClasses(node);
                    node.classList.remove("displayNone")
                    node.classList.add("blackout");
                }
                if(!("mRow" in simplexIterations[iteration + 1].newTable)){

                    mainTable.querySelector("#row_M").classList.remove("displayNone")
                    for(let node of HTMLSelectors.mRow){
                        node.classList.add("blackout")
                    }
                    html += "Da das die letzte y-Variable war, kann auch die M-Zeile gestrichen werden."
                }
                setHTML(html);
            }

            break;
        case 12:
            setHTML("Für mehr Übersicht werden die Elemente ganz aus dem Tableau gelöscht.");
            fillRow(pivotrowid, simplexIterations[iteration].newTable.constraints[pivotrowid]);
            [...mainTable.querySelectorAll(".row")].filter(row => row.id != "row_head" && row.id != ("row_" + pivotrowid)).forEach((row) => {
                [...row.children].forEach(node => node.classList.remove("transformation_undone"))
            });
            togglePivot(true, "row");
            togglePivotElement(true);
            break;


        case 13:
            setHTML("So erhältst du die Tabelle für die nächste, verbesserte Basislösung. Die roten Zeilen sind jedoch noch falsch und müssen neu berechnet werden.")
            toggleHighlightCol(false, false, mainTable.querySelectorAll(".col_" + pivotcolid));

            break;

        case 14:
            renderTable(simplexIterations[iteration], mainTable);
            initHTMLSelectors(mainTable);
            setHTML("Das Ziel ist, dass der grün markierte Vektor zu einem Einheitsvektor wird.</br></br> Dafür muss für jede rote Zeile folgende Operation durchgeführt werden: </br>Die weiße Zeile wird mit dem grün markierten Wert der jeweiligen Zeile multipliziert und dann von der jeweiligen Zeile abgezogen.")
            if(isM){
                yCol = mainTable.querySelectorAll(".col_" + variableIndexPairing[simplexIterations[iteration].newTable.constraints[pivotrowid].variable]);
                for(let x = 0; x < yCol.length; x++){
                    const node = yCol[x];
                    node.classList.add("displayNone");
                }
                if("mRow" in simplexIterations[iteration].newTable && iteration >= Object.keys(variableIndexPairing).length - 1 ){
                    mainTable.querySelector("#row_M").classList.add("displayNone")
                }
            }
            fillRow(pivotrowid, simplexIterations[iteration + 1].newTable.constraints[pivotrowid]);
            [...mainTable.querySelectorAll(".row")].filter(row => row.id != "row_head" && row.id != ("row_" + pivotrowid)).forEach((row) => {
                [...row.children].forEach(node => node.classList.add("transformation_undone"))
            });
            toggleHighlightCol(true, false, mainTable.querySelectorAll(".col_" + pivotcolid));

            break;
        case 15:
            setHTML("So erhältst du die nächste Basislösung und kannst mit dieser von vorne anfangen.")
            break;
    }

}

export function animateForward(i, s){
    iteration = i;
    step = s;

    const mainTable = document.getElementById("mainTable");

    initHTMLSelectors(mainTable);

    const table = simplexIterations[iteration]
    const pivotrowid = table.pivot.row;
    const pivotcolid = table.pivot.col;

    const isM = ("mRow" in simplexIterations[iteration].newTable);
    let yCol;
    if(isM){
        yCol = mainTable.querySelectorAll(".col_" + variableIndexPairing[simplexIterations[iteration].newTable.constraints[pivotrowid].variable]);
    }
    switch (step){
        case 0:
            renderTable(simplexIterations[iteration], mainTable);
            setHTML("Überprüfe zunächst das Optimierungspotenzial.");
            break;
        case 1:
            if(iteration < simplexIterations.length - 1){
                setHTML("Wenn noch negative Werte in der " + (isM ? "M" : "F") + "-Zeile sind, ist die optimale Basislösung noch nicht gefunden.");
                toggleHighlightRow(true, false, (isM ? HTMLSelectors.mRow : HTMLSelectors.fRow));
            }else{
                const isMax = originalProblem.function.type === "max";
                let output = "Alle Werte in der F-Zeile sind größer oder gleich 0. Die optimale Basislösung ist gefunden. </br></br>"
                if(!isMax){ //Wenn Min zu Max wurde
                    output += "Die hier gefundene Lösung entspricht aber der Optimallösung für das transformierte Maximal-Problem. Das Originalproblem war aber eine Minimierungsproblem. Daher musst du die F-Zeile mit -1 multiplizieren, sodass du die Optimallösung des Ausgangsproblems erhältst.";
                    output += "</br></br>";
                }
                output += "Der Optimalwert deines " + (isMax ? "Maximierungs" : "Minimierungs") + "problems ist: " + (isMax ? table.newTable.fRow.F : table.newTable.fRow.F * -1) + "</br>";
                output += "Der Lösungsvektor dafür ist x*=" + getLVx(isMax);
                if(("mRow" in simplexIterations[0].newTable)) output += "</br>Der Y-Lösungsvektor dafür ist y*=" + getLVy();
                setHTML(output);

                toggleHighlightRow(true, true, HTMLSelectors.fRow);

                function getLVx(isMax){
                    const cons = table.newTable.constraints;
                    const solutionLength = simplexIterations[simplexIterations.length - 1].newTable.constraints[0].values.length;

                    let lv = "(";
                    for(let x = 0; x < solutionLength; x++){
                        let val = 0;
                        for(let y = 0; y < cons.length; y++){
                            if(x == cons[y].variable.split("")[1] - 1) val = cons[y].restriction;
                        }
                        lv += roundToTwoDigits((isMax ? val : val * -1)) + ( x < solutionLength - 1 ? ", " : ")")
                    }
                    return lv;
                }

                function getLVy(){
                    const solutionLength = Object.keys(variableIndexPairing).length;
                    let lv = "(";
                    for(let y = 0; y < solutionLength; y++){
                        lv += "0" + ( y < solutionLength - 1 ? ", " : ")")
                    }
                    return lv;
                }
            }
            break;
        case 2:
            setHTML("Wähle den negativsten Wert aus.")
            toggleHighlightRow(false, false, (isM ? HTMLSelectors.mRow : HTMLSelectors.fRow));
            for(let node of (isM ? HTMLSelectors.mRow : HTMLSelectors.fRow)){
                if(node.classList.contains("col_" + pivotcolid)){
                    node.classList.add("pivot")
                }
            }
            break;
        case 3:
            setHTML("Das ist deine Pivotspalte.");
            togglePivot(true, "col");
            break;
        case 4:
            setHTML("Als nächstes schau dir die Werte in der b<sub>i</sub>-Spalte an.");
            toggleHighlightBiRow(true)
            break;
        case 5:
            setHTML("Teile die Werte in der grünen b<sub>i</sub>-Spalte durch die Werte a<sub>ij</sub> der Pivotspalte.");
            fillBiaijCol(simplexIterations);
            toggleShowBiaijCol(true)
            break;
        case 6:
            setHTML("Wähle das niedrigste Ergebnis aus.")
            toggleHighlightBiRow(false)
            for(let node of HTMLSelectors.biaijData){
                if(node.classList.contains("row_" + pivotrowid)){
                    node.classList.add("pivot")
                }
            }
            break;
        case 7:
            setHTML("Das ist deine Pivotzeile.")
            togglePivot(true, "row");
            toggleShowBiaijCol(false)
            break;
        case 8:
            setHTML("Das Element, wo sich Pivotspalte und Pivotzeile kreuzen, ist dein Pivotelement.")
            togglePivotElement(true);
            break;
        case 9:
            setHTML("Diese beiden Variablen werden jetzt miteinander 'getauscht'. Die Variable links verlässt die Basis, die Variable oben betritt die Basis.")
            toggleHighlightVariables(true);
            break;
        case 10:
            setHTML("Die neue Basisvariable wird links in die Basis geschrieben und jedes Element in der Zeile wird durch das rot markierte Pivotelement geteilt.")
            toggleHighlightVariables(false);
            swapBase();
            togglePivot(false, "col");
            break;
        case 11:    
            if(isM){
                let html = "Wenn eine y-Variable die Basis verlässt, kannst du diese Variable aus dem Tableau streichen.</br>"
                for(let x = 0; x < yCol.length; x++){
                    const node = yCol[x];
                    cleanClasses(node);
                    node.classList.add("blackout");
                }
                if(!("mRow" in simplexIterations[iteration + 1].newTable)){

                    for(let node of HTMLSelectors.mRow){
                        node.classList.add("blackout")
                    }
                    html += "Da das die letzte y-Variable war, kann auch die M-Zeile gestrichen werden."
                }
                setHTML(html);
            }

            break;
        case 12:
            if(isM){
                for(let x = 0; x < yCol.length; x++){
                    const node = yCol[x];
                    cleanClasses(node);
                    node.classList.add("displayNone")
                }
                if(!("mRow" in simplexIterations[iteration + 1].newTable)){
                    mainTable.querySelector("#row_M").classList.add("displayNone")
                }
            }
            setHTML("Für mehr Übersicht werden die Elemente ganz aus dem Tableau gelöscht.");
            break;


        case 13:
            setHTML("So erhältst du die Tabelle für die nächste, verbesserte Basislösung. Die roten Zeilen sind jedoch noch falsch und müssen neu berechnet werden.")
            fillRow(pivotrowid, simplexIterations[iteration + 1].newTable.constraints[pivotrowid]);
            [...mainTable.querySelector("#row_" + pivotrowid).children].forEach((node) => {
                cleanClasses(node);
            });
            [...mainTable.querySelectorAll(".row")].filter(row => row.id != "row_head" && row.id != ("row_" + pivotrowid)).forEach((row) => {
                [...row.children].forEach(node => node.classList.add("transformation_undone"))
            });
            break;

        case 14:
            setHTML("Das Ziel ist, dass der grün markierte Vektor zu einem Einheitsvektor wird.</br></br> Dafür muss für jede rote Zeile folgende Operation durchgeführt werden: </br>Die weiße Zeile wird mit dem grün markierten Wert der jeweiligen Zeile multipliziert und dann von der jeweiligen Zeile abgezogen.")
            toggleHighlightCol(true, false, mainTable.querySelectorAll(".col_" + pivotcolid));
            break;
        case 15:
            setHTML("So erhältst du die nächste Basislösung und kannst mit dieser von vorne anfangen.")
            renderTable(simplexIterations[iteration + 1], mainTable);
            break;
    }
}

function setHTML(html){
    HTMLSelectors.output.innerHTML = html;
}

function toggleHighlightRow(show, highlightAll, nodeList) {
    for(let node of nodeList){
        if(highlightAll || node.classList.contains("col_var")){
            if(show){
                node.classList.add("highlight");
            }else{
                node.classList.remove("highlight");
            }
        }
    }
}

function toggleHighlightCol(show, highlightAll, nodeList) {
    for(let node of nodeList){
        if(highlightAll || (!node.classList.contains("row_head"))){
            if(show){
                node.classList.add("highlight");
            }else{
                node.classList.remove("highlight");
            }
        }
    }
}

function toggleHighlightBiRow(show) {
    for(let node of HTMLSelectors.biCol){
        if(!node.classList.contains("row_M") && !node.classList.contains("row_F") && !node.classList.contains("row_head")){
            if(show){
                node.classList.add("highlight");
            }else{
                node.classList.remove("highlight");
            }
        }
    }
}


// selector has to be string "row" or "col"
function togglePivot(show, selector){
    const mainTable = document.getElementById("mainTable");
    let elements = mainTable.querySelectorAll("." + selector + "_" + simplexIterations[iteration].pivot[selector]);
    for(let node of elements){
        if(show){
            node.classList.add("pivot")
        }else {
            node.classList.remove("pivot")
        }
    }
}

function fillBiaijCol(){
    for(const [i, node] of Object.entries([...HTMLSelectors.biaijData])){
        const constraint = simplexIterations[iteration].newTable.constraints[i];
        if(simplexIterations[iteration].biaijs[i] == Infinity){
            node.innerText = "-"
            node.title = "Restriktionswerte die durch 0 oder einen negativen Wert geteilt würden, werden bei der Pivotzeilenwahl nicht berücksichtigt."
        } else{
            node.innerText = roundToTwoDigits(constraint.restriction) + "/" + roundToTwoDigits(constraint.values[simplexIterations[iteration].pivot.col]) + " = " + roundToTwoDigits(simplexIterations[iteration].biaijs[i])
        }

    }
}

function toggleShowBiaijCol(show){
    [...HTMLSelectors.biaijCol].forEach(element => {
        if(show){
            element.classList.remove("hidden");
        }else{
            element.classList.add("hidden");
        }
    });
}

function togglePivotElement(show){
    const row = document.getElementById("row_" + simplexIterations[iteration].pivot.row);
    for(let node of row.children){
        if(node.classList.contains("col_" + simplexIterations[iteration].pivot.col)){
            if(show){
                node.classList.add("pivotElement")
            }else{
                node.classList.remove("pivotElement")
            }
        }
    }
}
function toggleHighlightVariables(show){
    let nbv, bv;
    [...document.getElementById("row_head").children].forEach((node) => {
        if(node.classList.contains("pivot")) nbv = node;
    });
    [...document.getElementById("row_" + simplexIterations[iteration].pivot.row).children].forEach((node) => {
        if(node.classList.contains("col_bv")) bv = node;
    })
    if(show){
        nbv.classList.add("baseSwap")
        bv.classList.add("baseSwap")
    }else{
        nbv.classList.remove("baseSwap")
        bv.classList.remove("baseSwap")
    }
}

function swapBase(revert = false){
    const pivotrowid = simplexIterations[iteration].pivot.row;
    let node;
    [...document.getElementById("row_" + pivotrowid).children].forEach((el) => {
        if(el.classList.contains("col_bv")){
            node = el
        }
    })
    const variableNameArray = simplexIterations[(revert ? iteration : iteration + 1)].newTable.constraints[pivotrowid].variable.split("");
    node.innerHTML = "<span>" + variableNameArray[0] + "<sub>" + variableNameArray[1] + "</sub></span>";
}

function fillRow(rowid, constraint){
    for( let node of document.getElementById("row_" + rowid).children){
        const classList = [...node.classList];
        
        if (classList.includes("col_bi")){
            node.innerHTML = roundToTwoDigits(constraint.restriction);
        } else if (classList.includes("col_var")){
            const colId = classList.filter(className => className.includes("col") && className !== "col_var")[0].split("_")[1];
            node.innerHTML = roundToTwoDigits(constraint.values[colId])
            
        }
    }
}

function cleanClasses(node){
    node.classList.remove("highlight");
    node.classList.remove("pivot");
    node.classList.remove("pivotElement");
    node.classList.remove("baseSwap");
    node.classList.remove("blackout");
}