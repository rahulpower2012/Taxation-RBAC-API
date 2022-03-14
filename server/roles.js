// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
    ac.grant("tax-p")
        .readOwn("profile")
        .updateOwn("profile")

    ac.grant("tax-ac")
        .extend("tax-p")
        .readAny("profile")

    ac.grant("admin")
        .extend("tax-p")
        .extend("tax-ac")
        .updateAny("profile")
        .deleteAny("profile")

    return ac;
})();