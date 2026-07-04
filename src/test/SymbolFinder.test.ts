import * as assert from 'assert';
import * as vscode from 'vscode';
import { findSymbolPath } from '../utils/SymbolFinder';

function createSymbol(
	name: string,
	startLine: number,
	endLine: number,
	children: vscode.DocumentSymbol[] = [],
): vscode.DocumentSymbol {
	return {
		name,
		detail: '',
		kind: vscode.SymbolKind.Class,
		range: new vscode.Range(startLine, 0, endLine, Number.MAX_SAFE_INTEGER),
		selectionRange: new vscode.Range(startLine, 0, startLine, 0),
		children,
		tags: [],
	};
}

suite('SymbolFinder', () => {
	test('returns empty array when no symbols contain the position', () => {
		const symbols = [createSymbol('Class', 0, 5)];
		const position = new vscode.Position(10, 0);

		assert.deepStrictEqual(findSymbolPath(symbols, position), []);
	});

	test('returns single symbol when cursor is inside it', () => {
		const symbols = [createSymbol('UserService', 0, 20)];
		const position = new vscode.Position(5, 4);

		assert.deepStrictEqual(findSymbolPath(symbols, position), ['UserService']);
	});

	test('returns nested symbol hierarchy', () => {
		const symbols = [
			createSymbol('Classe', 0, 30, [
				createSymbol('metodo', 5, 20, [
					createSymbol('funcao local', 10, 15, [
						createSymbol('variavel', 12, 12),
					]),
				]),
			]),
		];
		const position = new vscode.Position(12, 2);

		assert.deepStrictEqual(findSymbolPath(symbols, position), [
			'Classe',
			'metodo',
			'funcao local',
			'variavel',
		]);
	});

	test('returns shallowest matching symbol when cursor is not in a child', () => {
		const symbols = [
			createSymbol('Classe', 0, 30, [
				createSymbol('metodo', 5, 10),
			]),
		];
		const position = new vscode.Position(20, 0);

		assert.deepStrictEqual(findSymbolPath(symbols, position), ['Classe']);
	});

	test('returns empty array for empty symbols', () => {
		const position = new vscode.Position(0, 0);

		assert.deepStrictEqual(findSymbolPath([], position), []);
	});
});
