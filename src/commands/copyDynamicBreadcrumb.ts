import * as vscode from 'vscode';
import { buildBreadcrumb, buildBreadcrumbJson } from '../services/BreadcrumbService';
import { PathStyle } from '../utils/filePathSegments';

export async function copyDynamicBreadcrumb(pathStyle: PathStyle): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		await vscode.window.showWarningMessage('No active text editor.');
		return;
	}

	const breadcrumb = await buildBreadcrumb(editor, pathStyle);
	await vscode.env.clipboard.writeText(breadcrumb);
}

export async function copyDynamicBreadcrumbJson(pathStyle: PathStyle): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		await vscode.window.showWarningMessage('No active text editor.');
		return;
	}

	const breadcrumb = await buildBreadcrumbJson(editor, pathStyle);
	await vscode.env.clipboard.writeText(breadcrumb);
}
