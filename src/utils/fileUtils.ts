import * as fs from "fs";
import * as path from "path";

export const SUPPORTED_EXTENSIONS=[".ts", ".tsx", ".js", ".jsx"];

export const getFiles=(dir: string ): string[]=>{
    let files: string[]=[];
    fs.readdirSync(dir).forEach(file=> {
    const fullPath=path.join(dir,file);

    if(fs.statSync(fullPath).isDirectory()){
        files=files.concat(getFiles(fullPath));
    }else if(SUPPORTED_EXTENSIONS.includes(path.extname(file))){
        files.push(fullPath);
    }
    
    
});
return files;
};

export const readFile=(filePath: string): string =>{
    return fs.readFileSync(filePath, "utf-8");
};