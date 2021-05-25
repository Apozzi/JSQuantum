
export default class CustomGate {
    name: string = "";
    matrix: number[][] = [];
    uuid: string = "";

    constructor(name: string, matrix: number[][]) {
        this.setName(name);
        this.setMatrix(matrix);
        this.uuid = this.generateUniqueId();
    }

    setName(name: string) {
        this.name = name;
    }

    setMatrix(matrix: number[][]) {
        this.matrix = matrix;
    }

    getName() {
        return this.name;
    }

    getMatrix() {
        return this.matrix;
    }

    getUuId() {
        return this.uuid;
    }

    getPrefix() {
        return this.name.substring(0,2).toUpperCase();
    }

    private generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2)
    }

}
