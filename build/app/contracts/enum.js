export var ComplaintStatus;
(function (ComplaintStatus) {
    ComplaintStatus[ComplaintStatus["NEW"] = 0] = "NEW";
    ComplaintStatus[ComplaintStatus["SCREENED"] = 5] = "SCREENED";
    ComplaintStatus[ComplaintStatus["IN_PROGRESS"] = 10] = "IN_PROGRESS";
    ComplaintStatus[ComplaintStatus["INVESTIGATING"] = 20] = "INVESTIGATING";
    ComplaintStatus[ComplaintStatus["COMPLETED"] = 91] = "COMPLETED";
    ComplaintStatus[ComplaintStatus["REJECTED"] = 96] = "REJECTED";
})(ComplaintStatus || (ComplaintStatus = {}));
export var ComplaintTrackingStatus;
(function (ComplaintTrackingStatus) {
    ComplaintTrackingStatus[ComplaintTrackingStatus["NEW"] = 0] = "NEW";
    ComplaintTrackingStatus[ComplaintTrackingStatus["SCREENED"] = 2] = "SCREENED";
    ComplaintTrackingStatus[ComplaintTrackingStatus["WAITING_ASSIGN"] = 3] = "WAITING_ASSIGN";
    ComplaintTrackingStatus[ComplaintTrackingStatus["IN_PROGRESS"] = 11] = "IN_PROGRESS";
    ComplaintTrackingStatus[ComplaintTrackingStatus["INVESTIGATING"] = 21] = "INVESTIGATING";
    ComplaintTrackingStatus[ComplaintTrackingStatus["WAITING_SUMMARIZE"] = 22] = "WAITING_SUMMARIZE";
    ComplaintTrackingStatus[ComplaintTrackingStatus["WAITING_APPROVAL"] = 23] = "WAITING_APPROVAL";
    ComplaintTrackingStatus[ComplaintTrackingStatus["APPROVED"] = 24] = "APPROVED";
    ComplaintTrackingStatus[ComplaintTrackingStatus["RETURN_FOR_REVIEW"] = 28] = "RETURN_FOR_REVIEW";
    ComplaintTrackingStatus[ComplaintTrackingStatus["CLOSED"] = 91] = "CLOSED";
    ComplaintTrackingStatus[ComplaintTrackingStatus["REOPENED"] = 29] = "REOPENED";
    ComplaintTrackingStatus[ComplaintTrackingStatus["REJECTED"] = 96] = "REJECTED";
})(ComplaintTrackingStatus || (ComplaintTrackingStatus = {}));
export var ComplaintTrackingMode;
(function (ComplaintTrackingMode) {
    ComplaintTrackingMode[ComplaintTrackingMode["NEW"] = 0] = "NEW";
    ComplaintTrackingMode[ComplaintTrackingMode["STATUS_UPDATE"] = 1] = "STATUS_UPDATE";
    ComplaintTrackingMode[ComplaintTrackingMode["STATUS_ADVANCE"] = 2] = "STATUS_ADVANCE";
    ComplaintTrackingMode[ComplaintTrackingMode["STATUS_CLOSE"] = 3] = "STATUS_CLOSE";
    ComplaintTrackingMode[ComplaintTrackingMode["STATUS_REOPEN"] = 4] = "STATUS_REOPEN";
    ComplaintTrackingMode[ComplaintTrackingMode["REASSIGN"] = 51] = "REASSIGN";
    ComplaintTrackingMode[ComplaintTrackingMode["EXTEND_REQUEST"] = 61] = "EXTEND_REQUEST";
    ComplaintTrackingMode[ComplaintTrackingMode["EXTEND_APPROVE"] = 62] = "EXTEND_APPROVE";
})(ComplaintTrackingMode || (ComplaintTrackingMode = {}));
export var ApproveStatus;
(function (ApproveStatus) {
    ApproveStatus[ApproveStatus["PENDING"] = 0] = "PENDING";
    ApproveStatus[ApproveStatus["REJECTED"] = 1] = "REJECTED";
    ApproveStatus[ApproveStatus["APPROVED"] = 2] = "APPROVED";
    ApproveStatus[ApproveStatus["NONE"] = 99] = "NONE";
})(ApproveStatus || (ApproveStatus = {}));
export var ActiveStatus;
(function (ActiveStatus) {
    ActiveStatus[ActiveStatus["ACTIVE"] = 2] = "ACTIVE";
    ActiveStatus[ActiveStatus["INACTIVE"] = 1] = "INACTIVE";
})(ActiveStatus || (ActiveStatus = {}));
export var UserModuleMode;
(function (UserModuleMode) {
    UserModuleMode["SINGLE"] = "SINGLE";
    UserModuleMode["CHILD"] = "CHILD";
    UserModuleMode["PARENT"] = "PARENT";
})(UserModuleMode || (UserModuleMode = {}));
export var ActiveStatusTitle;
(function (ActiveStatusTitle) {
    ActiveStatusTitle[ActiveStatusTitle["\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19"] = 2] = "\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19";
    ActiveStatusTitle[ActiveStatusTitle["\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19"] = 1] = "\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19";
})(ActiveStatusTitle || (ActiveStatusTitle = {}));
export var OrganizationType;
(function (OrganizationType) {
    OrganizationType["COMPANY"] = "COMPANY";
    OrganizationType["BRANCH"] = "BRANCH";
    OrganizationType["DEPARTMENT"] = "DEPARTMENT";
})(OrganizationType || (OrganizationType = {}));
export var OrganizationTypeTitle;
(function (OrganizationTypeTitle) {
    OrganizationTypeTitle["\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17"] = "COMPANY";
    OrganizationTypeTitle["\u0E2A\u0E32\u0E02\u0E32"] = "BRANCH";
    OrganizationTypeTitle["\u0E41\u0E1C\u0E19\u0E01"] = "DEPARTMENT";
})(OrganizationTypeTitle || (OrganizationTypeTitle = {}));
export var ApproveStatusTitle;
(function (ApproveStatusTitle) {
    ApproveStatusTitle[ApproveStatusTitle["\u0E23\u0E2D\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34"] = 0] = "\u0E23\u0E2D\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34";
    ApproveStatusTitle[ApproveStatusTitle["\u0E44\u0E21\u0E48\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34"] = 1] = "\u0E44\u0E21\u0E48\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34";
    ApproveStatusTitle[ApproveStatusTitle["\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34"] = 2] = "\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34";
    ApproveStatusTitle[ApproveStatusTitle[""] = 99] = "";
})(ApproveStatusTitle || (ApproveStatusTitle = {}));
export var ComplaintStatusTitle;
(function (ComplaintStatusTitle) {
    ComplaintStatusTitle[ComplaintStatusTitle["\u0E41\u0E08\u0E49\u0E07\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07"] = 0] = "\u0E41\u0E08\u0E49\u0E07\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07";
    ComplaintStatusTitle[ComplaintStatusTitle["\u0E23\u0E31\u0E1A\u0E41\u0E08\u0E49\u0E07\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07"] = 5] = "\u0E23\u0E31\u0E1A\u0E41\u0E08\u0E49\u0E07\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07";
    ComplaintStatusTitle[ComplaintStatusTitle["\u0E01\u0E33\u0E25\u0E31\u0E07\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23"] = 10] = "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23";
    ComplaintStatusTitle[ComplaintStatusTitle["\u0E23\u0E2D\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A"] = 20] = "\u0E23\u0E2D\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A";
    ComplaintStatusTitle[ComplaintStatusTitle["\u0E1B\u0E34\u0E14\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07"] = 91] = "\u0E1B\u0E34\u0E14\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07";
    ComplaintStatusTitle[ComplaintStatusTitle["\u0E44\u0E21\u0E48\u0E23\u0E31\u0E1A\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07"] = 96] = "\u0E44\u0E21\u0E48\u0E23\u0E31\u0E1A\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07";
})(ComplaintStatusTitle || (ComplaintStatusTitle = {}));
export var ComplaintTrackingStatusTitle;
(function (ComplaintTrackingStatusTitle) {
    ComplaintTrackingStatusTitle[ComplaintTrackingStatusTitle["\u0E41\u0E08\u0E49\u0E07\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07"] = 0] = "\u0E41\u0E08\u0E49\u0E07\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07";
    ComplaintTrackingStatusTitle[ComplaintTrackingStatusTitle["\u0E23\u0E31\u0E1A\u0E41\u0E08\u0E49\u0E07\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07"] = 5] = "\u0E23\u0E31\u0E1A\u0E41\u0E08\u0E49\u0E07\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07";
    ComplaintTrackingStatusTitle[ComplaintTrackingStatusTitle["\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E40\u0E1A\u0E37\u0E49\u0E2D\u0E07\u0E15\u0E49\u0E19\u0E41\u0E25\u0E49\u0E27"] = 2] = "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E40\u0E1A\u0E37\u0E49\u0E2D\u0E07\u0E15\u0E49\u0E19\u0E41\u0E25\u0E49\u0E27";
    ComplaintTrackingStatusTitle[ComplaintTrackingStatusTitle["\u0E23\u0E2D\u0E2B\u0E21\u0E2D\u0E1A\u0E2B\u0E21\u0E32\u0E22\u0E1C\u0E39\u0E49\u0E23\u0E31\u0E1A\u0E1C\u0E34\u0E14\u0E0A\u0E2D\u0E1A"] = 3] = "\u0E23\u0E2D\u0E2B\u0E21\u0E2D\u0E1A\u0E2B\u0E21\u0E32\u0E22\u0E1C\u0E39\u0E49\u0E23\u0E31\u0E1A\u0E1C\u0E34\u0E14\u0E0A\u0E2D\u0E1A";
    ComplaintTrackingStatusTitle[ComplaintTrackingStatusTitle["\u0E2D\u0E22\u0E39\u0E48\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23"] = 11] = "\u0E2D\u0E22\u0E39\u0E48\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23";
    ComplaintTrackingStatusTitle[ComplaintTrackingStatusTitle["\u0E2D\u0E22\u0E39\u0E48\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E2A\u0E2D\u0E1A\u0E2A\u0E27\u0E19"] = 21] = "\u0E2D\u0E22\u0E39\u0E48\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E2A\u0E2D\u0E1A\u0E2A\u0E27\u0E19";
    ComplaintTrackingStatusTitle[ComplaintTrackingStatusTitle["\u0E23\u0E2D\u0E2A\u0E23\u0E38\u0E1B\u0E1C\u0E25\u0E2A\u0E2D\u0E1A\u0E2A\u0E27\u0E19"] = 22] = "\u0E23\u0E2D\u0E2A\u0E23\u0E38\u0E1B\u0E1C\u0E25\u0E2A\u0E2D\u0E1A\u0E2A\u0E27\u0E19";
    ComplaintTrackingStatusTitle[ComplaintTrackingStatusTitle["\u0E23\u0E2D\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E1C\u0E25"] = 23] = "\u0E23\u0E2D\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E1C\u0E25";
    ComplaintTrackingStatusTitle[ComplaintTrackingStatusTitle["\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E41\u0E25\u0E49\u0E27"] = 24] = "\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E41\u0E25\u0E49\u0E27";
    ComplaintTrackingStatusTitle[ComplaintTrackingStatusTitle["\u0E2A\u0E48\u0E07\u0E01\u0E25\u0E31\u0E1A\u0E43\u0E2B\u0E49\u0E17\u0E1A\u0E17\u0E27\u0E19"] = 28] = "\u0E2A\u0E48\u0E07\u0E01\u0E25\u0E31\u0E1A\u0E43\u0E2B\u0E49\u0E17\u0E1A\u0E17\u0E27\u0E19";
    ComplaintTrackingStatusTitle[ComplaintTrackingStatusTitle["\u0E1B\u0E34\u0E14\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07"] = 91] = "\u0E1B\u0E34\u0E14\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07";
    ComplaintTrackingStatusTitle[ComplaintTrackingStatusTitle["\u0E40\u0E1B\u0E34\u0E14\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48 (Reopen)"] = 29] = "\u0E40\u0E1B\u0E34\u0E14\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48 (Reopen)";
    ComplaintTrackingStatusTitle[ComplaintTrackingStatusTitle["\u0E44\u0E21\u0E48\u0E23\u0E31\u0E1A\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07"] = 96] = "\u0E44\u0E21\u0E48\u0E23\u0E31\u0E1A\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07";
})(ComplaintTrackingStatusTitle || (ComplaintTrackingStatusTitle = {}));
export var ComplaintTrackingModeTitle;
(function (ComplaintTrackingModeTitle) {
    ComplaintTrackingModeTitle[ComplaintTrackingModeTitle["\u0E41\u0E08\u0E49\u0E07\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07"] = 0] = "\u0E41\u0E08\u0E49\u0E07\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07";
    ComplaintTrackingModeTitle[ComplaintTrackingModeTitle["\u0E2D\u0E31\u0E1E\u0E40\u0E14\u0E15\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25"] = 1] = "\u0E2D\u0E31\u0E1E\u0E40\u0E14\u0E15\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25";
    ComplaintTrackingModeTitle[ComplaintTrackingModeTitle["\u0E2A\u0E48\u0E07\u0E15\u0E48\u0E2D"] = 2] = "\u0E2A\u0E48\u0E07\u0E15\u0E48\u0E2D";
    ComplaintTrackingModeTitle[ComplaintTrackingModeTitle["\u0E1B\u0E34\u0E14\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07"] = 3] = "\u0E1B\u0E34\u0E14\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07";
    ComplaintTrackingModeTitle[ComplaintTrackingModeTitle["\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E2B\u0E21\u0E48"] = 4] = "\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E2B\u0E21\u0E48";
    ComplaintTrackingModeTitle[ComplaintTrackingModeTitle["\u0E21\u0E2D\u0E1A\u0E2B\u0E21\u0E32\u0E22\u0E43\u0E2B\u0E21\u0E48"] = 51] = "\u0E21\u0E2D\u0E1A\u0E2B\u0E21\u0E32\u0E22\u0E43\u0E2B\u0E21\u0E48";
    ComplaintTrackingModeTitle[ComplaintTrackingModeTitle["\u0E02\u0E2D\u0E02\u0E22\u0E32\u0E22\u0E40\u0E27\u0E25\u0E32"] = 61] = "\u0E02\u0E2D\u0E02\u0E22\u0E32\u0E22\u0E40\u0E27\u0E25\u0E32";
    ComplaintTrackingModeTitle[ComplaintTrackingModeTitle["\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E02\u0E22\u0E32\u0E22\u0E40\u0E27\u0E25\u0E32"] = 62] = "\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E02\u0E22\u0E32\u0E22\u0E40\u0E27\u0E25\u0E32";
})(ComplaintTrackingModeTitle || (ComplaintTrackingModeTitle = {}));
export function IsSensitiveTitle(val) {
    return val ? 'อ่อนไหว' : 'ปกติ';
}
export function IsComplexTitle(val) {
    return val ? 'ซับซ้อน' : 'ปกติ';
}
export function getEnumValue(type) {
    return Object.entries(type)
        .filter(([key, _value]) => Number.isNaN(Number(key)))
        .map(([_key, value]) => value);
}
export function getEnumValueAsString(type) {
    return Object.entries(type)
        .filter(([key, _value]) => Number.isNaN(Number(key)))
        .map(([_key, value]) => String(value));
}
export function getEnumByKey(type, val) {
    const match = Object.entries(type).find(([key, _value]) => key === val);
    if (match)
        return match[0];
    return '';
}
export function getEnumByValue(type, val) {
    const match = Object.entries(type).find(([_key, value]) => value === val);
    if (match)
        return match[0];
    return '';
}
export function getEnumKeyValue(type) {
    return Object.entries(type)
        .filter(([key, _value]) => Number.isNaN(Number(key)))
        .map(([key, value]) => ({
        key,
        value,
    }));
}
export function getEnumKeyValueWithCustomTitle(type, keyTitle, valueTitle) {
    return Object.entries(type)
        .filter(([key, _value]) => Number.isNaN(Number(key)))
        .map(([key, value]) => ({
        [keyTitle]: key,
        [valueTitle]: String(value),
    }));
}
export function getEnumKeyValueString(type) {
    return Object.entries(type).map(([key, value]) => ({
        key,
        value,
    }));
}
//# sourceMappingURL=enum.js.map