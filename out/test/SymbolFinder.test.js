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
const assert = __importStar(require("assert"));
const vscode = __importStar(require("vscode"));
const SymbolFinder_1 = require("../utils/SymbolFinder");
function createSymbol(name, startLine, endLine, children = []) {
    return {
        name,
        detail: '',
        kind: vscode.SymbolKind.Class,
        range: new vscode.Range(startLine, 0, endLine, Number.MAX_SAFE_INTEGER),
        selectionRange: new vscode.Range(startLine, 0, startLine, 0),
        children,
        tags: [],
    };
}
suite('SymbolFinder', () => {
    test('returns empty array when no symbols contain the position', () => {
        const symbols = [createSymbol('Class', 0, 5)];
        const position = new vscode.Position(10, 0);
        assert.deepStrictEqual((0, SymbolFinder_1.findSymbolPath)(symbols, position), []);
    });
    test('returns single symbol when cursor is inside it', () => {
        const symbols = [createSymbol('UserService', 0, 20)];
        const position = new vscode.Position(5, 4);
        assert.deepStrictEqual((0, SymbolFinder_1.findSymbolPath)(symbols, position), ['UserService']);
    });
    test('returns nested symbol hierarchy', () => {
        const symbols = [
            createSymbol('Class', 0, 30, [
                createSymbol('method', 5, 20, [
                    createSymbol('local function', 10, 15, [
                        createSymbol('variable', 12, 12),
                    ]),
                ]),
            ]),
        ];
        const position = new vscode.Position(12, 2);
        assert.deepStrictEqual((0, SymbolFinder_1.findSymbolPath)(symbols, position), [
            'Class',
            'method',
            'local function',
            'variable',
        ]);
    });
    test('returns shallowest matching symbol when cursor is not in a child', () => {
        const symbols = [
            createSymbol('Class', 0, 30, [
                createSymbol('method', 5, 10),
            ]),
        ];
        const position = new vscode.Position(20, 0);
        assert.deepStrictEqual((0, SymbolFinder_1.findSymbolPath)(symbols, position), ['Class']);
    });
    test('returns empty array for empty symbols', () => {
        const position = new vscode.Position(0, 0);
        assert.deepStrictEqual((0, SymbolFinder_1.findSymbolPath)([], position), []);
    });
});
//# sourceMappingURL=SymbolFinder.test.js.map