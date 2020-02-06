var TAG_MASTER_SOURCE = [
    [1, "初期", 1, "しょき"],
    [2, "エリート", 2, "えりーと"],
    [3, "上級エリート", 4, "じょうきゅうえりーと"],
    [4, "近距離", 8, "きんきょり"],
    [5, "遠距離", 16, "えんきょり"],
    [6, "前衛タイプ", 32, "ぜんえいたいぷ"],
    [7, "医療タイプ", 64, "いりょうたいぷ"],
    [8, "先鋒タイプ", 128, "せんぽうたいぷ"],
    [9, "術士タイプ", 256, "じゅつしたいぷ"],
    [10, "狙撃タイプ", 512, "そげきたいぷ"],
    [11, "重装タイプ", 1024, "じゅうそうたいぷ"],
    [12, "補助タイプ", 2048, "ほじょたいぷ"],
    [13, "特殊タイプ", 4096, "とくしゅたいぷ"],
    [14, "治療", 8192, "ちりょう"],
    [15, "支援", 16384, "しえん"],
    [16, "火力", 32768, "かりょく"],
    [17, "範囲攻撃", 65536, "はんいこうげき"],
    [18, "減速", 131072, "げんそく"],
    [19, "生存", 262144, "せいぞん"],
    [20, "防御", 524288, "ぼうぎょ"],
    [21, "弱化", 1048576, "じゃくか"],
    [22, "強制移動", 2097152, "きょうせいいどう"],
    [23, "牽制", 4194304, "けんせい"],
    [24, "爆発力", 8388608, "ばくはつりょく"],
    [25, "召喚", 16777216, "しょうかん"],
    [26, "高速再配置", 33554432, "こうそくさいはいち"],
    [27, "COST回復", 67108864, "こすとかいふく"],
    [28, "ロボット", 134217728, "ろぼっと"],
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
var tagFilter = null;

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
        tagElement.dataset.id = tagId;
        tagElement.text = tag.name;
        tagAreaElement.appendChild(tagElement);
    });
}

function updateTagArea() {
    var tagAreaElement = document.getElementById("tagArea");
    if (tagFilter) {
        tagAreaElement.classList.add("filtered");
    }
    else {
        tagAreaElement.classList.remove("filtered");
    }

    Array.from(tagAreaElement.children).forEach(function(tagElement) {
        if (selectedFlags & tagElement.dataset.flag) {
            tagElement.classList.add("selected");
        }
        else {
            tagElement.classList.remove("selected");
        }

        if (!tagFilter) {
            tagElement.classList.remove("matched");
            return;
        }

        var tag = TagMaster[tagElement.dataset.id];
        if (0 <= tag.ruby.indexOf(tagFilter) || 0 <= tag.lowerName.indexOf(tagFilter)) {
            tagElement.classList.add("matched");
        }
        else {
            tagElement.classList.remove("matched");
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
    var unitNoteElement = resultElement.querySelector(".unit-note");
    var patternListElement = resultElement.querySelector(".pattern-list");
    var patternElementOrigin = resultElement.querySelector(".pattern");
    patternElementOrigin.remove();

    unitNameElement.innerHTML = unit.name;
    unitNoteElement.innerHTML = unit.note;
    resultElement.dataset.patternIdList = patternIdList;

    patternIdList.forEach(function(patternId) {
        var patternElement = document.importNode(patternElementOrigin, true);
        fillResultPatternElement(patternElement, patternId);
        patternListElement.appendChild(patternElement);
    });
}

function fillResultPatternElement(patternElement, patternId) {
    var pattern = PatternMaster[patternId];

    var essentialTagListElement = patternElement.querySelector(".tag-list.essential");
    var optionalTagListElement = patternElement.querySelector(".tag-list:not(.essential)");
    var essentialTagElementOrigin = essentialTagListElement.querySelector(".tag");
    var optionalTagElementOrigin = optionalTagListElement.querySelector(".tag");
    var noteElement = patternElement.querySelector(".note");
    essentialTagElementOrigin.remove();
    optionalTagElementOrigin.remove();

    patternElement.dataset.id = patternId;
    noteElement.innerHTML = pattern.note;

    Object.keys(TagMaster).forEach(function(tagId) {
        var tag = TagMaster[tagId];

        if (tag.flag & pattern.optionalFlags) {
            var tagElement = document.importNode(optionalTagElementOrigin, true);
            fillResultPatternTagElement(tagElement, tagId);
            optionalTagListElement.appendChild(tagElement);
        }
        else if (tag.flag & pattern.essentialFlags) {
            var tagElement = document.importNode(essentialTagElementOrigin, true);
            fillResultPatternTagElement(tagElement, tagId);
            essentialTagListElement.appendChild(tagElement);
        }
    });
}

function fillResultPatternTagElement(tagElement, tagId) {
    var tag = TagMaster[tagId]
    tagElement.innerHTML = tag.name;
    tagElement.dataset.flag = tag.flag;
}

function updateResultArea() {
    var resultAreaElement = document.getElementById("resultArea");
    if (selectedFlags) {
        resultAreaElement.classList.add("filtered");
    }
    else {
        resultAreaElement.classList.remove("filtered");
    }

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
        resultElement.classList.add("matched");
    }
    else {
        resultElement.classList.remove("matched");
    }

    var patternListElement = resultElement.querySelector(".pattern-list");
    if (selectedFlags) {
        patternListElement.classList.add("filtered");
    }
    else {
        patternListElement.classList.remove("filtered");
    }

    Array.from(patternListElement.children).forEach(updateResultPatternElement);
}

function updateResultPatternElement(patternElement) {
    var pattern = PatternMaster[patternElement.dataset.id];

    if (pattern.essentialFlags & selectedFlags) {
        patternElement.classList.add("matched");
    }
    else {
        patternElement.classList.remove("matched");
    }

    var essentialTagListElement = patternElement.querySelector(".tag-list.essential");
    Array.from(essentialTagListElement.children).forEach(updateResultPatternTagElement);

    var optionalTagListElement = patternElement.querySelector(".tag-list:not(.essential)");
    Array.from(optionalTagListElement.children).forEach(updateResultPatternTagElement);
}

function updateResultPatternTagElement(tagElement) {
    if (tagElement.dataset.flag & selectedFlags) {
        tagElement.classList.add("satisfied");
    }
    else {
        tagElement.classList.remove("satisfied");
    }
}

function onTagFilterChanged(tagFilterElement) {
    if (tagFilterElement.value != "") {
        tagFilter = tagFilterElement.value.toLowerCase();
    }
    else {
        tagFilter = null;
    }
    updateTagArea();
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
