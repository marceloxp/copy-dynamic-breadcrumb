import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { formatBreadcrumb } from '../services/BreadcrumbService';
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
		const uri = vscode.Uri.file('/tmp/teste.php');

		assert.deepStrictEqual(getFilePathSegments(uri), ['teste.php']);
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
		const workspace = createWorkspaceFolder('/home/xp/projects');
		const uri = vscode.Uri.file('/home/xp/projects/.ai/Jira/abertos/VM-2973/VM-2973.xml');

		assert.strictEqual(
			getFilePath(uri, 'relative', workspace),
			'.ai/Jira/abertos/VM-2973/VM-2973.xml',
		);
	});

	test('returns absolute file path', () => {
		const workspace = createWorkspaceFolder('/home/xp/projects');
		const uri = vscode.Uri.file('/home/xp/projects/.ai/Jira/abertos/VM-2973/VM-2973.xml');

		assert.strictEqual(
			getFilePath(uri, 'absolute', workspace),
			'/home/xp/projects/.ai/Jira/abertos/VM-2973/VM-2973.xml',
		);
	});

	test('returns absolute file path even when outside workspace', () => {
		const uri = vscode.Uri.file('/tmp/teste.php');

		assert.strictEqual(getFilePath(uri, 'absolute'), '/tmp/teste.php');
	});
});

suite('BreadcrumbService formatting', () => {
	test('formats relative file path and symbols as file_path:code_path', () => {
		const filePath = '.ai/Jira/abertos/VM-2973/cards-correlatos/VM-2978.xml';
		const symbolPath = ['rss', 'channel', 'item', 'comments'];

		assert.strictEqual(
			formatBreadcrumb(filePath, symbolPath),
			'.ai/Jira/abertos/VM-2973/cards-correlatos/VM-2978.xml:rss > channel > item > comments',
		);
	});

	test('formats absolute file path and symbols as file_path:code_path', () => {
		const filePath = '/home/xp/projects/.ai/Jira/abertos/VM-2973/VM-2973.xml';
		const symbolPath = ['rss', 'channel', 'item', 'customfields'];

		assert.strictEqual(
			formatBreadcrumb(filePath, symbolPath),
			'/home/xp/projects/.ai/Jira/abertos/VM-2973/VM-2973.xml:rss > channel > item > customfields',
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
