'use strict';

module.exports = function (ccisroomDb) {
    var MemberSchema = require('../schemas/member.schema.js');

    return ccisroomDb.model('Member', MemberSchema);
};