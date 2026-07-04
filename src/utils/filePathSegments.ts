import * as path from 'path';
import * as vscode from 'vscode';

export function getFilePathSegments(
	uri: vscode.Uri,
	workspaceFolder?: vscode.WorkspaceFolder,
): string[] {
	if (workspaceFolder) {
		const relative = path.relative(workspaceFolder.uri.fsPath, uri.fsPath);
		return relative.split(/[/\\]/).filter(Boolean);
	}

	return [path.basename(uri.fsPath)];
}
