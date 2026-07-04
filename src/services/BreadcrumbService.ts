import * as vscode from 'vscode';
import { getFilePathSegments } from '../utils/filePathSegments';
import { findSymbolPath } from '../utils/SymbolFinder';

export const SYMBOL_SEPARATOR = ' > ';

export function formatBreadcrumb(fileSegments: string[], symbolPath: string[]): string {
	const filePath = fileSegments.join('/');
	if (symbolPath.length === 0) {
		return filePath;
	}

	return `${filePath}:${symbolPath.join(SYMBOL_SEPARATOR)}`;
}

export async function buildBreadcrumb(editor: vscode.TextEditor): Promise<string> {
	const { document, selection } = editor;
	const uri = document.uri;
	const position = selection.active;
	const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
	const fileSegments = getFilePathSegments(uri, workspaceFolder ?? undefined);

	const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
		'vscode.executeDocumentSymbolProvider',
		uri,
	);
	const symbolPath = findSymbolPath(symbols ?? [], position);

	return formatBreadcrumb(fileSegments, symbolPath);
}
