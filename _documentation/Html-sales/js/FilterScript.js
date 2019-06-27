$(document).ready(function() {
    $("div#box1Group input[name='filter']").keyup(function() {
        Filter('box1Group', $(this).val());
    });
    $("div#box2Group input[name='filter']").keyup(function() {
        Filter('box2Group', $(this).val());
    });
    $("div#box1Group button[name='clear']").click(function() {
        ClearFilter('box1Group');
    });
    $("div#box2Group button[name='clear']").click(function() {
        ClearFilter('box2Group');
    });
    $("div#box1Group select[name='view']").dblclick(function() {
        MoveSelected('box1Group', 'box2Group');
    });
    $("div#box2Group select[name='view']").dblclick(function() {
        MoveSelected('box2Group', 'box1Group');
    });
    $("button#to2").click(function() {
        MoveSelected('box1Group', 'box2Group');
    });
    $("button#allTo2").click(function() {
        MoveAll('box1Group', 'box2Group');
    });
    $("button#allTo1").click(function() {
        MoveAll('box2Group', 'box1Group');
    });
    $("button#to1").click(function() {
        MoveSelected('box2Group', 'box1Group');
    });
    $("div#box1Group span.countLabel").text('Showing ' + $("div#box1Group select[name='view']").children().length + ' of ' + $("div#box1Group select[name='storage']").children().length);
    $("div#box2Group span.countLabel").text('Showing ' + $("div#box2Group select[name='view']").children().length + ' of ' + $("div#box2Group select[name='storage']").children().length);
});


function Filter(toGroupID, filter) {
    var $toFilter = $("div#" + toGroupID + " select[name='view']");
    var $toFilterStorage = $("div#" + toGroupID + " select[name='storage']");
    var $toFilterLabel = $("div#" + toGroupID + " span[class='countLabel']");

    $toFilter.empty();

    $toFilterStorage.children().filter(function(i) {
        var toMatch = $(this).text().toString().toLowerCase();
        var filterLower = filter.toString().toLowerCase();
        return toMatch.indexOf(filterLower) != -1;
    }).each(function(i) {
        $toFilter.append('<option value="' + this.value + '">' + this.text + '</option>');
    });
    $toFilterLabel.text('Showing ' + $toFilter.children().length + ' of ' + $toFilterStorage.children().length);
}

function SortOptions(toSortGroupID) {
    var $toSort = $("div#" + toSortGroupID + " select[name='storage']");
    var $toSortOptions = $toSort.children();
    $toSortOptions.sort(function(a, b) {
        var aVal = a.text.toLowerCase();
        var bVal = b.text.toLowerCase();
        if (aVal < bVal) { return -1; }
        if (aVal > bVal) { return 1; }
        return 0;
    });
    $toSort.empty();
    $toSortOptions.each(function() {
        $toSort.append('<option value="' + this.value + '">' + this.text + '</option>');
    });
}

function MoveSelected(fromGroupID, toGroupID) {
    //declare variables
    var $fromBox = $("div#" + fromGroupID + " select[name='view']");
    var $toBoxStorage = $("div#" + toGroupID + " select[name='storage']");
    var $fromBoxStorage = $("div#" + fromGroupID + " select[name='storage']");
    var toBoxFilterText = $("div#" + toGroupID + " input[name='filter']").val();
    var fromBoxFilterText = $("div#" + fromGroupID + " input[name='filter']").val();

    $fromBox.children().filter(function() {
        return this.selected;
    }).each(function() {
        var myVal = this.value;
        $toBoxStorage.append('<option value="' + this.value + '">' + this.text + '</option>');
        $fromBoxStorage.children().filter(function() {
            return this.value == myVal;
        }).remove();
    });

    SortOptions(toGroupID);

    Filter(toGroupID, toBoxFilterText);
    Filter(fromGroupID, fromBoxFilterText);
}
function MoveAll(fromGroupID, toGroupID) {
    var $fromBox = $("div#" + fromGroupID + " select[name='view']");

    $fromBox.children().each(function() {
        this.selected = true;
    });

    MoveSelected(fromGroupID, toGroupID);
}

function ClearFilter(toClearGroupID) {
    var $toClearFilter = $("div#" + toClearGroupID + " input[name='filter']");
    $toClearFilter.val("");
    Filter(toClearGroupID, "");
}