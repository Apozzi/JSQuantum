
export default class Qubit {
    alpha: any;
    beta: any;

    constructor(alpha: any, beta: any) {
        this.setAlpha(alpha);
        this.setBeta(beta);
    }

    setAlpha(alpha: any) {
        this.alpha = alpha;
    }

    setBeta(beta: any) {
        this.beta = beta;
    }

    getAlpha() {
        return this.alpha;
    }

    getBeta() {
        return this.beta;
    }

    toVector() {
        return [[this.alpha],[this.beta]];
    }

    static createFromNumber(number: number) {
        return new Qubit(1 - number, number);
    }
    
}
