import * as fs from "fs";
import * as path from "path";
import { SUPPORTED_EXTENSIONS } from "./fileUtils"; 

export type Graph=Record<string,string[]>;

export const buildGraph=(files: string[],parseFn:(content:string)=>string[]): Graph =>{
    const graph: Graph= {};
    files.forEach(file => {
        const content=fs.readFileSync(file, "utf-8");
        const imports=parseFn(content)
        .map(imp=>{
            for(const ext of SUPPORTED_EXTENSIONS){
            let resolved= path.resolve(path.dirname(file),imp);
            if (!path.extname(resolved)) resolved += ext;
            if (fs.existsSync(resolved)) return resolved;
        }
            return null;
        })
        .filter((f): f is string => f !== null);

        graph[file] = imports;
    });
    return graph;

};


export const detectCycles=(graph: Graph): string[][] => {
    const visited = new Set<string>();
    const stack = new Set<string>();
    const cycles: string[][]=[];

    const dfs=(node: string, pathSoFar: string[])=>{
        if(stack.has(node)){
            cycles.push([...pathSoFar,node]);
            return;
        }
        if(visited.has(node))return;

        visited.add(node);
        stack.add(node);
        (graph[node] || []).forEach(neighbor => dfs(neighbor, [...pathSoFar, node]));
        stack.delete(node);
      };
    Object.keys(graph).forEach(node=> dfs(node,[]));
    return cycles;
};


export const generateSummary = (graph: Graph) => {
    return Object.entries(graph).map(([file, deps]) => ({
      file: path.basename(file),
      imports: deps.map(d => path.basename(d))
    }));
  };