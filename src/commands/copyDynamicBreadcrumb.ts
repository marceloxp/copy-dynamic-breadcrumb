import * as vscode from 'vscode';
import { buildBreadcrumb } from '../services/BreadcrumbService';

export async function copyDynamicBreadcrumb(): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		await vscode.window.showWarningMessage('No active text editor.');
		return;
	}

	const breadcrumb = await buildBreadcrumb(editor);
	await vscode.env.clipboard.writeText(breadcrumb);
}
