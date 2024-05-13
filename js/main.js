import {
    generateProblem,
    formatProblemToSimplexTable,
    formatSimplexTableToDataFormat
} from "./generator.js";

document.addEventListener("DOMContentLoaded", function() {
    const simplextable = formatSimplexTableToDataFormat(formatProblemToSimplexTable(generateProblem()));
    console.log(simplextable);
});