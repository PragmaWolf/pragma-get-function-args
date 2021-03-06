/**
 * Function for typification and generate parameters for argument by default values
 * @param {String} defaultValue Argument default value
 * @returns {ArgumentParameters} Object with argument parameters
 */
const typification = defaultValue => {
    const result = {
        type: 'any',
        default: undefined,
        required: !defaultValue,
    };
    if (defaultValue) {
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(defaultValue[0])) {
            result.type = 'number';
            result.default = Number(defaultValue);
            if (defaultValue.endsWith('n')) {
                result.default = BigInt(defaultValue.replace('n', '')); // eslint-disable-line no-undef
            }
        }
        if (['true', 'false'].includes(defaultValue.toLowerCase())) {
            result.type = 'boolean';
            result.default = (defaultValue === 'true');
        }
        if (['\'', '"'].includes(defaultValue[0])) {
            result.type = 'string';
            result.default = String(defaultValue.replace(/^['"]*|['"]*$/gim, ''));
        }
        if (defaultValue[0] === '{') {
            result.type = 'object';
            result.default = {};
        }
        if (defaultValue[0] === '[') {
            result.type = 'array';
            result.default = [];
        }
        if (defaultValue[0] === '/') {
            result.type = 'object';
            const modifiers = /[^/]*$/.exec(defaultValue);
            const def = defaultValue.replace(new RegExp(`^/|/${modifiers}$`, 'gim'), '');
            result.default = new RegExp(def, String(modifiers));
        }
        if (defaultValue === 'Infinity') {
            result.type = (typeof Infinity);
            result.default = Infinity;
        }
        if (defaultValue === 'NaN') {
            result.type = (typeof NaN);
            result.default = NaN;
        }
        if (defaultValue.toLowerCase() === 'null') {
            result.default = null;
        }
        if (defaultValue.toLowerCase() === 'undefined') {
            result.default = undefined;
        }
    }

    return result;
};

/**
 * Prepare array with arguments parameters by stringify function declaration.
 * @param {Function} func Function declaration.
 * @returns {FunctionArgument[]} Array of objects with arguments parameters.
 */
module.exports = func => {
    if (typeof func !== 'function') {
        return [];
    }
    const funcStr = func.toString()
        .replace(/[\r\n]/gim, '')
        .replace(/\s{2,}/gim, ' ');

    const pattern = new RegExp('^((\\w*)(?=\\s*=>))|^[^(]*\\(([^)]+)\\)', 'gim');
    let matchedArgs = Array.from(funcStr.matchAll(pattern));
    if (!matchedArgs.length) {
        return [];
    }
    matchedArgs = matchedArgs[0].filter(Boolean);
    if (!matchedArgs[1]) {
        return [];
    }
    let getBaseArgs = matchedArgs[1].trim();
    getBaseArgs = String(getBaseArgs).replace(/[()]/gim, '');

    const destructuredArgs = {};
    const patternSplitArgs = /\s*,\s*/;
    const patternSplitArgsValues = /\s*=\s*/;

    if (getBaseArgs) {
        const getDestructuredArgs = Array.from(getBaseArgs.matchAll(/{\s*([^}]+)\s*}/gim));

        if (getDestructuredArgs.length > 0) {
            getDestructuredArgs.forEach(args => {
                const argsList = args[1].split(patternSplitArgs).map(val => val.trim());
                let replacer = '';
                const argsArr = [];
                argsList.forEach(arg => {
                    const argPrepared = arg.split(patternSplitArgsValues).map(val => val.trim());
                    const argData = typification(argPrepared?.[1]?.trim());
                    argsArr.push({name: argPrepared[0], ...argData});
                    replacer += argPrepared[0];
                });
                replacer = replacer.toLowerCase();
                getBaseArgs = getBaseArgs.replace(args[0], replacer);
                destructuredArgs[replacer] = argsArr;
            });
        }
    }

    getBaseArgs = getBaseArgs.split(patternSplitArgs);

    const args = [];
    getBaseArgs.forEach(arg => {
        const argPrepared = arg.split(patternSplitArgsValues).map(val => val.trim());
        const argData = typification(argPrepared?.[1]?.trim());
        let name = argPrepared[0];
        argData.destructured = false;
        if (destructuredArgs?.[argPrepared[0]]) {
            name = destructuredArgs[argPrepared[0]].map(val => val.name).join('');
            argData.type = 'object';
            argData.destructured = true;
            argData.properties = destructuredArgs[argPrepared[0]];
            argData.required = false;
            if (!argData.default) {
                delete argData.default;
            }
            for (const i in argData.properties) {
                if (argData.properties[i].required && !argData.default) {
                    argData.required = true;
                    break;
                }
            }
        }
        args.push({name, ...argData});
    });

    return args;
};
