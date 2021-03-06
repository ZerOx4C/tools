var TagMaster = {};
TAG_MASTER_SOURCE.forEach(function(row) {
    TagMaster[row[0]] = {
        id: row[0],
        name: row[1],
        lowerName: row[1].toLowerCase(),
        ruby: row[3],
        flag: row[2],
    };
});

var UnitMaster = {};
UNIT_MASTER_SOURCE.forEach(function(row) {
    UnitMaster[row[1]] = {
        id: row[1],
        name: row[0],
        lowerName: row[0].toLowerCase(),
        ruby: row[2],
        rarity: row[3],
        note: row[4],
    };
});

var PatternMaster = {};
PATTERN_MASTER_SOURCE.forEach(function(row, index) {
    PatternMaster[index] = {
        id: index,
        unitId: row[0],
        essentialFlags: row[1],
        optionalFlags: row[2],
        note: row[3],
    }
});

var tagStatusTable = {};
var patternStatusTable = {};
var unitStatusTable = {};

var tagFilterElement = null;
var tagElementList = [];
var unitFilterElement = null;
var unitListElement = null;
var unitElementList = [];
var unitPatternElementList = [];
var unitTagElementList = [];

var selectedFlags = 0;
var tagFilter = "";
var unitFilter = "";

function getTagIdListByFlags(flags) {
    var ret = [];

    Object.keys(TagMaster).forEach(function (tagId) {
        var tag = TagMaster[tagId];

        if (tag.flag & flags) {
            ret.push(tagId);
        }
    });

    return ret;
}

function initializeTagStatus() {
    tagStatusTable = {};

    Object.keys(TagMaster).forEach(function (tagId) {
        tagStatusTable[tagId] = {
            flagMatched: false,
            filterMatched: false,
        };
    });
}

function initializePatetrnStatus() {
    patternStatusTable = {};

    Object.keys(PatternMaster).forEach(function (patternId) {
        var pattern = PatternMaster[patternId];

        patternStatusTable[patternId] = {
            flagMatched: false,
            essentialTagIdList: getTagIdListByFlags(pattern.essentialFlags),
            optionalTagIdList: getTagIdListByFlags(pattern.optionalFlags),
        };
    });
}

function initializeUnitStatus() {
    unitStatusTable = {};

    var unitIdToPatternStatusListTable = {};
    Object.keys(PatternMaster).forEach(function (patternId) {
        var pattern = PatternMaster[patternId];
        var patternIdList = unitIdToPatternStatusListTable[pattern.unitId] || [];
        patternIdList.push(patternId);
        unitIdToPatternStatusListTable[pattern.unitId] = patternIdList;
    });

    Object.keys(UnitMaster).forEach(function (unitId) {
        unitStatusTable[unitId] = {
            flagMatched: false,
            patternIdList: unitIdToPatternStatusListTable[unitId] || [],
        };
    });
}

function updateTagStatus() {
    Object.keys(tagStatusTable).forEach(function (tagId) {
        var tagStatus = tagStatusTable[tagId];
        var tag = TagMaster[tagId];

        if (tagFilter == "") {
            tagStatus.filterMatched = true;
        }
        else if (0 <= tag.ruby.indexOf(tagFilter)) {
            tagStatus.filterMatched = true;
        }
        else if (0 <= tag.lowerName.indexOf(tagFilter)) {
            tagStatus.filterMatched = true;
        }
        else {
            tagStatus.filterMatched = false;
        }

        if (tag.flag & selectedFlags) {
            tagStatus.flagMatched = true;
        }
        else {
            tagStatus.flagMatched = false;
        }
    });
}

function updatePatetrnStatus() {
    Object.keys(patternStatusTable).forEach(function (patternId) {
        var patternStatus = patternStatusTable[patternId];

        patternStatus.essentialMatchedCount = 0;
        patternStatus.essentialTagIdList.forEach(function (tagId) {
            var tagStatus = tagStatusTable[tagId];
            if (tagStatus.flagMatched) {
                ++patternStatus.essentialMatchedCount;
            }
        });

        patternStatus.optionalMatchedCount = 0;
        patternStatus.optionalTagIdList.forEach(function (tagId) {
            var tagStatus = tagStatusTable[tagId];
            if (tagStatus.flagMatched) {
                ++patternStatus.optionalMatchedCount;
            }
        });

        if (0 < patternStatus.essentialMatchedCount) {
            patternStatus.flagMatched = true;
        }
        else if (0 < patternStatus.essentialTagIdList.length) {
            patternStatus.flagMatched = false;
        }
        else if (0 < patternStatus.optionalMatchedCount) {
            patternStatus.flagMatched = true;
        }
        else {
            patternStatus.flagMatched = false;
        }
    });
}

