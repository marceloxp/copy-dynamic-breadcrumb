import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
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
	test('joins file segments and symbols with separator', () => {
		const fileSegments = ['src', 'Services', 'UserService.php'];
		const symbolPath = ['createUser', 'validateEmail'];
		const breadcrumb = [...fileSegments, ...symbolPath].join(' > ');

		assert.strictEqual(
			breadcrumb,
			'src > Services > UserService.php > createUser > validateEmail',
		);
	});

	test('returns filename only when there are no symbols', () => {
		const fileSegments = ['README.md'];
		const symbolPath: string[] = [];
		const breadcrumb = [...fileSegments, ...symbolPath].join(' > ');

		assert.strictEqual(breadcrumb, 'README.md');
	});
});
