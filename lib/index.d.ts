interface ISchemaValidateTarget {
    [key: string]: any;
}
export default class Schema {
    definition: any;
    hooks: any;
    props: {
        [key: string]: any;
    };
    constructor(definition: any);
    path(path: any, rules: any): any;
    validate(target: ISchemaValidateTarget, opts?: {}): any[];
    hook(fn: any): this;
    propagate(path: any, prop: any): this;
}
export {};
//# sourceMappingURL=index.d.ts.map