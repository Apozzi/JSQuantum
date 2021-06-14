import { Subject } from "rxjs";



export default class QuantumSchematicsManager {

  private static cleanSubject = new Subject();
  private static importSubject = new Subject();
  private static exportSubject = new Subject<String>();
  private static updateSubject = new Subject();
  private static qubitsSize = 0;

  static clean() {
    QuantumSchematicsManager.cleanSubject.next();
  }

  static import() {
    QuantumSchematicsManager.importSubject.next();
  }

  static updateSchematics() {
    QuantumSchematicsManager.updateSubject.next();
  }

  static export(projectName: String) {
    QuantumSchematicsManager.exportSubject.next(projectName);
  }

  static onClean() {
    return QuantumSchematicsManager.cleanSubject;
  }
  static onImport() {
    return QuantumSchematicsManager.importSubject;
  }
  static onExport() {
    return QuantumSchematicsManager.exportSubject;
  }
  static onUpdateSchematics() {
    return QuantumSchematicsManager.updateSubject;
  }

  static setSize(size: number) {
    this.qubitsSize = size;
  }

  static getSize() : number {
    return this.qubitsSize;
  }

}