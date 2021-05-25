import SimulatorUtils from "../SimulatorUtils";
import FileUtils from "./FileUtils";

export default class AsciiFileUtils extends FileUtils {

    private static IDENTITY_GATE = "I";

    static createAscii(documentobj: any, quantityOfQubits: number) {
        const fileArray = this.getGatesArrayObj(documentobj);
        const yNumbers = fileArray.map(obj => (obj.y + 1))
        const lengthSize = Math.max(...yNumbers, quantityOfQubits);
        let resultContent = "";
        for (let i = 0; i < quantityOfQubits; i++) {
            for (let j = 0; j < lengthSize; j++) {
                const controlledGatesInLine = fileArray.filter((obj: any) => obj.y === j && SimulatorUtils.isControlGate(obj.gate));
                resultContent += controlledGatesInLine.length ? 
                        this.defineGateSimbolControlled(fileArray, i, j):
                        this.defineGateSimbolNotControlled(fileArray, i, j);
                resultContent += "-";
            }
            resultContent = resultContent.slice(0, -1);
            resultContent += "\n";
        }
        return resultContent;
    }

    private static defineGateSimbolNotControlled(fileArray: any, i: number, j: number) {
        const obj = fileArray.find((obj: any) => obj.x === i && obj.y === j);
        if (obj) {
           return this.getGatePrefix(obj); 
        }
        return this.IDENTITY_GATE;
    }

    private static defineGateSimbolControlled(fileArray: any, i: number, j: number) {
        const firstControlledGateObj = fileArray.find((obj: any) => obj.y === j && !SimulatorUtils.isControlGate(obj.gate));
        const obj = fileArray.find((obj: any) => obj.x === i && obj.y === j);
        const controlGateAnnotation = "#0";
        const controlledGateAnnotation = "#1";
        const spacingAnnotation = "--";
        if (firstControlledGateObj && obj) {
            if (SimulatorUtils.isControlGate(obj.gate)) 
                return this.getGatePrefix(firstControlledGateObj) + controlGateAnnotation;
            if (firstControlledGateObj === obj) 
                return this.getGatePrefix(firstControlledGateObj) + controlledGateAnnotation;
            return obj.gate + spacingAnnotation;
        } else {
            return this.IDENTITY_GATE + spacingAnnotation;
        }
    }

    private static getGatePrefix(gateObj: any) {
        return gateObj.gate.replace("Gate", "");
    }


    static exportFile(documentobj: any, projectName: String, quantityOfQubits: number) {
        this.downloadFile(documentobj, this.createAscii(documentobj, quantityOfQubits), projectName + '.txt', 'text');
    }

}
