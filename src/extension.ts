import * as vscode from 'vscode';
import { copyDynamicBreadcrumb, copyDynamicBreadcrumbJson } from './commands/copyDynamicBreadcrumb';
import { PathStyle } from './utils/filePathSegments';

export function activate(context: vscode.ExtensionContext): void {
	const textCommands: Array<[string, PathStyle]> = [
		['copy-dynamic-breadcrumb.copyRelative', 'relative'],
		['copy-dynamic-breadcrumb.copyAbsolute', 'absolute'],
	];

	const jsonCommands: Array<[string, PathStyle]> = [
		['copy-dynamic-breadcrumb.copyJsonRelative', 'relative'],
		['copy-dynamic-breadcrumb.copyJsonAbsolute', 'absolute'],
	];

	for (const [commandId, pathStyle] of textCommands) {
		context.subscriptions.push(
			vscode.commands.registerCommand(commandId, () => copyDynamicBreadcrumb(pathStyle)),
		);
	}

	for (const [commandId, pathStyle] of jsonCommands) {
		context.subscriptions.push(
			vscode.commands.registerCommand(commandId, () => copyDynamicBreadcrumbJson(pathStyle)),
		);
	}
}

export function deactivate(): void {}
