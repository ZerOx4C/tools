var TAG_MASTER_SOURCE = [
    [1, "初期", 1],
    [2, "エリート", 2],
    [3, "上級エリート", 4],
    [4, "近距離", 8],
    [5, "遠距離", 16],
    [6, "前衛タイプ", 32],
    [7, "医療タイプ", 64],
    [8, "先鋒タイプ", 128],
    [9, "術士タイプ", 256],
    [10, "狙撃タイプ", 512],
    [11, "重装タイプ", 1024],
    [12, "補助タイプ", 2048],
    [13, "特殊タイプ", 4096],
    [14, "治療", 8192],
    [15, "支援", 16384],
    [16, "火力", 32768],
    [17, "範囲攻撃", 65536],
    [18, "減速", 131072],
    [19, "生存", 262144],
    [20, "防御", 524288],
    [21, "弱化", 1048576],
    [22, "強制移動", 2097152],
    [23, "牽制", 4194304],
    [24, "爆発力", 8388608],
    [25, "召喚", 16777216],
    [26, "高速再配置", 33554432],
    [27, "COST回復", 67108864],
    [28, "ロボット", 134217728],
];

var UNIT_MASTER_SOURCE = [
    ["二アール", 1, 5, ""],
    ["グム", 2, 4, ""],
    ["メテオリーテ", 3, 5, ""],
    ["シラユキ", 4, 4, ""],
    ["スペクター", 5, 5, ""],
    ["エステル", 6, 4, "公開求人限定"],
    ["エフイーター", 7, 5, ""],
    ["フロストリーフ", 8, 4, ""],
    ["イースチナ", 9, 5, ""],
    ["ジェシカ", 10, 4, ""],
    ["ズィマー", 11, 5, ""],
    ["ワルファリン", 12, 5, ""],
    ["フィリオプシス", 13, 5, ""],
    ["マンティコア", 14, 5, ""],
    ["クリフハート", 15, 5, ""],
    ["リスカム", 16, 5, ""],
    ["ヴァルカン", 17, 5, "公開求人限定"],
    ["プラマニクス", 18, 5, ""],
    ["クロワッサン", 19, 5, ""],
];

var PATTERN_MASTER_SOURCE = [
    [1, 8192, 525320, ""],
    [2, 8192, 525320, ""],
    [3, 65536, 512, ""],
    [4, 65536, 512, ""],
    [5, 65536, 262184, ""],
    [6, 65536, 262184, ""],
    [7, 131072, 8, ""],
    [8, 131072, 8, ""],
    [8, 131072, 32, ""],
    [9, 131072, 32768, ""],
    [8, 131072, 32768, ""],
    [4, 131072, 66048, ""],
    [10, 262144, 528, ""],
    [11, 16384, 67108992, ""],
    [12, 16384, 8272, ""],
    [13, 16384, 8272, ""],
    [9, 32768, 2048, ""],
    [14, 32768, 4096, ""],
    [15, 32768, 4096, ""],
    [15, 32768, 2097152, ""],
    [16, 32768, 525312, ""],
    [17, 32768, 525312, ""],
    [7, 131072, 2101248, ""],
    [14, 262144, 4096, ""],
    [17, 262144, 525312, ""],
    [18, 1048576, 2048, ""],
    [3, 1048576, 65536, ""],
    [19, 2097152, 525312, ""],
];

var TagMaster = {};
TAG_MASTER_SOURCE.forEach(function(row) {
    TagMaster[row[0]] = {
        id: row[0],
        name: row[1],
        flag: row[2],
    };
});

var UnitMaster = {};
UNIT_MASTER_SOURCE.forEach(function(row) {
    UnitMaster[row[1]] = {
        id: row[1],
        name: row[0],
        rarity: row[2],
        note: row[3],
    };
})

var PatternMaster = {};
PATTERN_MASTER_SOURCE.forEach(function(row, index) {
    PatternMaster[index] = {
        id: index,
        unitId: row[0],
        essentialFlags: row[1],
        optionalFlags: row[2],
        note: row[3],
    }
})

var selectedFlags = 0;

function initializeTagArea() {
    var tagAreaElement = document.getElementById("tagArea");
    Array.from(tagAreaElement.children).forEach(function (tagElement) {
        tagElement.remove();
    });

    var tagTemplateElement = document.getElementById("tagTemplate");
    var tagElementOrigin = tagTemplateElement.content.querySelector("a");

    Object.keys(TagMaster).forEach(function(tagId) {
        var tag = TagMaster[tagId];
        var tagElement = document.importNode(tagElementOrigin, true);
        tagElement.dataset.flag = tag.flag;
        tagElement.text = tag.name;
        tagAreaElement.appendChild(tagElement);
    });
}

function updateTagArea() {
    var tagAreaElement = document.getElementById("tagArea");
    Array.from(tagAreaElement.children).forEach(function(tagElement) {
        if (selectedFlags & tagElement.dataset.flag) {
            tagElement.classList.add("selected");
        }
        else {
            tagElement.classList.remove("selected");
        }
    });
}

