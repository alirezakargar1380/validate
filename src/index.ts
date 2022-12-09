import { join } from './utils';
import Property from './property';
import Validators from './validators';
import Messages from './messages';

type Type = Function | string
interface PropertyDefinition {
    type?: Type;
    required?: boolean;
    // length?: number | { min?: number; max?: number };
    // size?: number | { min?: number; max?: number };
    // enum?: string[];
    // each?: Rule;
    // elements?: Rule[];
    // match?: RegExp;
    // use?: { [key: string]: ValidationFunction };
    // message?: string | MessageFunction | { [key: string]: string | MessageFunction };
    // schema?: Schema;
    // properties?: SchemaDefinition;
}

type Rule = Type | PropertyDefinition

interface SchemaDefinition {
    [key: string]: Rule
}
interface ISchemaValidateTarget { [key: string]: any }
interface ISchema {
    definition: any
    validate(target: ISchemaValidateTarget): any[]
}

export default class Schema
// implements ISchema 
{
    public definition: any
    public hooks: any
    public validators: any
    public messages: any
    public props: { [key: string]: any }
    constructor(definition: any) {
        this.hooks = []
        this.props = {}
        this.definition = definition
        this.validators = Object.assign({}, Validators);
        this.messages = Object.assign({}, Messages);
        Object.keys(definition).forEach((k) => {
            this.path(k, definition[k])
        });
    }

    path(path: any, rules: any): any {
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
            rules.hook((k: any, v: any) => this.path(join(k, path), v));
            return this.path(path, rules.props);
        }

        // Return early when given a `Property`
        if (rules instanceof Property) {
            this.props[path] = rules;
            // Notify parents if mounted
            this.propagate(path, rules);
            return rules;
        }

        const prop = this.props[path] || new Property(path, this);

        this.props[path] = prop;

        // Notify parents if mounted
        this.propagate(path, prop);

        // No rules?
        if (!rules) return prop;
        console.log(rules)

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
        for (const key of keys) {
            if (typeof prop[key] == 'function') continue;
            prop.type(Object);
            nested = true;
            break;
        }

        keys.forEach(key => {
            const rule = rules[key];

            if (nested) {
                return this.path(join(key, path), rule);
            }

            prop[key](rule);
        });

        // return prop;
    }

    validate(target: ISchemaValidateTarget, opts = {}): any[] {
        // opts = Object.assign(this.opts, opts);

        const errors: any = [];

        // if (opts.typecast) {
        //     this.typecast(obj);
        // }

        // if (opts.strict) {
        //     errors.push(...this.enforce(obj));
        // }

        // if (opts.strip !== false) {
        //     this.strip(obj);
        // }

        for (const [path, prop] of (<any>Object).entries(this.props)) {
            // console.log(prop.registry)
            // prop.required()
            // prop.allow(false)
            const err = prop.validate()
            if (err) errors.push(err);

            // enumerate(path, target, (key, value) => {
            //     const err = prop.validate(value, obj, key);
            //     if (err) errors.push(err);
            // });
        }

        return errors
    }

    hook(fn: any) {
        this.hooks.push(fn);
        return this;
    }

    propagate(path: any, prop: any) {
        this.hooks.forEach((fn: any) => fn(path, prop));
        return this;
    }
}