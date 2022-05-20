/**
 * @typedef {Object} ArgumentParameters Object with first parsed data of function argument
 * @property {String} type Type of function argument
 * @property {*} [default=undefined] Default value of function argument
 * @property {Boolean} required Is the function argument required
 * @property {Array|Undefined|DestructuredFunctionArgument[]} [properties] Destructured properties list from function argument
 */

/**
 * @typedef {Object} FunctionArgument Object with data of function argument
 * @property {String} name Name of function argument
 * @property {String} [type='any'] Type of function argument
 * @property {*} [value=undefined] Default value of function argument
 * @property {Boolean} required If the function argument required
 * @property {Boolean} destructured If the function argument is destructured
 * @property {Array.<DestructuredFunctionArgument>} properties Properties list of destructured function arguments
 */
/**
 * @typedef {Object} DestructuredFunctionArgument Object with data of destructured function argument
 * @property {String} name Name of function argument
 * @property {String} [type='any'] Type of function argument
 * @property {*} [value=undefined] Default value of function argument
 * @property {Boolean} required If the function argument required
 * @property {Boolean} [destructured=false] If the function argument is destructured
 */