function initializePatternArea() {
    var resultAreaElement = document.getElementById("resultArea");
    Array.from(resultAreaElement.children).forEach(function (patternElement) {
        patternElement.remove();
    });

    var resultTemplateElement = document.getElementById("resultTemplate");
    var resultElementOrigin = resultTemplateElement.content.querySelector(".result");

    var unitIdToPatternIdListTable = {};
    Object.keys(PatternMaster).forEach(function (patternId) {
        var pattern = PatternMaster[patternId];
        var unit = UnitMaster[pattern.unitId];
        var patternIdList = unitIdToPatternIdListTable[unit.id] || [];
        patternIdList.push(patternId);
        unitIdToPatternIdListTable[unit.id] = patternIdList;
    });

    Object.keys(unitIdToPatternIdListTable).forEach(function (unitId) {
        var patternIdList = unitIdToPatternIdListTable[unitId];
        var resultElement = document.importNode(resultElementOrigin, true);
        fillResultElement(resultElement, unitId, patternIdList);
        resultAreaElement.appendChild(resultElement);
    });
}

function fillResultElement(resultElement, unitId, patternIdList) {
    var unit = UnitMaster[unitId];

    var unitNameElement = resultElement.querySelector(".unit-name");
    var patternListElement = resultElement.querySelector(".pattern-list");
    var patternElementOrigin = resultElement.querySelector(".pattern");
    patternElementOrigin.remove();

    unitNameElement.innerHTML = unit.name;
    resultElement.dataset.patternIdList = patternIdList;

    patternIdList.forEach(function(patternId) {
        var patternElement = document.importNode(patternElementOrigin, true);
        fillResultPatternElement(patternElement, patternId);
        patternListElement.appendChild(patternElement);
    });
}

function fillResultPatternElement(patternElement, patternId) {
    var pattern = PatternMaster[patternId];

    var tagListElement = patternElement.querySelector(".tag-list");
    var tagElementOrigin = patternElement.querySelector(".tag");
    var noteElement = patternElement.querySelector(".note");
    tagElementOrigin.remove();

    patternElement.dataset.id = patternId;
    noteElement.innerHTML = pattern.note;

    var essentialTagElementList = [];
    var optionalTagElementList = [];

    Object.keys(TagMaster).forEach(function(tagId) {
        var tag = TagMaster[tagId];

        if (tag.flag & pattern.optionalFlags) {
            var tagElement = document.importNode(tagElementOrigin, true);
            fillResultPatternTagElement(tagElement, tagId);
            optionalTagElementList.push(tagElement);
        }
        else if (tag.flag & pattern.essentialFlags) {
            var tagElement = document.importNode(tagElementOrigin, true);
            fillResultPatternTagElement(tagElement, tagId);
            tagElement.classList.add("essential");
            essentialTagElementList.push(tagElement);
        }
    });

    essentialTagElementList.forEach(function(element) {
        tagListElement.appendChild(element);
    });
    optionalTagElementList.forEach(function(element) {
        tagListElement.appendChild(element);
    });
}

function fillResultPatternTagElement(tagElement, tagId) {
    var tag = TagMaster[tagId]
    tagElement.innerHTML = tag.name;
    tagElement.dataset.flag = tag.flag;
}

function updateResultArea() {
    var resultAreaElement = document.getElementById("resultArea");
    Array.from(resultAreaElement.children).forEach(updateResultElement);
}

function updateResultElement(resultElement) {
    var anyPatternSatisfied = resultElement.dataset.patternIdList.split(",").some(function(patternId) {
        var pattern = PatternMaster[patternId];
        if (pattern.essentialFlags & selectedFlags) {
            return true;
        }
    });

    if (anyPatternSatisfied) {
        resultElement.classList.add("satisfied");
    }
    else {
        resultElement.classList.remove("satisfied");
    }

    var patternListElement = resultElement.querySelector(".pattern-list");
    Array.from(patternListElement.children).forEach(updateResultPatternElement);
}

function updateResultPatternElement(patternElement) {
    var pattern = PatternMaster[patternElement.dataset.id];

    if (pattern.essentialFlags & selectedFlags) {
        patternElement.classList.add("satisfied");
    }
    else {
        patternElement.classList.remove("satisfied");
    }

    var tagListElement = patternElement.querySelector(".tag-list");
    Array.from(tagListElement.children).forEach(updateResultPatternTagElement);
}

function updateResultPatternTagElement(tagElement) {
    if (tagElement.dataset.flag & selectedFlags) {
        tagElement.classList.add("satisfied");
    }
    else {
        tagElement.classList.remove("satisfied");
    }
}

function onTagClicked(tagElement) {
    selectedFlags ^= tagElement.dataset.flag;
    updateTagArea();
    updateResultArea();
}

function onResetClicked() {
    selectedFlags = 0;
    updateTagArea();
    updateResultArea();
}

function onBodyLoaded() {
    console.log("hello");
    console.log(TagMaster);
    console.log(UnitMaster);
    console.log(PatternMaster);
    initializeTagArea();
    initializePatternArea();
    updateTagArea();
    updateResultArea();
}
