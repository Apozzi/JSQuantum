import { Subject } from "rxjs";
import CustomGate from "./CustomGate";

export default class CustomGateManager {
    private static createdCustomGates: CustomGate[] = [];
    private static displayCustomGates = false;
    private static onChangeSubject = new Subject();

    static addCustomGate(customGate: CustomGate) {
        this.createdCustomGates.push(customGate);
        this.onChangeSubject.next();
    }

    static getCustomGates() {
        return this.createdCustomGates;
    }

    static hasCustomGates() {
        return this.createdCustomGates.length !== 0;
    }

    static showCustomGates() {
        this.displayCustomGates = true;
        this.onChangeSubject.next();
    }

    static hideCustomGates() {
        this.displayCustomGates = false;
        this.onChangeSubject.next();
    }

    static isShownCustomGates() {
        return this.displayCustomGates;
    }

    static onChangeCustomGates() {
        return this.onChangeSubject;
    }

}
