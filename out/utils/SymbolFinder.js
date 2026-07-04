"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSymbolPath = findSymbolPath;
function findSymbolPath(symbols, position) {
    for (const symbol of symbols) {
        if (!symbol.range.contains(position)) {
            continue;
        }
        const childPath = findSymbolPath(symbol.children ?? [], position);
        return childPath.length > 0 ? [symbol.name, ...childPath] : [symbol.name];
    }
    return [];
}
//# sourceMappingURL=SymbolFinder.js.map