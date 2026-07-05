import * as vscode from 'vscode';
import { getFilePath, PathStyle } from '../utils/filePathSegments';
import { findSymbolPath } from '../utils/SymbolFinder';

export const SYMBOL_SEPARATOR = ' > ';

export function formatBreadcrumb(filePath: string, symbolPath: string[]): string {
	if (symbolPath.length === 0) {
		return filePath;
	}

	return `${filePath}:${symbolPath.join(SYMBOL_SEPARATOR)}`;
}

export async function buildBreadcrumb(
	editor: vscode.TextEditor,
	pathStyle: PathStyle,
): Promise<string> {
	const { document, selection } = editor;
	const uri = document.uri;
	const position = selection.active;
	const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
	const filePath = getFilePath(uri, pathStyle, workspaceFolder ?? undefined);

	const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
		'vscode.executeDocumentSymbolProvider',
		uri,
	);
	const symbolPath = findSymbolPath(symbols ?? [], position);

	return formatBreadcrumb(filePath, symbolPath);
}

export function formatBreadcrumbJson(
	filePath: string,
	symbolPath: string[],
	line: number,
): string {
	const codePath = `[${symbolPath.map((segment) => JSON.stringify(segment)).join(', ')}]`;
	return `{ "file_path": ${JSON.stringify(filePath)}, "code_path": ${codePath}, "line": ${line} }`;
}

export async function buildBreadcrumbJson(
	editor: vscode.TextEditor,
	pathStyle: PathStyle,
): Promise<string> {
	const { document, selection } = editor;
	const uri = document.uri;
	const position = selection.active;
	const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
	const filePath = getFilePath(uri, pathStyle, workspaceFolder ?? undefined);

	const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
		'vscode.executeDocumentSymbolProvider',
		uri,
	);
	const symbolPath = findSymbolPath(symbols ?? [], position);
	const line = position.line + 1;

	return formatBreadcrumbJson(filePath, symbolPath, line);
}
