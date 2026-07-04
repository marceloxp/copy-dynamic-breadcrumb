import * as vscode from 'vscode';
import { copyDynamicBreadcrumb } from './commands/copyDynamicBreadcrumb';

export function activate(context: vscode.ExtensionContext): void {
	const commands: Array<[string, Parameters<typeof copyDynamicBreadcrumb>[0]]> = [
		['copy-dynamic-breadcrumb.copyRelative', 'relative'],
		['copy-dynamic-breadcrumb.copyAbsolute', 'absolute'],
	];

	for (const [commandId, pathStyle] of commands) {
		context.subscriptions.push(
			vscode.commands.registerCommand(commandId, () => copyDynamicBreadcrumb(pathStyle)),
		);
	}
}

export function deactivate(): void {}
