/* eslint max-len: 0 */
const pragmaGetFunctionArgs = require('../index.js');

/**
 * ========== PREPARE FUNCTIONS FOR AUTOMATE TEST GENERATION
 */

/**
 * Getting object keys list
 * @param {Object} obj Object for processing
 * @returns {string[]} Array with object keys
 */
const getObjKeys = obj => Object.keys(obj) || [];

/**
 * Check existing property in object
 * @param {Object} obj Object for checking
 * @param {String} prop Property name
 * @returns {Boolean} True if property exists, false - if not exists
 */
const hasProperty = (obj, prop) => Object.hasOwnProperty.call(obj, prop);

/**
 * Checking each property with recursive
 * @param {Object} funcResult Result of work testing function
 * @param {Object} waitingObjProps Model waiting data in result of work testing function
 * @param {Number} arrLength Length of array in result of work testing function
 * @param {String} describeText Text for include to describe description
 */
const testsResponseObjects = (funcResult, waitingObjProps, arrLength = 1, describeText = 'object') => {
    const resultObjPropsKeys = getObjKeys(waitingObjProps);

    for (let i = 0; i < arrLength; i++) {
        describe(`Check ${describeText} on array index ${i}`, () => {
            for (const propName of resultObjPropsKeys) {
                if (waitingObjProps[propName][i] === '!exists') {
                    it(`Result object ${i} don't have property "${propName}"`, () => {
                        expect(hasProperty(funcResult[i], propName)).toBeFalsy();
                    });
                } else {
                    it(`Result object ${i} must have property "${propName}"`, () => {
                        expect(hasProperty(funcResult[i], propName)).toBeTruthy();
                    });

                    if (propName === 'properties') {
                        describe(`Check property "${propName}" for object on array index ${i}`, () => {
                            // eslint-disable-next-line no-use-before-define
                            testsResponse(funcResult[i][propName], waitingObjProps[propName][i], waitingObjProps[propName][i].name.length, propName);
                        });
                    } else {
                        it(`Result object ${i} property "${propName}" must have value "${waitingObjProps[propName][i]}"`, () => {
                            expect(funcResult[i][propName]).toEqual(waitingObjProps[propName][i]);
                        });
                    }
                }
            }
        });
    }
};

/**
 * Base checking properties and call checking each property
 * @param {Object} funcResult Result of work testing function
 * @param {Object} waitingObjProps Model waiting data in result of work testing function
 * @param {Number} arrLength Length of array in result of work testing function
 * @param {String} describeText Text for include to describe description
 */
const testsResponse = (funcResult, waitingObjProps, arrLength = 1, describeText = 'object') => {
    it('Result should be an Array', () => {
        expect(Array.isArray(funcResult)).toBeTruthy();
    });

    it(`Result should have length equal ${arrLength}`, () => {
        expect(funcResult.length === arrLength).toBeTruthy();
    });

    for (let i = 0; i < arrLength; i++) {
        it(`Result should have an Object on array index ${i}`, () => {
            expect(typeof funcResult[i] === 'object').toBeTruthy();
        });

        it(`Result should have not empty Object on array index ${i}`, () => {
            expect(getObjKeys(funcResult[i]).length > 0).toBeTruthy();
        });
    }

    testsResponseObjects(funcResult, waitingObjProps, arrLength, describeText);
};

/**
 * ========== CREATE AND AUTOMATE GENERATION TESTS
 */

it('Should be a function', () => {
    expect(typeof pragmaGetFunctionArgs).toEqual('function');
});

describe('Should return empty array when', () => {
    it('Call without arguments', () => {
        expect(pragmaGetFunctionArgs()).toEqual([]);
    });

    const testDataList = [
        undefined,
        null,
        true,
        false,
        Infinity,
        NaN,
        1,
        1.5,
        0,
        0.5,
        -1,
        -1.5,
        1234567890123456789012345678901234567890n,
        '',
        ' ',
        'foo',
        [],
        [1, 2],
        {},
        {foo: 'bar'},
        /^\d*$/,
    ];

    for (const testData of testDataList) {
        let testDataOut = testData;
        if (testData?.toString().includes('Symbol')) {
            testDataOut = 'Symbol';
        }
        it(`Call with "${testDataOut}"`, () => {
            expect(pragmaGetFunctionArgs(testData)).toEqual([]);
        });
    }
});

