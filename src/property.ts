import ValidationError from './error';

export default class Property {
    private name: any
    private registry: any
    private _schema: any
    private _type: any
    private messages: any

    constructor(name: any, schema: any) {
        this.name = name;
        this.registry = {};
        this._schema = schema;
        this._type = null;
        this.messages = {};
    }

    /**
     * Registers messages.
     *
     * @example
     * prop.message('something is wrong')
     * prop.message({ required: 'thing is required.' })
     *
     * @param {Object|String} messages
     * @return {Property}
     */

    // message(messages) {
    //     if (typeof messages == 'string') {
    //         messages = { default: messages };
    //     }

    //     const entries = Object.entries(messages);

    //     for (const [key, val] of entries) {
    //         this.messages[key] = val;
    //     }

    //     return this;
    // }

    /**
     * Mount given `schema` on current path.
     *
     * @example
     * const user = new Schema({ email: String })
     * prop.schema(user)
     *
     * @param {Schema} schema - the schema to mount
     * @return {Property}
     */

    schema(schema: any) {
        this._schema.path(this.name, schema);
        return this;
    }

    /**
     * Validate using named functions from the given object.
     * Error messages can be defined by providing an object with
     * named error messages/generators to `schema.message()`
     *
     * The message generator receives the value being validated,
     * the object it belongs to and any additional arguments.
     *
     * @example
     * const schema = new Schema()
     * const prop = schema.path('some.path')
     *
     * schema.message({
     *   binary: (path, ctx) => `${path} must be binary.`,
     *   bits: (path, ctx, bits) => `${path} must be ${bits}-bit`
     * })
     *
     * prop.use({
     *   binary: (val, ctx) => /^[01]+$/i.test(val),
     *   bits: [(val, ctx, bits) => val.length == bits, 32]
     * })
     *
     * @param {Object} fns - object with named validation functions to call
     * @return {Property}
     */

    // use(fns) {
    //     Object.keys(fns).forEach(name => {
    //         let arr = fns[name];
    //         if (!Array.isArray(arr)) arr = [arr];
    //         const fn = arr.shift();
    //         this._register(name, arr, fn);
    //     });

    //     return this;
    // }

    /**
     * Registers a validator that checks for presence.
     *
     * @example
     * prop.required()
     *
     * @param {Boolean} [bool] - `true` if required, `false` otherwise
     * @return {Property}
     */

    required(bool = true) {
        console.log('im prop required')
        return this._register('required', [bool]);
    }

    allow(bool = true) {
        console.log('im prop allow')
        return this._register('allow', [bool]);
    }

    /**
     * Registers a validator that checks if a value is of a given `type`
     *
     * @example
     * prop.type(String)
     *
     * @example
     * prop.type('string')
     *
     * @param {String|Function} type - type to check for
     * @return {Property}
     */

    type(type: any) {
        this._type = type;
        return this._register('type', [type]);
    }

    validate(value: any, ctx: any, path = this.name) {
        const types = Object.keys(this.registry);

        for (const type of types) {
            const err: any = this._run(type, value, ctx, path);
            if (err) return err;
        }

        return null;
    }

    _run(type: any, value: any, ctx: any, path: any) {
        if (!this.registry[type]) return;
        const schema = this._schema;
        const { args, fn } = this.registry[type];
        if (this.registry['required']?.args[0] === true && type === 'allow' && args[0] === false) return this._error('allowAndRequired', ctx, args, path)
        const validator = fn || schema.validators[type];
        const valid = validator(value, ctx, ...args, path);
        if (!valid) {
            // console.log('----------------------------------')
            // console.log(valid)
            // console.log(type)
            // console.log(path)
            return this._error(type, ctx, args, path)
        }
    }

    _error(type: any, ctx: any, args: any, path: any) {
        const schema = this._schema;

        let message = this.messages[type] ||
            this.messages.default ||
            schema.messages[type] ||
            schema.messages.default;

        if (typeof message == 'function') {
            message = message(path, ctx, ...args);
        }

        // console.log(message)
        return new ValidationError(message, path);
    }

    _register(type: any, args: any, fn?: any) {
        this.registry[type] = { args, fn };
        return this;
    }
}