const math = require('mathjs');

export default class BlochSphereUtils {
    public static getRealCoordenate(qubit: any) {
        return math.pow(math.re(qubit),2);
    }

    public static getImaginaryCoordenate(qubit: any) {
        return math.pow(math.im(qubit),2);
    }
}