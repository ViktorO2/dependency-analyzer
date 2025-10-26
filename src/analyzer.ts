import path from "path"
import { getFiles } from "./utils/fileUtils";
import { buildGraph, detectCycles, generateSummary } from "./utils/graphUtils";
import { parseImports } from "./utils/parser";
import { analyzeDependenciesWithLLM } from "./llm/llmAnalyzer";

(async()=>{
    try{    
    const sampleDir=path.join(__dirname,"sample");
    
    const files=getFiles(sampleDir);
    console.log("Found TS files:")
    console.log(files);

    const graph=buildGraph(files,parseImports);
    console.log("\n Dependecies graph:");
    console.log(graph);

    const summary=generateSummary(graph);
    console.log("\n Summary for LLM:");
    console.table(summary);

    const cycles= detectCycles(graph);
    console.log("Circular dependencies:");
    if(cycles.length===0)console.log("No circular dependencies found!")
        else cycles.forEach(cycle=>console.log("Cycle detected:", cycle.join(" -> ")));

    console.log("Sending Summary to Gemini LLM for analysis...");
    const analysis=await analyzeDependenciesWithLLM(summary);

    console.log("\n=== Gemini Analysis Results ===\n");


    console.log(`Complexity: ${analysis.complexity}\n`);


    if (analysis.issues?.length) {
        console.log("Issues detected:");
        analysis.issues.forEach((issue: any, idx: number) => {
          console.log(
            `${idx + 1}. [${issue.type}] ${issue.module || issue.modules.join(", ")}`
          );
          console.log(`   Description: ${issue.description}\n`);
        });
      }
    
      if(analysis.recommendations.length){
        console.log("Recommendations:");
        analysis.recommendations.forEach((rec:any, idx: number)=>{
            console.log(`${idx + 1}. ${rec.title}`);
            if (rec.applies_to?.length) {
                console.log(`   Applies to: ${rec.applies_to.join(", ")}`);
              }
            console.log(`   Details: ${rec.description}\n`);
        });
      } 
    }catch(err){
        console.error("Error during analysis:", err);
    }

})();