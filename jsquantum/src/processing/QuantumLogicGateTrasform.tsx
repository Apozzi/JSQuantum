import Qubit from "./Qubit";
const math = require('mathjs');


export default class QuantumLogicGateTrasform {

    public static hadamardGate(qubit: Qubit) : Qubit {
        const linearVector = [1 , 1, 1, -1];
        const constMult = 1 / Math.sqrt(2);
        const resultVector = this.qVectorMulti4x4(linearVector, qubit.getAlpha(), qubit.getBeta());
        return new Qubit(math.multiply(resultVector[0], constMult), math.multiply(resultVector[1], constMult));
    }

    public static pauliX(qubit: Qubit) : Qubit {
        const linearVector = [0, 1, 1, 0];
        const resultVector = this.qVectorMulti4x4(linearVector, qubit.getAlpha(), qubit.getBeta());
        return this.createQubitByArray(resultVector);
    }

    public static pauliY(qubit: Qubit) : Qubit {
        const linearVector = [0, math.complex(0, -1), math.complex(0, 1), 0];
        const resultVector = this.qVectorMulti4x4(linearVector, qubit.getAlpha(), qubit.getBeta());
        return this.createQubitByArray(resultVector);
    }

    public static pauliZ(qubit: Qubit) : Qubit {
        const linearVector = [1, 0, 0, -1];
        const resultVector = this.qVectorMulti4x4(linearVector, qubit.getAlpha(), qubit.getBeta());
        return this.createQubitByArray(resultVector);
    }

    public static phase(qubit: Qubit) : Qubit {
        const linearVector = [1, 0, 0, math.complex(0, 1)];
        const resultVector = this.qVectorMulti4x4(linearVector, qubit.getAlpha(), qubit.getBeta());
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
 

}
