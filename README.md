# PragmaGetFunctionArgs

This module was created to simplify and automate unit-testing.

A module is a function that takes a function declaration as input. From this function declaration, the expected function arguments are extracted and a response is returned as an array of objects that describes the function arguments.

## Used and tested on ##

- NodeJS 14+ [Documentation](https://nodejs.org/dist/latest/docs/api/)

## Install ##

```bash
npm i --save-dev pragma-get-function-args
```

## Initialization ##

```javascript
const getFunctionArgs = require('pragma-get-function-args');
```

## Usage ##

```javascript
const getFunctionArgs = require('pragma-get-function-args');

const yourFunction = (argument1, {argument2, argument3 = ''}, argument4 = null) => {
	// do something
};

const yourFunctionArgs = getFunctionArgs(yourFunction);
```

Variable `yourFunctionArgs` will be contains:
```js
[ // List of object with data about of function arguments
    { // Object with data of argument
        name: 'argument1', // Contains name of function argument
        type: 'any', // Because argument don't have default value it's type is 'any'
        default: undefined, // Because argument don't have default value it's default value is undefined
        required: true, // Because argument don't have default value it's must be required
        destructured: false // Argument is not destructured from incoming object
    },
    { // Object with data of destructured argument
        name: argument2argument3, // Generated from properties names
        type: 'object', // Because arguments destructured from incoming object
        required: true, // Because incoming object have not default value
        destructured: true, // Arguments is destructured from incoming object
        properties: [ // List of objects with arguments data will be destructured from incoming object
            { // Object with data of destructured argument
                name: 'argument2', // Contains name of destructured argument
                type: 'any', // Because destructured argument don't have default value it's type is 'any'
                default: undefined, // Because destructured argument don't have default value it's default value is undefined
                required: true // Because destructured argument don't have default value it's must be required
            },
            {
                name: 'argument3', // Contains name of destructured argument
                type: 'string', // Because destructured argument have default value as string
                default: '', // Contains default value of destructured argument
                required: false // Because destructured argument have default value
            }
        ]
    },
    {
        name: 'argument4', // Contains name of function argument
        type: 'any', // Because argument have default value 'null' it's type is 'any'
        default: null, // Contains default value of argument
        required: false, // Because argument have default value
        destructured: false // Argument is not destructured from incoming object
    }
]
```

**Possible types in property `type`**
- any
- array
- boolean
- function
- number
- object
- string

# License #

[wtfpl]: wtfpl-badge-1.png "WTFPL License :)"
![No WTFPL License image :(][wtfpl]
