import { Subject } from "rxjs";

export default class QuantumSchematicsManager {

  private static cleanSubject = new Subject();
  private static saveSchematicsSubject = new Subject<String>();
  private static openNewSchematicsSubject = new Subject<any>();
  private static exportSchematicsToLaTeXSubject = new Subject<String>();
  private static exportSchematicsToAsciiSubject = new Subject<String>();
  private static updateSubject = new Subject();
  private static qubitsSize = 0;
  private static qubitsOutputVector : number[] = [];
  private static activePerformanceStatistics = false;
  private static schematicsExecutionTime = 0;

  static clean() {
    QuantumSchematicsManager.cleanSubject.next();
  }

  static openSchematics(gatesObj: any) {
    QuantumSchematicsManager.openNewSchematicsSubject.next(gatesObj);
  }

  static updateSchematics() {
    QuantumSchematicsManager.updateSubject.next();
  }

  static saveNewSchematics(projectName: String) {
    QuantumSchematicsManager.saveSchematicsSubject.next(projectName);
  }

  static exportToLaTeX(projectName: String) {
    QuantumSchematicsManager.exportSchematicsToLaTeXSubject.next(projectName);
  }

  static exportToAscii(projectName: String) {
    QuantumSchematicsManager.exportSchematicsToAsciiSubject.next(projectName);
  }

  static onClean() {
    return QuantumSchematicsManager.cleanSubject;
  }

  static onSaveSchematics() {
    return QuantumSchematicsManager.saveSchematicsSubject;
  }

  static onOpenNewSchematics() {
    return QuantumSchematicsManager.openNewSchematicsSubject;
  }

  static onUpdateSchematics() {
    return QuantumSchematicsManager.updateSubject;
  }

  static onExportSchematicsToLaTeX() {
    return QuantumSchematicsManager.exportSchematicsToLaTeXSubject;
  }

  static onExportSchematicsToAscii() {
    return QuantumSchematicsManager.exportSchematicsToAsciiSubject;
  }

  static togglePerformanceStatistics() {
    this.activePerformanceStatistics = !this.activePerformanceStatistics;
  }

  static isActivePerformanceStatistics() {
    return this.activePerformanceStatistics;
  }
  
  static setSchematicsExecutionTime(time: number) {
    this.schematicsExecutionTime = time;
  }

  static getSchematicsExecutionTime() {
    return this.schematicsExecutionTime;
  }

  static setData(size: number, output: number[]) {
    this.setSize(size);
    this.setOutput(output);
  }

  static setSize(size: number) {
    this.qubitsSize = size;
  }

  static getSize() : number {
    return this.qubitsSize;
  }

  static setOutput(output: number[]) {
    this.qubitsOutputVector = output;
  }

  static getOutput() : number[] {
    return this.qubitsOutputVector;
  }

  static unsubcribeSubjects() {
    QuantumSchematicsManager.cleanSubject.unsubscribe();
    QuantumSchematicsManager.saveSchematicsSubject.unsubscribe();
    QuantumSchematicsManager.openNewSchematicsSubject.unsubscribe();
    QuantumSchematicsManager.exportSchematicsToLaTeXSubject.unsubscribe();
    QuantumSchematicsManager.exportSchematicsToAsciiSubject.unsubscribe();
    QuantumSchematicsManager.updateSubject.unsubscribe();
  }

}