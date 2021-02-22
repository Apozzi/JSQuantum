import { Subject } from "rxjs";



export default class QuantumSchematicsManager {

  static cleanSubject = new Subject();
  static importSubject = new Subject();
  static exportSubject = new Subject<String>();

  static clean() {
    QuantumSchematicsManager.cleanSubject.next();
  }

  static import() {
    QuantumSchematicsManager.importSubject.next();
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

}