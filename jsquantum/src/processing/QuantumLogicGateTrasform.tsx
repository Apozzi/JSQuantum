import Qubit from "./Qubit";
const math = require('mathjs');


export default class QuantumLogicGateTrasform {

    private static readonly invSqrt = 1 / Math.sqrt(2);

    public static readonly hadamartMatrix = [
        QuantumLogicGateTrasform.invSqrt, 
        QuantumLogicGateTrasform.invSqrt, 
        QuantumLogicGateTrasform.invSqrt, 
        -QuantumLogicGateTrasform.invSqrt
    ];
    public static readonly pauliXMatrix = [0, 1, 1, 0];
    public static readonly pauliYMatrix = [0, math.complex(0, -1), math.complex(0, 1), 0];;
    public static readonly pauliZMatrix = [1, 0, 0, -1];
    public static readonly phaseMatrix = [1, 0, 0, math.complex(0, 1)];

    public static hadamardGate(qubit: Qubit) : Qubit {
        return this.applyMatrixToQubit(qubit, QuantumLogicGateTrasform.hadamartMatrix);
    }

    public static pauliX(qubit: Qubit) : Qubit {
        return this.applyMatrixToQubit(qubit, QuantumLogicGateTrasform.pauliXMatrix);
    }

    public static pauliY(qubit: Qubit) : Qubit {
        return this.applyMatrixToQubit(qubit, QuantumLogicGateTrasform.pauliYMatrix);
    }

    public static pauliZ(qubit: Qubit) : Qubit {
        return this.applyMatrixToQubit(qubit, QuantumLogicGateTrasform.pauliZMatrix);
    }

    public static phase(qubit: Qubit) : Qubit {
        return this.applyMatrixToQubit(qubit, QuantumLogicGateTrasform.phaseMatrix);
    }

    public static controlU(uQubit: Qubit, controlledQubits: Array<Qubit>, uMatrix: Array<any>) {
        const normalQubit = uQubit;
        const matrixApplyedQubit = this.applyMatrixToQubit(uQubit, uMatrix);
        let percentage = 1;
        for (let cQubit of controlledQubits) {
            percentage = percentage * this.measureQubit(cQubit);
        }
        return this.createQubitByArray(
            [
             math.sqrt(math.add(math.multiply(math.abs(math.pow(matrixApplyedQubit.getAlpha(), 2)), percentage) , math.multiply(math.abs(math.pow(normalQubit.getAlpha(), 2)) , 1 - percentage))),
             math.sqrt(math.add(math.multiply(math.abs(math.pow(matrixApplyedQubit.getBeta(), 2)), percentage) , math.multiply(math.abs(math.pow(normalQubit.getBeta(), 2)), 1 - percentage))),
            ]);
    }

    private static applyMatrixToQubit(qubit: Qubit, matrix: Array<any>) {
        const resultVector = this.qVectorMulti4x4(matrix, qubit.getAlpha(), qubit.getBeta());
        return this.createQubitByArray(resultVector);
    }

    private static qVectorMulti4x4(vector: Array<any>, alpha:any, beta: any) {
        return [
            math.add(math.multiply(alpha, vector[0]), math.multiply(beta, vector[1])),
            math.add(math.multiply(alpha, vector[2]), math.multiply(beta, vector[3]))
        ];
    }

    private static createQubitByArray(vector: Array<any>) : Qubit {
        return new Qubit(vector[0], vector[1])
    }

    private static measureQubit(qubit: Qubit) : number {
        return math.abs(math.pow(qubit.getBeta(), 2));
    }

   
 
}
