import xml2js from 'xml2js';
import compileTemplate from './compileTemplate';
import { fchown } from 'fs';
const vm = require('vm')

function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

function data2string() {

}

function object2xml() {

}

function createSandbox(data) {
    const target = {
        Array,
        xml: function () {

        },
        json: function (v) {
            return JSON.stringify(v)
        },
        $data: data,
    };

    target.$self = target;

    const handler = {
        get: function (target, name) {
            if (isObject(data) && (name in data)) {
                return data[name];
            }

            return target[name];
        },
        set: function (target, name, value) {
            if (isObject(data) && (name in data)) {
                data[name] = value;
            } else {
                target[name] = value;
            }
        }
    };
    return new Proxy(target, handler);
}

export default function (template, data) {
    const sandbox = createSandbox(data);
    const context = new vm.createContext(sandbox);
    const code = compileTemplate(template);

    const script = new vm.Script(code);
    script.runInContext(context);

    console.log(context.__p);
}