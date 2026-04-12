var _a;
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
var repoName = (_a = process.env.GITHUB_REPOSITORY) === null || _a === void 0 ? void 0 : _a.split("/")[1];
var isGitHubActions = process.env.GITHUB_ACTIONS === "true";
export default defineConfig({
    base: isGitHubActions && repoName ? "/".concat(repoName, "/") : "/",
    plugins: [react()],
});
