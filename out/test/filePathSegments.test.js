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
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const BreadcrumbService_1 = require("../services/BreadcrumbService");
const filePathSegments_1 = require("../utils/filePathSegments");
function createWorkspaceFolder(fsPath) {
    return {
        uri: vscode.Uri.file(fsPath),
        name: path.basename(fsPath),
        index: 0,
    };
}
suite('filePathSegments', () => {
    test('returns filename only when file is outside workspace', () => {
        const uri = vscode.Uri.file('/tmp/teste.php');
        assert.deepStrictEqual((0, filePathSegments_1.getFilePathSegments)(uri), ['teste.php']);
    });
    test('returns single segment for file at workspace root', () => {
        const workspace = createWorkspaceFolder('/workspace');
        const uri = vscode.Uri.file('/workspace/README.md');
        assert.deepStrictEqual((0, filePathSegments_1.getFilePathSegments)(uri, workspace), ['README.md']);
    });
    test('returns nested path segments for file in subdirectories', () => {
        const workspace = createWorkspaceFolder('/workspace');
        const uri = vscode.Uri.file('/workspace/config/routes.php');
        assert.deepStrictEqual((0, filePathSegments_1.getFilePathSegments)(uri, workspace), ['config', 'routes.php']);
    });
    test('returns deep nested path segments', () => {
        const workspace = createWorkspaceFolder('/workspace');
        const uri = vscode.Uri.file('/workspace/src/Services/UserService.php');
        assert.deepStrictEqual((0, filePathSegments_1.getFilePathSegments)(uri, workspace), [
            'src',
            'Services',
            'UserService.php',
        ]);
    });
});
suite('BreadcrumbService formatting', () => {
    test('formats file path and symbols as file_path:code_path', () => {
        const fileSegments = [
            '.ai',
            'Jira',
            'abertos',
            'VM-2973',
            'cards-correlatos',
            'VM-2978.xml',
        ];
        const symbolPath = ['rss', 'channel', 'item', 'comments'];
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumb)(fileSegments, symbolPath), '.ai/Jira/abertos/VM-2973/cards-correlatos/VM-2978.xml:rss > channel > item > comments');
    });
    test('formats nested source file with symbol hierarchy', () => {
        const fileSegments = ['src', 'Services', 'UserService.php'];
        const symbolPath = ['createUser', 'validateEmail'];
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumb)(fileSegments, symbolPath), 'src/Services/UserService.php:createUser > validateEmail');
    });
    test('returns file path only when there are no symbols', () => {
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumb)(['README.md'], []), 'README.md');
    });
    test('returns nested file path only when there are no symbols', () => {
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumb)(['config', 'routes.php'], []), 'config/routes.php');
    });
});
//# sourceMappingURL=filePathSegments.test.js.map