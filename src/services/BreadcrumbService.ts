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

function formatCodePath(symbolPath: string[]): string {
	return `[${symbolPath.map((segment) => JSON.stringify(segment)).join(', ')}]`;
}

export function formatBreadcrumbJson(
	filePath: string,
	symbolPath: string[],
	line: number,
): string {
	const codePath = formatCodePath(symbolPath);
	return `{ "file_path": ${JSON.stringify(filePath)}, "code_path": ${codePath}, "line": ${line} }`;
}

export function formatBreadcrumbJsonSelection(
	filePath: string,
	symbolPath: string[],
	startLine: number,
	endLine: number,
): string {
	const codePath = formatCodePath(symbolPath);
	return `{ "file_path": ${JSON.stringify(filePath)}, "code_path": ${codePath}, "selection": { "start_line": ${startLine}, "end_line": ${endLine} } }`;
}

function topOfSelection(selection: vscode.Selection): vscode.Position {
	return selection.start.line <= selection.end.line ? selection.start : selection.end;
}

export async function buildBreadcrumbJson(
	editor: vscode.TextEditor,
	pathStyle: PathStyle,
): Promise<string> {
	const { document, selection } = editor;
	const uri = document.uri;
	const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
	const filePath = getFilePath(uri, pathStyle, workspaceFolder ?? undefined);

	const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
		'vscode.executeDocumentSymbolProvider',
		uri,
	);
	const symbolPosition = selection.isEmpty ? selection.active : topOfSelection(selection);
	const symbolPath = findSymbolPath(symbols ?? [], symbolPosition);

	if (selection.start.line !== selection.end.line) {
		const startLine = Math.min(selection.start.line, selection.end.line) + 1;
		const endLine = Math.max(selection.start.line, selection.end.line) + 1;
		return formatBreadcrumbJsonSelection(filePath, symbolPath, startLine, endLine);
	}

	const line = selection.active.line + 1;
	return formatBreadcrumbJson(filePath, symbolPath, line);
}
