export default class FileUtils {

    protected static getGatesArrayObj(documentobj: any) {
        const gateSets = [...documentobj.getElementsByClassName("gateSet")];
        const gateArray = [];
        for ( let gateEl of gateSets) {
            gateArray.push({
            gate: gateEl.id.slice(0, -3),
            x: parseInt(gateEl.parentElement.id.split("_")[1]),
            y: parseInt(gateEl.parentElement.id.split("_")[2])
        });
        }
        return gateArray;
    }

    protected static downloadFile(documentobj:any, data: any, filename: any, type:any ) {
        let file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob)
            window.navigator.msSaveOrOpenBlob(file, filename);
        else {
            let a = documentobj.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            documentobj.body.appendChild(a);
            a.click();
            setTimeout(function() {
              documentobj.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
      }
    
}
