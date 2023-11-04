"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom");
const nodeCrypto = require('crypto');
Object.defineProperty(globalThis, 'crypto', {
    value: {
        getRandomValues: arr => nodeCrypto.randomBytes(arr.length)
    }
});
