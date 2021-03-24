import Qubit from "./Qubit";
import QuantumLogicGateTrasform from "./QuantumLogicGateTrasform";
import QuantumSchematicsManager from "../component/QuantumSchematics/QuantumSchematicsManager";
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
    let gateObjs = Array.from(tableobj.childNodes).filter((obj : any) => obj.id !== "controlledline");
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
    d.style.left = e.pageX - 38 +'px';
    d.style.top = e.pageY - 38 +'px';
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

    public static addGateInTable(gateId : String, x: number, y: number) {
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
                return QuantumLogicGateTrasform.identityMatrix;
        }
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
        const combinations = this.binaryCombinations(n).slice(0) as any;
        for (let combination of combinations) {
            combination = combination.join('');
        }
        return combinations;  
    }

    public static binaryCombinations(n: number): number[][] {
        const r = [];
        for(let i = 0; i < (1 << n); i++) {
            const c = [];
            for(let j = 0; j < n; j++) {
            c.push(i & (1 << j) ? 1 : 0);  
            }
            r.push(c);
        }
        return r;  
    }

    public static getSpecificQubitPercentage(qbitsOutputVector: number[], totalNumberOfQubits: number, qubitIndex: number) : number {
        const squaredValues = qbitsOutputVector.map(val => math.pow(val, 2));
        const binaryMatrix = SimulatorUtils.binaryCombinations(totalNumberOfQubits);
        return squaredValues.reduce((a, b, i) => a + (binaryMatrix[i][qubitIndex] ? b : 0), 0);
    }

}
