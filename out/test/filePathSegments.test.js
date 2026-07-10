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
        const uri = vscode.Uri.file('/tmp/sample.php');
        assert.deepStrictEqual((0, filePathSegments_1.getFilePathSegments)(uri), ['sample.php']);
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
    test('returns slash-separated relative file path', () => {
        const workspace = createWorkspaceFolder('/home/dev/projects/my-app');
        const uri = vscode.Uri.file('/home/dev/projects/my-app/data/feeds/catalog.xml');
        assert.strictEqual((0, filePathSegments_1.getFilePath)(uri, 'relative', workspace), 'data/feeds/catalog.xml');
    });
    test('returns absolute file path', () => {
        const workspace = createWorkspaceFolder('/home/dev/projects/my-app');
        const uri = vscode.Uri.file('/home/dev/projects/my-app/data/feeds/catalog.xml');
        assert.strictEqual((0, filePathSegments_1.getFilePath)(uri, 'absolute', workspace), '/home/dev/projects/my-app/data/feeds/catalog.xml');
    });
    test('returns absolute file path even when outside workspace', () => {
        const uri = vscode.Uri.file('/tmp/sample.php');
        assert.strictEqual((0, filePathSegments_1.getFilePath)(uri, 'absolute'), '/tmp/sample.php');
    });
});
suite('BreadcrumbService formatting', () => {
    test('formats relative file path and symbols as file_path:code_path', () => {
        const filePath = 'data/feeds/comments.xml';
        const symbolPath = ['rss', 'channel', 'item', 'comments'];
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumb)(filePath, symbolPath), 'data/feeds/comments.xml:rss > channel > item > comments');
    });
    test('formats absolute file path and symbols as file_path:code_path', () => {
        const filePath = '/home/dev/projects/my-app/data/feeds/catalog.xml';
        const symbolPath = ['rss', 'channel', 'item', 'customfields'];
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumb)(filePath, symbolPath), '/home/dev/projects/my-app/data/feeds/catalog.xml:rss > channel > item > customfields');
    });
    test('formats nested source file with symbol hierarchy', () => {
        const filePath = 'src/Services/UserService.php';
        const symbolPath = ['createUser', 'validateEmail'];
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumb)(filePath, symbolPath), 'src/Services/UserService.php:createUser > validateEmail');
    });
    test('returns file path only when there are no symbols', () => {
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumb)('README.md', []), 'README.md');
    });
    test('returns nested file path only when there are no symbols', () => {
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumb)('config/routes.php', []), 'config/routes.php');
    });
});
suite('BreadcrumbService JSON formatting', () => {
    test('formats relative file path, symbols, and line as JSON', () => {
        const filePath = 'packages/actions/src/Action.php';
        const symbolPath = ['Action', 'getSchemaComponentState'];
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumbJson)(filePath, symbolPath, 605), '{ "file_path": "packages/actions/src/Action.php", "code_path": ["Action", "getSchemaComponentState"], "line": 605 }');
    });
    test('formats absolute file path, symbols, and line as JSON', () => {
        const filePath = '/home/dev/projects/my-app/data/feeds/catalog.xml';
        const symbolPath = ['rss', 'channel', 'item', 'customfields'];
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumbJson)(filePath, symbolPath, 125), '{ "file_path": "/home/dev/projects/my-app/data/feeds/catalog.xml", "code_path": ["rss", "channel", "item", "customfields"], "line": 125 }');
    });
    test('formats empty code_path array when there are no symbols', () => {
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumbJson)('README.md', [], 1), '{ "file_path": "README.md", "code_path": [], "line": 1 }');
    });
    test('escapes quotes in symbol names', () => {
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumbJson)('src/foo.ts', ['method "test"'], 10), '{ "file_path": "src/foo.ts", "code_path": ["method \\"test\\""], "line": 10 }');
    });
    test('formats multi-line selection with start_line and end_line', () => {
        const filePath = 'CLAUDE.md';
        const symbolPath = [
            '# fact-factory — Usage doctrine for AI agents',
            '## The golden rule',
        ];
        assert.strictEqual((0, BreadcrumbService_1.formatBreadcrumbJsonSelection)(filePath, symbolPath, 14, 28), '{ "file_path": "CLAUDE.md", "code_path": ["# fact-factory — Usage doctrine for AI agents", "## The golden rule"], "selection": { "start_line": 14, "end_line": 28 } }');
    });
});
//# sourceMappingURL=filePathSegments.test.js.map