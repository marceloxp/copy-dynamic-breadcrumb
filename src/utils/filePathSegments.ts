import * as path from 'path';
import * as vscode from 'vscode';

export type PathStyle = 'relative' | 'absolute';

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

export function getFilePath(
	uri: vscode.Uri,
	pathStyle: PathStyle,
	workspaceFolder?: vscode.WorkspaceFolder,
): string {
	if (pathStyle === 'absolute') {
		return uri.fsPath;
	}

	return getFilePathSegments(uri, workspaceFolder).join('/');
}
