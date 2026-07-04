import * as vscode from 'vscode';
import { copyDynamicBreadcrumb } from './commands/copyDynamicBreadcrumb';

export function activate(context: vscode.ExtensionContext): void {
	const disposable = vscode.commands.registerCommand(
		'copy-dynamic-breadcrumb.copy',
		copyDynamicBreadcrumb,
	);

	context.subscriptions.push(disposable);
}

export function deactivate(): void {}
