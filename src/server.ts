import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import { getFiles } from "./utils/fileUtils";
import { parseImports } from "./utils/parser";
import {buildGraph, detectCycles, generateSummary } from "./utils/graphUtils";
import { analyzeDependenciesWithLLM } from "./llm/llmAnalyzer";


const app=express();
app.use(cors());
app.use(express.json());

app.post("/api/analyze",async(req,res)=>{
    try{
        const {projectPath}=req.body;
        if (!projectPath) {
            return res.status(400).json({ error: "Missing projectPath" });
        }
        const files=getFiles(projectPath);
        console.log(`Found ${files.length} files`)

        const graph=buildGraph(files,parseImports);
        const summary=generateSummary(graph);
        const cycles=detectCycles(graph);

        const llmResult=await analyzeDependenciesWithLLM(summary);

        return res.json({
            summary,
            cycles,
            llmResult,
        });
    }catch(err){
        console.error("Error during analysis:", err);
        return res.status(500).json({ error: "Internal server error", details: err });
      }
});

const PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})