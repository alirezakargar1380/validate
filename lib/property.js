"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Property {
    constructor(name, schema) {
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
    schema(schema) {
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
        // return this._register('required', [bool]);
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
    type(type) {
        this._type = type;
        return this._register('type', [type]);
    }
    _register(type, args, fn) {
        this.registry[type] = { args, fn };
        return this;
    }
}
exports.default = Property;
//# sourceMappingURL=property.js.map