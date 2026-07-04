import * as vscode from 'vscode';

export function findSymbolPath(
	symbols: readonly vscode.DocumentSymbol[],
	position: vscode.Position,
): string[] {
	for (const symbol of symbols) {
		if (!symbol.range.contains(position)) {
			continue;
		}

		const childPath = findSymbolPath(symbol.children ?? [], position);
		return childPath.length > 0 ? [symbol.name, ...childPath] : [symbol.name];
	}

	return [];
}
