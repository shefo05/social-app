"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ON_MODEL = exports.SYS_REACTION = exports.SYS_PROVIDER = exports.SYS_GENDER = exports.SYS_ROLE = void 0;
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
var SYS_REACTION;
(function (SYS_REACTION) {
    SYS_REACTION[SYS_REACTION["like"] = 0] = "like";
    SYS_REACTION[SYS_REACTION["love"] = 1] = "love";
    SYS_REACTION[SYS_REACTION["haha"] = 2] = "haha";
    SYS_REACTION[SYS_REACTION["wow"] = 3] = "wow";
    SYS_REACTION[SYS_REACTION["sad"] = 4] = "sad";
    SYS_REACTION[SYS_REACTION["angry"] = 5] = "angry";
})(SYS_REACTION || (exports.SYS_REACTION = SYS_REACTION = {}));
var ON_MODEL;
(function (ON_MODEL) {
    ON_MODEL["Post"] = "Post";
    ON_MODEL["Comment"] = "Comment";
    ON_MODEL["Reel"] = "Reel";
    ON_MODEL["Story"] = "Story";
})(ON_MODEL || (exports.ON_MODEL = ON_MODEL = {}));
