// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
var API_KEY = "add here";
async function parseNarrationChain(chain) {
  try {
    const cleanedText = chain.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Given this Arabic hadith chain: "${cleanedText}", extract:
            1. The narrators in order
            2. The transmission types between them
            Respond only with a JSON object containing "narrators" (array) and "transmissions" (array).`
          }]
        }]
      })
    });
    if (!response.ok) {
      throw new Error(`API request failed (${response.status})`);
    }
    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error("No text found in Gemini response");
    }
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in Gemini response");
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Failed to parse Gemini response:", responseText);
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse Gemini response: ${errorMsg}`);
    }
  } catch (error) {
    console.error("Error in parseNarrationChain:", error);
    throw error;
  }
}
async function mergeNarrationChains(originalChain, newChain) {
  try {
    const cleanedOriginal = originalChain.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "");
    const cleanedNew = newChain.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "");
    const originalChainResult = await parseNarrationChain(originalChain);
    const newChainResult = await parseNarrationChain(newChain);
    const allNarrators = [...originalChainResult.narrators, ...newChainResult.narrators].filter(
      (narrator, index, self) => self.indexOf(narrator) === index
    );
    const allTransmissions = [...originalChainResult.transmissions, ...newChainResult.transmissions].filter(
      (transmission, index, self) => self.indexOf(transmission) === index
    );
    const connections = [];
    const commonNarrators = originalChainResult.narrators.filter(
      (narrator) => newChainResult.narrators.includes(narrator)
    );
    const narratorMap = /* @__PURE__ */ new Map();
    for (const narrator of allNarrators) {
      narratorMap.set(narrator, { parents: [], children: [] });
    }
    for (let i = 0; i < originalChainResult.narrators.length - 1; i++) {
      const parent = originalChainResult.narrators[i];
      const child = originalChainResult.narrators[i + 1];
      const type = originalChainResult.transmissions[i] || "\u0639\u0646";
      const parentNode = narratorMap.get(parent);
      if (parentNode && !parentNode.children.find((c) => c.narrator === child)) {
        parentNode.children.push({ narrator: child, type });
      }
      const childNode = narratorMap.get(child);
      if (childNode && !childNode.parents.find((p) => p.narrator === parent)) {
        childNode.parents.push({ narrator: parent, type });
      }
    }
    for (let i = 0; i < newChainResult.narrators.length - 1; i++) {
      const parent = newChainResult.narrators[i];
      const child = newChainResult.narrators[i + 1];
      const type = newChainResult.transmissions[i] || "\u0639\u0646";
      const parentNode = narratorMap.get(parent);
      if (parentNode && !parentNode.children.find((c) => c.narrator === child)) {
        parentNode.children.push({ narrator: child, type });
      }
      const childNode = narratorMap.get(child);
      if (childNode && !childNode.parents.find((p) => p.narrator === parent)) {
        childNode.parents.push({ narrator: parent, type });
      }
    }
    Array.from(narratorMap.entries()).forEach(([narrator, relations]) => {
      for (const child of relations.children) {
        connections.push({
          from: narrator,
          to: child.narrator,
          type: child.type
        });
      }
    });
    return {
      narrators: allNarrators,
      transmissions: allTransmissions,
      structure: {
        root: originalChainResult.narrators[0],
        // Use the first narrator from original chain as root
        connections
      }
    };
  } catch (error) {
    console.error("Error in mergeNarrationChains:", error);
    throw error;
  }
}
async function registerRoutes(app2) {
  app2.post("/api/analyze", async (req, res) => {
    try {
      const { narrationChain } = req.body;
      if (!narrationChain) {
        return res.status(400).json({ message: "Narration chain is required" });
      }
      const analysis = await parseNarrationChain(narrationChain);
      return res.status(200).json(analysis);
    } catch (error) {
      console.error("Error analyzing narration chain:", error);
      return res.status(500).json({ message: "Failed to analyze narration chain" });
    }
  });
  app2.post("/api/merge", async (req, res) => {
    try {
      const { originalChain, newChain } = req.body;
      if (!originalChain || !newChain) {
        return res.status(400).json({ message: "Both original and new narration chains are required" });
      }
      const mergedAnalysis = await mergeNarrationChains(originalChain, newChain);
      return res.status(200).json(mergedAnalysis);
    } catch (error) {
      console.error("Error merging narration chains:", error);
      return res.status(500).json({ message: "Failed to merge narration chains" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "localhost"
  }, () => {
    log(`serving on http://localhost:${port}`);
  });
})();
