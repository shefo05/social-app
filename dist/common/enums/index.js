"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYS_PROVIDER = exports.SYS_GENDER = exports.SYS_ROLE = void 0;
var SYS_ROLE;
(function (SYS_ROLE) {
    SYS_ROLE[SYS_ROLE["user"] = 0] = "user";
    SYS_ROLE[SYS_ROLE["admin"] = 1] = "admin";
})(SYS_ROLE || (exports.SYS_ROLE = SYS_ROLE = {}));
var SYS_GENDER;
(function (SYS_GENDER) {
    SYS_GENDER[SYS_GENDER["male"] = 0] = "male";
    SYS_GENDER[SYS_GENDER["female"] = 1] = "female";
})(SYS_GENDER || (exports.SYS_GENDER = SYS_GENDER = {}));
var SYS_PROVIDER;
(function (SYS_PROVIDER) {
    SYS_PROVIDER[SYS_PROVIDER["system"] = 0] = "system";
    SYS_PROVIDER[SYS_PROVIDER["google"] = 1] = "google";
})(SYS_PROVIDER || (exports.SYS_PROVIDER = SYS_PROVIDER = {}));
