"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.join = void 0;
function join(path, prefix) {
    return prefix
        ? `${prefix}.${path}`
        : path;
}
exports.join = join;
//# sourceMappingURL=utils.js.map