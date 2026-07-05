import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { formatBreadcrumb, formatBreadcrumbJson } from '../services/BreadcrumbService';
import { getFilePath, getFilePathSegments } from '../utils/filePathSegments';

function createWorkspaceFolder(fsPath: string): vscode.WorkspaceFolder {
	return {
		uri: vscode.Uri.file(fsPath),
		name: path.basename(fsPath),
		index: 0,
	};
}

suite('filePathSegments', () => {
	test('returns filename only when file is outside workspace', () => {
		const uri = vscode.Uri.file('/tmp/sample.php');

		assert.deepStrictEqual(getFilePathSegments(uri), ['sample.php']);
	});

	test('returns single segment for file at workspace root', () => {
		const workspace = createWorkspaceFolder('/workspace');
		const uri = vscode.Uri.file('/workspace/README.md');

		assert.deepStrictEqual(getFilePathSegments(uri, workspace), ['README.md']);
	});

	test('returns nested path segments for file in subdirectories', () => {
		const workspace = createWorkspaceFolder('/workspace');
		const uri = vscode.Uri.file('/workspace/config/routes.php');

		assert.deepStrictEqual(getFilePathSegments(uri, workspace), ['config', 'routes.php']);
	});

	test('returns deep nested path segments', () => {
		const workspace = createWorkspaceFolder('/workspace');
		const uri = vscode.Uri.file('/workspace/src/Services/UserService.php');

		assert.deepStrictEqual(getFilePathSegments(uri, workspace), [
			'src',
			'Services',
			'UserService.php',
		]);
	});

	test('returns slash-separated relative file path', () => {
		const workspace = createWorkspaceFolder('/home/dev/projects/my-app');
		const uri = vscode.Uri.file('/home/dev/projects/my-app/data/feeds/catalog.xml');

		assert.strictEqual(
			getFilePath(uri, 'relative', workspace),
			'data/feeds/catalog.xml',
		);
	});

	test('returns absolute file path', () => {
		const workspace = createWorkspaceFolder('/home/dev/projects/my-app');
		const uri = vscode.Uri.file('/home/dev/projects/my-app/data/feeds/catalog.xml');

		assert.strictEqual(
			getFilePath(uri, 'absolute', workspace),
			'/home/dev/projects/my-app/data/feeds/catalog.xml',
		);
	});

	test('returns absolute file path even when outside workspace', () => {
		const uri = vscode.Uri.file('/tmp/sample.php');

		assert.strictEqual(getFilePath(uri, 'absolute'), '/tmp/sample.php');
	});
});

suite('BreadcrumbService formatting', () => {
	test('formats relative file path and symbols as file_path:code_path', () => {
		const filePath = 'data/feeds/comments.xml';
		const symbolPath = ['rss', 'channel', 'item', 'comments'];

		assert.strictEqual(
			formatBreadcrumb(filePath, symbolPath),
			'data/feeds/comments.xml:rss > channel > item > comments',
		);
	});

	test('formats absolute file path and symbols as file_path:code_path', () => {
		const filePath = '/home/dev/projects/my-app/data/feeds/catalog.xml';
		const symbolPath = ['rss', 'channel', 'item', 'customfields'];

		assert.strictEqual(
			formatBreadcrumb(filePath, symbolPath),
			'/home/dev/projects/my-app/data/feeds/catalog.xml:rss > channel > item > customfields',
		);
	});

	test('formats nested source file with symbol hierarchy', () => {
		const filePath = 'src/Services/UserService.php';
		const symbolPath = ['createUser', 'validateEmail'];

		assert.strictEqual(
			formatBreadcrumb(filePath, symbolPath),
			'src/Services/UserService.php:createUser > validateEmail',
		);
	});

	test('returns file path only when there are no symbols', () => {
		assert.strictEqual(formatBreadcrumb('README.md', []), 'README.md');
	});

	test('returns nested file path only when there are no symbols', () => {
		assert.strictEqual(formatBreadcrumb('config/routes.php', []), 'config/routes.php');
	});
});

suite('BreadcrumbService JSON formatting', () => {
	test('formats relative file path, symbols, and line as JSON', () => {
		const filePath = 'packages/actions/src/Action.php';
		const symbolPath = ['Action', 'getSchemaComponentState'];

		assert.strictEqual(
			formatBreadcrumbJson(filePath, symbolPath, 605),
			'{ "file_path": "packages/actions/src/Action.php", "code_path": ["Action", "getSchemaComponentState"], "line": 605 }',
		);
	});

	test('formats absolute file path, symbols, and line as JSON', () => {
		const filePath = '/home/dev/projects/my-app/data/feeds/catalog.xml';
		const symbolPath = ['rss', 'channel', 'item', 'customfields'];

		assert.strictEqual(
			formatBreadcrumbJson(filePath, symbolPath, 125),
			'{ "file_path": "/home/dev/projects/my-app/data/feeds/catalog.xml", "code_path": ["rss", "channel", "item", "customfields"], "line": 125 }',
		);
	});

	test('formats empty code_path array when there are no symbols', () => {
		assert.strictEqual(
			formatBreadcrumbJson('README.md', [], 1),
			'{ "file_path": "README.md", "code_path": [], "line": 1 }',
		);
	});

	test('escapes quotes in symbol names', () => {
		assert.strictEqual(
			formatBreadcrumbJson('src/foo.ts', ['method "test"'], 10),
			'{ "file_path": "src/foo.ts", "code_path": ["method \\"test\\""], "line": 10 }',
		);
	});
});