function updateUnitStatus() {
    Object.keys(unitStatusTable).forEach(function (unitId) {
        var unitStatus = unitStatusTable[unitId];
        var unit = UnitMaster[unitId];

        unitStatus.maxEssentialMatchedCount = 0;
        unitStatus.maxOptionalMatchedCount = 0;
        unitStatus.flagMatched = false;

        unitStatus.patternIdList.forEach(function (patternId) {
            var patternStatus = patternStatusTable[patternId];

            if (unitStatus.maxEssentialMatchedCount < patternStatus.essentialMatchedCount) {
                unitStatus.maxEssentialMatchedCount = patternStatus.essentialMatchedCount;
            }

            if (unitStatus.maxOptionalMatchedCount < patternStatus.optionalMatchedCount) {
                unitStatus.maxOptionalMatchedCount = patternStatus.optionalMatchedCount;
            }

            if (!unitStatus.flagMatched) {
                unitStatus.flagMatched = patternStatus.flagMatched;
            }
        });

        if (unitFilter == "") {
            unitStatus.filterMatched = true;
        }
        else if (0 <= unit.ruby.indexOf(unitFilter)) {
            unitStatus.filterMatched = true;
        }
        else if (0 <= unit.lowerName.indexOf(unitFilter)) {
            unitStatus.filterMatched = true;
        }
        else {
            unitStatus.filterMatched = false;
        }
    });
}

function initializeTagListView() {
    tagElementList = [];

    tagFilterElement = document.getElementById("tagFilter");
    var tagListElement = document.getElementById("tagList");
    var tagTemplateElement = document.getElementById("tagTemplate");
    var tagElementOrigin = tagTemplateElement.content.querySelector("a");

    Array.from(tagListElement.children).forEach(function (tagElement) {
        tagElement.remove();
    });

    Object.keys(tagStatusTable).forEach(function (tagId) {
        var tag = TagMaster[tagId];
        var tagElement = document.importNode(tagElementOrigin, true);
        tagElement.dataset.tagId = tagId;
        tagElement.text = tag.name;
        tagElementList.push(tagElement);
        tagListElement.appendChild(tagElement);
    });
}

function initializeUnitListView() {
    unitElementList = [];
    unitPatternElementList = [];
    unitTagElementList = [];

    unitFilterElement = document.getElementById("unitFilter");
    unitListElement = document.getElementById("unitList");
    var unitTemplateElement = document.getElementById("unitTemplate");
    var unitElementOrigin = unitTemplateElement.content.querySelector(".unit");

    Array.from(unitListElement.children).forEach(function (unitElement) {
        unitElement.remove();
    });

    Object.keys(unitStatusTable).forEach(function (unitId) {
        var unitElement = document.importNode(unitElementOrigin, true);
        fillUnitElement(unitElement, unitId);
        unitElementList.push(unitElement);
        unitListElement.appendChild(unitElement);
    });
}

function fillUnitElement(unitElement, unitId) {
    var unitRarityElement = unitElement.querySelector(".unit-rarity");
    var unitNameElement = unitElement.querySelector(".unit-name");
    var unitNoteElement = unitElement.querySelector(".unit-note");
    var patternListElement = unitElement.querySelector(".pattern-list");
    var patternElementOrigin = unitElement.querySelector(".pattern");

    var unitStatus = unitStatusTable[unitId];
    var unit = UnitMaster[unitId];
    unitElement.dataset.unitId = unitId;
    unitRarityElement.innerHTML = "★" + unit.rarity;
    unitRarityElement.classList.add("rarity" + unit.rarity);
    unitNameElement.innerHTML = unit.name;
    unitNoteElement.innerHTML = unit.note;

    patternElementOrigin.remove();

    unitStatus.patternIdList.forEach(function (patternId) {
        var patternElement = document.importNode(patternElementOrigin, true);
        fillUnitPatternElement(patternElement, patternId);
        unitPatternElementList.push(patternElement);
        patternListElement.appendChild(patternElement);
    });
}

function fillUnitPatternElement(patternElement, patternId) {
    var essentialTagListElement = patternElement.querySelector(".tag-list.essential");
    var optionalTagListElement = patternElement.querySelector(".tag-list:not(.essential)");
    var essentialTagElementOrigin = essentialTagListElement.querySelector(".tag");
    var optionalTagElementOrigin = optionalTagListElement.querySelector(".tag");
    var patternNoteElement = patternElement.querySelector(".pattern-note");

    var patternStatus = patternStatusTable[patternId];
    var pattern = PatternMaster[patternId];
    patternElement.dataset.patternId = patternId;
    patternNoteElement.innerHTML = pattern.note;

    essentialTagElementOrigin.remove();
    optionalTagElementOrigin.remove();

    patternStatus.essentialTagIdList.forEach(function (tagId) {
        var tagElement = document.importNode(essentialTagElementOrigin, true);
        fillUnitTagElement(tagElement, tagId);
        unitTagElementList.push(tagElement);
        essentialTagListElement.appendChild(tagElement);
    });

    patternStatus.optionalTagIdList.forEach(function (tagId) {
        var tagElement = document.importNode(optionalTagElementOrigin, true);
        fillUnitTagElement(tagElement, tagId);
        unitTagElementList.push(tagElement);
        optionalTagListElement.appendChild(tagElement);
    });
}

