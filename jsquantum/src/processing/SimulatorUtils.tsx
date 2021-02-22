import Qubit from "./Qubit";
import QuantumLogicGateTrasform from "./QuantumLogicGateTrasform";
const math = require('mathjs');


export default class SimulatorUtils {

    public static qGateTransformingByString(qubit: Qubit, gateAsStr: String) : Qubit {
        switch (gateAsStr) {
            case "HGateSet":
                return QuantumLogicGateTrasform.hadamardGate(qubit);
            case "XGateSet":
                return QuantumLogicGateTrasform.pauliX(qubit);
            case "YGateSet":
                return QuantumLogicGateTrasform.pauliY(qubit);
            case "ZGateSet":
                return QuantumLogicGateTrasform.pauliZ(qubit);
            case "SGateSet":
                return QuantumLogicGateTrasform.phase(qubit);
            case "TGateSet":
                 return qubit;
            default:
                return qubit;
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

}
