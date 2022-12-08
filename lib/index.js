"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const property_1 = __importDefault(require("./property"));
class Schema {
    constructor(definition) {
        this.hooks = [];
        this.props = {};
        this.definition = definition;
        Object.keys(definition).forEach((k) => {
            this.path(k, definition[k]);
        });
    }
    path(path, rules) {
        const parts = path.split('.');
        const suffix = parts.pop();
        const prefix = parts.join('.');
        // Make sure full path is created
        // if (prefix) {
        //     this.path(prefix);
        // }
        // Array index placeholder
        // if (suffix === '$') {
        //     this.path(prefix).type(Array);
        // }
        // Nested schema
        if (rules instanceof Schema) {
            rules.hook((k, v) => this.path((0, utils_1.join)(k, path), v));
            return this.path(path, rules.props);
        }
        // Return early when given a `Property`
        if (rules instanceof property_1.default) {
            this.props[path] = rules;
            // Notify parents if mounted
            this.propagate(path, rules);
            return rules;
        }
        const prop = this.props[path] || new property_1.default(path, this);
        this.props[path] = prop;
        // Notify parents if mounted
        this.propagate(path, prop);
        // No rules?
        if (!rules)
            return prop;
        // type shorthand
        // `{ name: String }`
        if (typeof rules == 'string' || typeof rules == 'function') {
            // console.log('im here')
            prop.type(rules);
            return prop;
        }
        // Allow arrays to be defined implicitly:
        // `{ keywords: [String] }`
        // `{ keyVal: [[String, Number]] }`
        // if (Array.isArray(rules)) {
        //     prop.type(Array);
        //     if (rules.length === 1) {
        //         prop.each(rules[0]);
        //     } else {
        //         prop.elements(rules);
        //     }
        //     return prop;
        // }
        const keys = Object.keys(rules);
        let nested = false;
        // Check for nested objects
        // for (const key of keys) {
        //     if (typeof prop[key] == 'function') continue;
        //     prop.type(Object);
        //     nested = true;
        //     break;
        // }
        // keys.forEach(key => {
        //     const rule = rules[key];
        //     if (nested) {
        //         return this.path(join(key, path), rule);
        //     }
        //     prop[key](rule);
        // });
        // return prop;
    }
    validate(target, opts = {}) {
        // opts = Object.assign(this.opts, opts);
        const errors = [];
        // if (opts.typecast) {
        //     this.typecast(obj);
        // }
        // if (opts.strict) {
        //     errors.push(...this.enforce(obj));
        // }
        // if (opts.strip !== false) {
        //     this.strip(obj);
        // }
        console.log(Object.entries({}));
        const propp = this.props;
        for (const [path, prop] of Object.entries(propp)) {
            console.log(prop);
            // enumerate(path, obj, (key, value) => {
            //     const err = prop.validate(value, obj, key);
            //     if (err) errors.push(err);
            // });
        }
        return errors;
    }
    hook(fn) {
        this.hooks.push(fn);
        return this;
    }
    propagate(path, prop) {
        this.hooks.forEach((fn) => fn(path, prop));
        return this;
    }
}
exports.default = Schema;
//# sourceMappingURL=index.js.map