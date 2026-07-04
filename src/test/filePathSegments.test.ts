import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { formatBreadcrumb } from '../services/BreadcrumbService';
import { getFilePathSegments } from '../utils/filePathSegments';

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

		assert.strictEqual(
			formatBreadcrumb(fileSegments, symbolPath),
			'.ai/Jira/abertos/VM-2973/cards-correlatos/VM-2978.xml:rss > channel > item > comments',
		);
	});

	test('formats nested source file with symbol hierarchy', () => {
		const fileSegments = ['src', 'Services', 'UserService.php'];
		const symbolPath = ['createUser', 'validateEmail'];

		assert.strictEqual(
			formatBreadcrumb(fileSegments, symbolPath),
			'src/Services/UserService.php:createUser > validateEmail',
		);
	});

	test('returns file path only when there are no symbols', () => {
		assert.strictEqual(formatBreadcrumb(['README.md'], []), 'README.md');
	});

	test('returns nested file path only when there are no symbols', () => {
		assert.strictEqual(formatBreadcrumb(['config', 'routes.php'], []), 'config/routes.php');
	});
});