function fillUnitTagElement(tagElement, tagId) {
    var tag = TagMaster[tagId]
    tagElement.dataset.tagId = tagId;
    tagElement.innerHTML = tag.name;
}

function updateTagListView() {
    tagElementList.forEach(function (tagElement) {
        var tagStatus = tagStatusTable[tagElement.dataset.tagId];
        tagElement.classList.toggle("selected", tagStatus.flagMatched);
        tagElement.classList.toggle("shade", !tagStatus.filterMatched);
    });
}

function updateUnitListView() {
    var unitEntryList = [];

    unitElementList.forEach(function (unitElement) {
        var unitId = unitElement.dataset.unitId;
        var unitStatus = unitStatusTable[unitId];
        var unit = UnitMaster[unitId];

        var priority = 0;
        if (unitStatus.flagMatched) {
            ++priority;
        }

        unitEntryList.push({
            unitId: parseInt(unitId, 10),
            rarity: unit.rarity,
            maxEssentialMatchedCount: unitStatus.maxEssentialMatchedCount,
            maxOptionalMatchedCount: unitStatus.maxOptionalMatchedCount,
            priority: priority,
            element: unitElement,
        });
    });

    unitEntryList.sort(function (lhs, rhs) {
        if (lhs.priority != rhs.priority) {
            return rhs.priority - lhs.priority;
        }

        if (lhs.maxEssentialMatchedCount != rhs.maxEssentialMatchedCount) {
            return rhs.maxEssentialMatchedCount - lhs.maxEssentialMatchedCount;
        }

        if (lhs.maxOptionalMatchedCount != rhs.maxOptionalMatchedCount) {
            return rhs.maxOptionalMatchedCount - lhs.maxOptionalMatchedCount;
        }

        if (lhs.rarity != rhs.rarity) {
            return rhs.rarity - lhs.rarity;
        }

        return lhs.unitId - rhs.unitId;
    });

    unitEntryList.forEach(function (unitEntry) {
        unitEntry.element.remove();
        unitListElement.appendChild(unitEntry.element);
    });

    unitElementList.forEach(function (unitElement) {
        var unitStatus = unitStatusTable[unitElement.dataset.unitId];
        unitElement.classList.toggle("shade", 0 < selectedFlags && !unitStatus.flagMatched);
        unitElement.classList.toggle("hide", !unitStatus.filterMatched);
    });

    unitPatternElementList.forEach(function (patternElement) {
        var patternStatus = patternStatusTable[patternElement.dataset.patternId];
        patternElement.classList.toggle("shade", 0 < selectedFlags && !patternStatus.flagMatched);
    });

    unitTagElementList.forEach(function (tagElement) {
        var tagStatus = tagStatusTable[tagElement.dataset.tagId];
        tagElement.classList.toggle("matched", tagStatus.flagMatched);
    });
}

function onTagFilterChanged() {
    tagFilter = tagFilterElement.value.toLowerCase();

    updateTagStatus();
    updateTagListView();
}

function onUnitFilterChanged() {
    unitFilter = unitFilterElement.value.toLowerCase();

    updateUnitStatus();
    updateUnitListView();
}

function onTagClicked(tagElement) {
    var tag = TagMaster[tagElement.dataset.tagId];
    selectedFlags ^= tag.flag;

    updateTagStatus();
    updatePatetrnStatus();
    updateUnitStatus();

    updateTagListView();
    updateUnitListView();
}

function onTagResetClicked() {
    selectedFlags = 0;
    tagFilter = "";
    tagFilterElement.value = "";

    updateTagStatus();
    updatePatetrnStatus();
    updateUnitStatus();

    updateTagListView();
    updateUnitListView();
}

function onUnitResetClicked() {
    unitFilter = "";
    unitFilterElement.value = "";

    updateUnitStatus();
    updateUnitListView();
}

function onBodyLoaded() {
    initializeTagStatus();
    initializePatetrnStatus();
    initializeUnitStatus();

    updateTagStatus();
    updatePatetrnStatus();
    updateUnitStatus();

    initializeTagListView();
    initializeUnitListView();

    updateTagListView();
    updateUnitListView();
}