describe('Should return correct result when', () => {
    describe('Call using array function [foo => 0]', () => {
        const func = foo => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['any'],
            default: [undefined],
            required: [true],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = undefined) => 0]', () => {
        const func = (foo = undefined) => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['any'],
            default: [undefined],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = null) => 0]', () => {
        const func = (foo = null) => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['any'],
            default: [null],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = true) => 0]', () => {
        const func = (foo = true) => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['boolean'],
            default: [true],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = Infinity) => 0]', () => {
        const func = (foo = Infinity) => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['number'],
            default: [Infinity],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = NaN) => 0]', () => {
        const func = (foo = NaN) => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['number'],
            default: [NaN],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = 123) => 0]', () => {
        const func = (foo = 123) => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['number'],
            default: [123],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = 123.321) => 0]', () => {
        const func = (foo = 123.321) => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['number'],
            default: [123.321],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = 1234567890123456789012345678901234567890n) => 0]', () => {
        const func = (foo = 1234567890123456789012345678901234567890n) => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['number'],
            default: [1234567890123456789012345678901234567890n],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = \'bar\') => 0]', () => {
        const func = (foo = 'bar') => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['string'],
            default: ['bar'],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = "bar") => 0]', () => {
        const func = (foo = "bar") => 0; // eslint-disable-line quotes
        const waitingObjProps = {
            name: ['foo'],
            type: ['string'],
            default: ['bar'],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = \'bar"bar\') => 0]', () => {
        const func = (foo = 'bar"bar') => 0; // eslint-disable-line quotes
        const waitingObjProps = {
            name: ['foo'],
            type: ['string'],
            default: ['bar"bar'],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = \'bar\'bar\') => 0]', () => {
        const func = (foo = 'bar\'bar') => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['string'],
            default: ['bar\\\'bar'],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = []) => 0]', () => {
        const func = (foo = []) => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['array'],
            default: [[]],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = {}) => 0]', () => {
        const func = (foo = {}) => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['object'],
            default: [{}],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = /^\\d*$/) => 0]', () => {
        const func = (foo = /^\d*$/) => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['object'],
            default: [/^\d*$/],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = /^\\d*$/gim) => 0]', () => {
        const func = (foo = /^\d*$/gim) => 0;
        const waitingObjProps = {
            name: ['foo'],
            type: ['object'],
            default: [/^\d*$/gim],
            required: [false],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo, bar) => 0]', () => {
        const func = (foo, bar) => 0;
        const waitingObjProps = {
            name: ['foo', 'bar'],
            type: ['any', 'any'],
            default: [undefined, undefined],
            required: [true, true],
            destructured: [false, false],
            properties: ['!exists', '!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo, bar = 1) => 0]', () => {
        const func = (foo, bar = 1) => 0;
        const waitingObjProps = {
            name: ['foo', 'bar'],
            type: ['any', 'number'],
            default: [undefined, 1],
            required: [true, false],
            destructured: [false, false],
            properties: ['!exists', '!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = {}, bar) => 0]', () => {
        const func = (foo = {}, bar) => 0;
        const waitingObjProps = {
            name: ['foo', 'bar'],
            type: ['object', 'any'],
            default: [{}, undefined],
            required: [false, true],
            destructured: [false, false],
            properties: ['!exists', '!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(foo = {}, bar = null) => 0]', () => {
        const func = (foo = {}, bar = null) => 0;
        const waitingObjProps = {
            name: ['foo', 'bar'],
            type: ['object', 'any'],
            default: [{}, null],
            required: [false, false],
            destructured: [false, false],
            properties: ['!exists', '!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [({foo, bar}) => 0]', () => {
        const func = ({foo, bar}) => 0;
        const waitingObjProps = {
            name: [undefined],
            type: ['object'],
            default: ['!exists'],
            required: [true],
            destructured: [true],
            properties: [
                {
                    name: ['foo', 'bar'],
                    type: ['any', 'any'],
                    default: [undefined, undefined],
                    required: [true, true],
                    destructured: ['!exists', '!exists'],
                },
            ],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(boo, {foo, bar}) => 0]', () => {
        const func = (boo, {foo, bar}) => 0;
        const waitingObjProps = {
            name: ['boo', undefined],
            type: ['any', 'object'],
            default: [undefined, '!exists'],
            required: [true, true],
            destructured: [false, true],
            properties: [
                '!exists',
                {
                    name: ['foo', 'bar'],
                    type: ['any', 'any'],
                    default: [undefined, undefined],
                    required: [true, true],
                    destructured: ['!exists', '!exists'],
                },
            ],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(boo, ({foo, bar}, boo) => 0]', () => {
        const func = ({foo, bar}, boo) => 0;
        const waitingObjProps = {
            name: [undefined, 'boo'],
            type: ['object', 'any'],
            default: ['!exists', undefined],
            required: [true, true],
            destructured: [true, false],
            properties: [
                {
                    name: ['foo', 'bar'],
                    type: ['any', 'any'],
                    default: [undefined, undefined],
                    required: [true, true],
                    destructured: ['!exists', '!exists'],
                },
                '!exists',
            ],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(baz = 123, {foo = false, bar = \'\'}, boo = null) => 0]', () => {
        const func = (baz = 123, {foo = false, bar = ''} = {}, boo = null) => 0;
        const waitingObjProps = {
            name: ['baz', undefined, 'boo'],
            type: ['number', 'object', 'any'],
            default: [123, {}, null],
            required: [false, false, false],
            destructured: [false, true, false],
            properties: [
                '!exists',
                {
                    name: ['foo', 'bar'],
                    type: ['boolean', 'string'],
                    default: [false, ''],
                    required: [false, false],
                    destructured: ['!exists', '!exists'],
                },
                '!exists',
            ],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function [(baz, {foo, bar = \'\'}, boo = null) => 0]', () => {
        const func = (baz, {foo, bar = ''}, boo = null) => 0;
        const waitingObjProps = {
            name: ['baz', undefined, 'boo'],
            type: ['any', 'object', 'any'],
            default: [undefined, '!exists', null],
            required: [true, true, false],
            destructured: [false, true, false],
            properties: [
                '!exists',
                {
                    name: ['foo', 'bar'],
                    type: ['any', 'string'],
                    default: [undefined, ''],
                    required: [true, false],
                    destructured: ['!exists', '!exists'],
                },
                '!exists',
            ],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using function [function func(baz, {foo, bar = \'\'}, boo = null)]', () => {
        // eslint-disable-next-line require-jsdoc
        function func(baz, {foo, bar = ''}, boo = null) { // eslint-disable-line func-style
            return 0;
        }
        const waitingObjProps = {
            name: ['baz', undefined, 'boo'],
            type: ['any', 'object', 'any'],
            default: [undefined, '!exists', null],
            required: [true, true, false],
            destructured: [false, true, false],
            properties: [
                '!exists',
                {
                    name: ['foo', 'bar'],
                    type: ['any', 'string'],
                    default: [undefined, ''],
                    required: [true, false],
                    destructured: ['!exists', '!exists'],
                },
                '!exists',
            ],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using function [const func = function(baz, {foo, bar = \'\'}, boo = null)]', () => {
        // eslint-disable-next-line require-jsdoc
        const func = function(baz, {foo, bar = ''}, boo = null) {
            return 0;
        };
        const waitingObjProps = {
            name: ['baz', undefined, 'boo'],
            type: ['any', 'object', 'any'],
            default: [undefined, '!exists', null],
            required: [true, true, false],
            destructured: [false, true, false],
            properties: [
                '!exists',
                {
                    name: ['foo', 'bar'],
                    type: ['any', 'string'],
                    default: [undefined, ''],
                    required: [true, false],
                    destructured: ['!exists', '!exists'],
                },
                '!exists',
            ],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using class static method [class Test {  static isMethod(baz, {foo, bar = \'\'}, boo = null) }]', () => {
        // eslint-disable-next-line require-jsdoc
        class Test {
            // eslint-disable-next-line require-jsdoc
            static isMethod(baz, {foo, bar = ''}, boo = null) {
                return 0;
            }
        }
        const waitingObjProps = {
            name: ['baz', undefined, 'boo'],
            type: ['any', 'object', 'any'],
            default: [undefined, '!exists', null],
            required: [true, true, false],
            destructured: [false, true, false],
            properties: [
                '!exists',
                {
                    name: ['foo', 'bar'],
                    type: ['any', 'string'],
                    default: [undefined, ''],
                    required: [true, false],
                    destructured: ['!exists', '!exists'],
                },
                '!exists',
            ],
        };

        const funcResult = pragmaGetFunctionArgs(Test.isMethod);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using class method [class Test { isMethod(baz, {foo, bar = \'\'}, boo = null) }]', () => {
        // eslint-disable-next-line require-jsdoc
        class Test {
            // eslint-disable-next-line require-jsdoc
            isMethod(baz, {foo, bar = ''}, boo = null) {
                return 0;
            }
        }
        const waitingObjProps = {
            name: ['baz', undefined, 'boo'],
            type: ['any', 'object', 'any'],
            default: [undefined, '!exists', null],
            required: [true, true, false],
            destructured: [false, true, false],
            properties: [
                '!exists',
                {
                    name: ['foo', 'bar'],
                    type: ['any', 'string'],
                    default: [undefined, ''],
                    required: [true, false],
                    destructured: ['!exists', '!exists'],
                },
                '!exists',
            ],
        };

        const funcResult = pragmaGetFunctionArgs(new Test().isMethod);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });

    describe('Call using array function with typeof inside', () => {
        const func = value => {
            if ((typeof value === 'undefined' || value === null)) {
                return true;
            }
            if (Array.isArray(value)) {
                return false;
            }

            return false;
        };
        const waitingObjProps = {
            name: ['value'],
            type: ['any'],
            default: [undefined],
            required: [true],
            destructured: [false],
            properties: ['!exists'],
        };

        const funcResult = pragmaGetFunctionArgs(func);
        testsResponse(funcResult, waitingObjProps, waitingObjProps.name.length);
    });
});
