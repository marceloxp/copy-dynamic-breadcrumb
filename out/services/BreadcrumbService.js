"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYMBOL_SEPARATOR = void 0;
exports.formatBreadcrumb = formatBreadcrumb;
exports.buildBreadcrumb = buildBreadcrumb;
exports.formatBreadcrumbJson = formatBreadcrumbJson;
exports.formatBreadcrumbJsonSelection = formatBreadcrumbJsonSelection;
exports.buildBreadcrumbJson = buildBreadcrumbJson;
const vscode = __importStar(require("vscode"));
const filePathSegments_1 = require("../utils/filePathSegments");
const SymbolFinder_1 = require("../utils/SymbolFinder");
exports.SYMBOL_SEPARATOR = ' > ';
function formatBreadcrumb(filePath, symbolPath) {
    if (symbolPath.length === 0) {
        return filePath;
    }
    return `${filePath}:${symbolPath.join(exports.SYMBOL_SEPARATOR)}`;
}
async function buildBreadcrumb(editor, pathStyle) {
    const { document, selection } = editor;
    const uri = document.uri;
    const position = selection.active;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
    const filePath = (0, filePathSegments_1.getFilePath)(uri, pathStyle, workspaceFolder ?? undefined);
    const symbols = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri);
    const symbolPath = (0, SymbolFinder_1.findSymbolPath)(symbols ?? [], position);
    return formatBreadcrumb(filePath, symbolPath);
}
function formatCodePath(symbolPath) {
    return `[${symbolPath.map((segment) => JSON.stringify(segment)).join(', ')}]`;
}
function formatBreadcrumbJson(filePath, symbolPath, line) {
    const codePath = formatCodePath(symbolPath);
    return `{ "file_path": ${JSON.stringify(filePath)}, "code_path": ${codePath}, "line": ${line} }`;
}
function formatBreadcrumbJsonSelection(filePath, symbolPath, startLine, endLine) {
    const codePath = formatCodePath(symbolPath);
    return `{ "file_path": ${JSON.stringify(filePath)}, "code_path": ${codePath}, "selection": { "start_line": ${startLine}, "end_line": ${endLine} } }`;
}
function topOfSelection(selection) {
    return selection.start.line <= selection.end.line ? selection.start : selection.end;
}
async function buildBreadcrumbJson(editor, pathStyle) {
    const { document, selection } = editor;
    const uri = document.uri;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
    const filePath = (0, filePathSegments_1.getFilePath)(uri, pathStyle, workspaceFolder ?? undefined);
    const symbols = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri);
    const symbolPosition = selection.isEmpty ? selection.active : topOfSelection(selection);
    const symbolPath = (0, SymbolFinder_1.findSymbolPath)(symbols ?? [], symbolPosition);
    if (selection.start.line !== selection.end.line) {
        const startLine = Math.min(selection.start.line, selection.end.line) + 1;
        const endLine = Math.max(selection.start.line, selection.end.line) + 1;
        return formatBreadcrumbJsonSelection(filePath, symbolPath, startLine, endLine);
    }
    const line = selection.active.line + 1;
    return formatBreadcrumbJson(filePath, symbolPath, line);
}
//# sourceMappingURL=BreadcrumbService.js.map