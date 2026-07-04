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
const vscode = __importStar(require("vscode"));
const filePathSegments_1 = require("../utils/filePathSegments");
const SymbolFinder_1 = require("../utils/SymbolFinder");
exports.SYMBOL_SEPARATOR = ' > ';
function formatBreadcrumb(fileSegments, symbolPath) {
    const filePath = fileSegments.join('/');
    if (symbolPath.length === 0) {
        return filePath;
    }
    return `${filePath}:${symbolPath.join(exports.SYMBOL_SEPARATOR)}`;
}
async function buildBreadcrumb(editor) {
    const { document, selection } = editor;
    const uri = document.uri;
    const position = selection.active;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
    const fileSegments = (0, filePathSegments_1.getFilePathSegments)(uri, workspaceFolder ?? undefined);
    const symbols = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri);
    const symbolPath = (0, SymbolFinder_1.findSymbolPath)(symbols ?? [], position);
    return formatBreadcrumb(fileSegments, symbolPath);
}
//# sourceMappingURL=BreadcrumbService.js.map