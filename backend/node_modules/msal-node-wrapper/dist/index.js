/*! msal-node-wrapper v1.0.0-beta 2024-02-02 */
'use strict';
'use strict';

var msalNode = require('@azure/msal-node');
var WebAppAuthProvider = require('./provider/WebAppAuthProvider.js');
var AuthContext = require('./middleware/context/AuthContext.js');
var AccessDeniedError = require('./error/AccessDeniedError.js');
var InteractionRequiredError = require('./error/InteractionRequiredError.js');
var packageMetadata = require('./packageMetadata.js');



Object.defineProperty(exports, 'AuthError', {
	enumerable: true,
	get: function () { return msalNode.AuthError; }
});
Object.defineProperty(exports, 'InteractionRequiredAuthError', {
	enumerable: true,
	get: function () { return msalNode.InteractionRequiredAuthError; }
});
Object.defineProperty(exports, 'Logger', {
	enumerable: true,
	get: function () { return msalNode.Logger; }
});
exports.WebAppAuthProvider = WebAppAuthProvider.WebAppAuthProvider;
exports.AuthContext = AuthContext.AuthContext;
exports.AccessDeniedError = AccessDeniedError.AccessDeniedError;
exports.InteractionRequiredError = InteractionRequiredError.InteractionRequiredError;
exports.packageVersion = packageMetadata.packageVersion;
//# sourceMappingURL=index.js.map
