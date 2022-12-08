export default class ValidationError extends Error {
    constructor(message: any, path: any) {
        super(message);

        defineProp(this, 'path', path);
        defineProp(this, 'expose', true);
        defineProp(this, 'status', 400);

        if ((<any>Error).captureStackTrace) {
            (<any>Error).captureStackTrace(this, ValidationError);
        }
    }
}

const defineProp = (obj: any, prop: any, val: any) => {
    Object.defineProperty(obj, prop, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: val
    });
};