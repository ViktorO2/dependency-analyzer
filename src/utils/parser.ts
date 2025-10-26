import * as ts from "typescript";

export const parseImports=(fileContent: string): string[]=>{
    const sourceFile=ts.createSourceFile(
        "temp.ts",
        fileContent,
        ts.ScriptTarget.ESNext,
        true
    );

    const imports: string[] = [];

    const visit=(node:ts.Node)=>{
        if(ts.isImportDeclaration(node)){
            const modulName=(node.moduleSpecifier as ts.StringLiteral).text;
            imports.push(modulName);
        }
    

    if(
        ts.isCallExpression(node) &&
        node.expression.kind===ts.SyntaxKind.ImportKeyword &&
        node.arguments.length===1
    ){
        const arg = node.arguments[0];
      if (ts.isStringLiteral(arg)) {
        imports.push(arg.text);
      }
    }
    ts.forEachChild(node, visit);
    };
    
visit(sourceFile);
return imports;
};

// export const parseImports=(fileContent: string): string[]=>{
//     const importRegex= /import\s+(?:.*?\s+from\s+)?["'](.+?)["'];?/g;
//     const imports: string[]=[];
//     let match;
//     while((match=importRegex.exec(fileContent))!== null){
//         imports.push(match[1]);
//     }
//     return imports;
// };
