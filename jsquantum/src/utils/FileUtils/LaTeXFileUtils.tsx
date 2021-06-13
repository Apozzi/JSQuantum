import SimulatorUtils from "../SimulatorUtils";
import FileUtils from "./FileUtils";

export default class LaTeXFileUtils extends FileUtils {

    static createLaTex(documentobj: any, quantityOfQubits: number) {
        const minValueLength = 4;
        const fileArray = this.getGatesArrayObj(documentobj);
        const quantityArray = new Array(quantityOfQubits).fill(null);
        const yNumbers = fileArray.map(obj => (obj.y + 1))
        const lengthSize = Math.max(...yNumbers, minValueLength);
        const lengthArray = new Array(lengthSize).fill(null);

        return `\\documentclass[10pt]{standalone}\n` +
               `\\usepackage{tikz}\n` + 
               `\\usetikzlibrary{backgrounds,fit,decorations.pathreplacing,calc}\n` +
               `\\newcommand{\\ket}[1]{\\ensuremath{\\left|#1\\right\\rangle}}\n` +
               `\\begin{document}\n` +
               `\t\\begin{tikzpicture}[thick]\n`+
               `\t\\tikzstyle{operator} = [draw,fill=white,minimum size=1.5em]\n` +
               `\t\\tikzstyle{phase} = [draw,fill,shape=circle,minimum size=5pt,inner sep=0pt]\n` +
               `\t\\tikzstyle{surround} = [fill=blue!10,thick,draw=black,rounded corners=2mm]\n` +
               `\t%\n${quantityArray.length ? `\n\t\\matrix[row sep=0.4cm, column sep=0.8cm] (circuit) {\n\n` +
                    this.getNodes(quantityArray, lengthArray, fileArray) +
                    "\t};\n\n" + 
                    `\t\\begin{pgfonlayer}{background}\n` +
                        this.getObjectsToDraw(quantityArray, fileArray, lengthSize) +
                    `\t\\end{pgfonlayer}\n`
               : ''}` +
               `\t%\n` +
               `\t\\end{tikzpicture}\n` +
               `\\end{document}`;
    }

    private static getNodes(quantityArray: any[], lengthArray: any[], fileArray: any[]) {
        const nodes = quantityArray.map((v, i) => (
            `\t\\node (q${i}) {\\ket{0}}; &\n` +
            `${lengthArray.map((v, j) => this.definedNodeLine(fileArray, i, j)).join('')}` +
            `\t\\coordinate (end${i}); \\\\ \n`
        ));
        return nodes.join('');
    }

    private static definedNodeLine(fileArray: any, i: number, j: number) {
        const obj = fileArray.find((obj: any) => obj.x === i && obj.y === j);
        if (obj) {
            const gatePrefix = this.getGatePrefix(obj);
            if (gatePrefix === "CL") return `\t\\node[phase] (CL${i}${j}) {}; &\n`;
            return `\t\\node[operator] (${gatePrefix}${i}${j}) {${gatePrefix}}; &\n`;
        }
        return `\t&\n`;
    }

    private static getObjectsToDraw(quantityArray: any, fileArray: any, lengthSize:number) {
        return `\t\t\\draw[thick] ` +
        `${quantityArray.map((v: any, i: number) => ( ` (q${i}) -- (end${i})`)).join('')}` +
        `${this.getControlledGatesLines(fileArray, lengthSize)}`
        + `;\n`;
    }

    private static getControlledGatesLines(fileArray: any, lengthSize: number) {
        let linesResult = "";
        for (let i = 0; i < lengthSize; i++) {
            const gatesInLine = fileArray.filter((obj: any) => obj.y === i);
            const controlledGate = gatesInLine.find((obj: any) => SimulatorUtils.isControlGate(obj.gate));
            if (controlledGate) {
                for (let objGate of gatesInLine) {
                    if (objGate !== controlledGate) {
                        const gatePrefix = this.getGatePrefix(objGate)
                        linesResult += ` (${gatePrefix}${objGate.x}${objGate.y}) `;
                        linesResult += `--`;
                        linesResult += ` (CL${controlledGate.x}${controlledGate.y})`;
                    }
                }
            }
        }
        return linesResult;
    }

    private static getGatePrefix(gateObj: any) {
        if (SimulatorUtils.isControlGate(gateObj.gate)) return "CL";
        return gateObj.gate.replace("Gate", "");
    }

    static exportFile(documentobj: any, projectName: String, quantityOfQubits: number) {
        this.downloadFile(documentobj, this.createLaTex(documentobj, quantityOfQubits), projectName + '.tex', 'text');
    }
    
}
