import { Subject } from "rxjs";
import FileUtils from "./FileUtils";

export default class QJSFileUtils extends FileUtils {

    static readImportedFile(event: any) {
        const loadedFile = new Subject();
        event.stopPropagation();
        event.preventDefault();
        var file = event.target.files[0];
        if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt) => {
            if (evt.target !== null) {
                let parsedObj = null;
                try {
                    parsedObj = JSON.parse(evt.target.result as string);
                    loadedFile.next(parsedObj);
                } catch {
                    // Tratamento exceção.
                }
            }
        }
        }
        event.target.value = null;
        return loadedFile;
    }

    static exportFile(documentobj: any, projectName: String) {
        const fileArray = this.getGatesArrayObj(documentobj);
        this.downloadFile(documentobj, JSON.stringify(fileArray), projectName + '.qjs', 'text');
    }
    
}
