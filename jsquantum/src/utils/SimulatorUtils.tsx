import Qubit from "../processing/Qubit";
import QuantumLogicGateTrasform from "../processing/QuantumLogicGateTrasform";
import QuantumSchematicsManager from "../components/QuantumSchematics/QuantumSchematicsManager";
import ArrayUtils from "./ArrayUtils";
import CustomGateManager from "../components/NavBar/CustomGateManager/CustomGateManager";
const math = require('mathjs');

const documentobj: any = document ? document : {};

const overlaps = (a: any, b: any) => {
  if (a === null || b === null) return false;
  const rect1 = a.getBoundingClientRect();
  const rect2 = b.getBoundingClientRect();
  const isInHoriztonalBounds =
    rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
  const isInVerticalBounds =
    rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
  const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
  return isOverlapping;
}

const createCloneGate = (gateId: String) => {
    let clone = documentobj.getElementById(gateId).cloneNode( true )
    clone.classList.add("gateSet");
    clone.style.position = "absolute";
    clone.style.left = '-400px';
    clone.style.top = '-400px';
    clone.style.zIndex = "999";
    return clone;
}

const addGateToTableObj = (gateId:String, clone: any, tableobj: any) => {
    clone.style.marginTop = "-87px";
    clone.style.top = "50px";
    clone.style.left = "0px";
    clone.style.position = "relative";
    clone.style.zIndex = "10";
    clone.setAttribute( 'id', gateId + "Set" );
    clone.onmousedown = (e : any) => {
        cloneFunction(gateId);
        tableobj.removeChild(clone);
        QuantumSchematicsManager.updateSchematics();
    }
    let gateObjs = Array.from(tableobj.childNodes).filter((obj : any) => obj.id !== "controlline");
    if (gateObjs.length > 1) {
        tableobj.removeChild(gateObjs.slice(-1).pop() as Node);
    }

    tableobj.appendChild(clone);
    QuantumSchematicsManager.updateSchematics();
}

const cloneFunction = (gateId : String) => {
  let dragId = gateId + "Drag";
  let clone = createCloneGate(gateId);
  clone.setAttribute( 'id', dragId );
  documentobj.onmousemove = (e: any) => {
    let d = documentobj.getElementById(dragId);
    if (d) {
        d.style.left = e.pageX - 38 +'px';
        d.style.top = e.pageY - 38 +'px';
    }
  };
  documentobj.querySelector('.toolbox').appendChild( clone );
  documentobj.onmouseup = (e: any) => {
    documentobj.onmousemove = () => {};
    let tableobjs = document.getElementsByClassName('table-box');
    let isOnTable = false
    Array.from(tableobjs).forEach(tableobj => {
      if (overlaps(clone, tableobj)) {
        isOnTable = true;
        addGateToTableObj(gateId, clone, tableobj);
      }
    });
    const toolbox = documentobj.querySelector('.toolbox');
    if (clone && !isOnTable && clone.parentNode === toolbox) {
      toolbox.removeChild(clone);
      clone = null;
    }
  };
}


export default class SimulatorUtils {
    public static cloneGate(gateId : String) {
        cloneFunction(gateId);
    }

    public static addAllGatesInTable(gatesObj: any) {
        for (let gateObj of gatesObj) {
            SimulatorUtils.addGateInTable(gateObj.gate, gateObj.x, gateObj.y);
        }
    }

    private static addGateInTable(gateId : String, x: number, y: number) {
        let clone = createCloneGate(gateId);
        let tableobjs = document.getElementById(`table-box_${x}_${y}`);
        addGateToTableObj(gateId, clone, tableobjs);
    }

    public static qGateTransformingByString(gateAsStr: String) : number[][] {
        switch (gateAsStr) {
            case "HGateSet":
                return QuantumLogicGateTrasform.hadamartMatrix;
            case "XGateSet":
                return QuantumLogicGateTrasform.pauliXMatrix;
            case "YGateSet":
                return QuantumLogicGateTrasform.pauliYMatrix;
            case "ZGateSet":
                return QuantumLogicGateTrasform.pauliZMatrix;
            case "SGateSet":
                return QuantumLogicGateTrasform.phaseMatrix;
            case "TGateSet":
                 return QuantumLogicGateTrasform.identityMatrix;
            default:
                const customGate = this.getCustomGetIfExists(gateAsStr);
                if (customGate) 
                    return customGate.getMatrix();
                else 
                    return QuantumLogicGateTrasform.identityMatrix;
        }
    }

    private static getCustomGetIfExists(gateAsStr: String) {
        const customGates = CustomGateManager.getCustomGates();
        for (let customGate of customGates) {
            if (`${customGate.getUuId()}-CustomGateSet` === gateAsStr) {
                return customGate;
            }
        }
        return null;
    }

    public static isControlGate(gate: String) {
        return gate === "ControlGateSet" || gate === "ControlGate";
    }
    
    public static createQubitFromKenetNotation(simbol : String) : Qubit {
        const invSqrTwo = 1 / Math.sqrt(2);
        let alpha = 0;
        let beta = 0;
        switch (simbol) {
            case '|0⟩':
                alpha = 1;
                beta = 0;
                break;
            case '|1⟩':
                alpha = 0;
                beta = 1;
                break;
            case '|+⟩':
                alpha = invSqrTwo;
                beta = invSqrTwo;
                break;
            case '|-⟩':
                alpha = invSqrTwo;
                beta = -invSqrTwo;
                break;
            case '|i⟩':
                alpha = invSqrTwo;
                beta = math.complex(0, invSqrTwo);
                break;
            case '|-i⟩':
                alpha = invSqrTwo;
                beta = math.complex(0, -invSqrTwo);
                break;
            default:
                break;
        }
        return new Qubit(alpha, beta);
    }

    public static defineKenetQbitFromNumber(qbitRepresentation : number) {
        return ['|0⟩', '|1⟩', '|+⟩', '|-⟩', '|i⟩', '|-i⟩'][qbitRepresentation];
    }

    public static binaryCombinationsString(n: number): string[] {
        const combinations = ArrayUtils.createBinaryCombinationsArray(n).slice(0) as any;
        for (let combination of combinations) {
            combination = combination.join('');
        }
        return combinations;  
    }

    public static getSpecificQubitPercentage(qbitsOutputVector: number[], totalNumberOfQubits: number, qubitIndex: number) : number {
        const squaredValues = qbitsOutputVector.map(val => math.abs(math.pow(val, 2)));
        const binaryMatrix = ArrayUtils.createBinaryCombinationsArray(totalNumberOfQubits);
        if (math.pow(2, totalNumberOfQubits) !== qbitsOutputVector.length) return 0;
        return squaredValues.reduce((a, b, i) => math.add(a, (binaryMatrix[i][qubitIndex]) ? b : 0), 0);
    }

    public static getSpecificQubitMensuramentLabel(qbitsOutputVector: number[], totalNumberOfQubits: number, index: number) {
        const doubleValue = SimulatorUtils.getSpecificQubitPercentage(qbitsOutputVector, totalNumberOfQubits, index);
        return this.getPercentageLabel(index, doubleValue);
    }

    public static getPercentageLabel(index: number, doubleValue: number) {
        if (index !== null) {
            return (math.abs(doubleValue)*100).toFixed(2) + "%";
        }
        return "0.00%";
    }

    public static getLabelRealAndImaginaryAValues(numberInComplexObj: number) {
        return `${math.re(numberInComplexObj).toFixed(2)} + ${math.im(numberInComplexObj).toFixed(2)}i`;
    }

}
