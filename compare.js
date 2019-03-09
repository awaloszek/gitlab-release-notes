module.exports.byVersion = compareByVersion;
module.exports.byDueDate = compareByDueDate;
module.exports.byStartDate = compareByStartDate;
module.exports.byName = compareByName;


function compareByVersionDesc(thisMile, thatMile) {
    const thisParts = thisMile.title.split('.');
    const thatParts = thatMile.title.split('.');

    if (thisParts.length !== 3)
        return -1;
    else if (thatParts.length !== 3)
        return 1;
    else if (parseInt(thisParts[0], 10) < parseInt(thatParts[0], 10))
        return -1;
    else if (parseInt(thisParts[0], 10) > parseInt(thatParts[0], 10))
        return 1;
    else if (parseInt(thisParts[1], 10) < parseInt(thatParts[1], 10))
        return -1;
    else if (parseInt(thisParts[1], 10) > parseInt(thatParts[1], 10))
        return 1;
    else if (parseInt(thisParts[2], 10) < parseInt(thatParts[2], 10))
        return -1;
    else if (parseInt(thisParts[2], 10) > parseInt(thatParts[2], 10))
        return 1;
    return 0;
}

function compareByVersion(direction) {
    return direction === 'asc' ? compareByVersionAsc : compareByVersionDesc;
}

function compareByVersionAsc(thisMile, thatMile) {
    return compareByVersionDesc(thisMile, thatMile) * -1;
}

function compareByName(direction) {
    return direction === 'desc' ? compareByNameDesc : compareByNameAsc;
}

function compareByNameAsc(thisMile, thatMile) {
    return ('' + thisMile.title).localeCompare(thatMile.title);
}

function compareByNameDesc(thisMile, thatMile) {
    return compareByNameAsc(thisMile, thatMile) * -1;
}

function compareByDueDateAsc(thisMile, thatMile) {
    const val = compareByDate(thisMile.due_date, thatMile.due_date);
    return val === 0 ? compareByName(thisMile, thatMile) : val;
}

function compareByDueDateDesc(thisMile, thatMile) {
    return compareByDueDateAsc(thisMile, thatMile) * -1;
}

function compareByDueDate(direction) {
    return direction === 'desc' ? compareByDueDateDesc : compareByDueDateAsc;
}

function compareByStartDateAsc(thisMile, thatMile) {
    const val = compareByDate(thisMile.start_date, thatMile.start_date);
    return val === 0 ? compareByNameAsc(thisMile, thatMile) : val;
}

function compareByStartDateDesc(thisMile, thatMile) {
    return compareByStartDateAsc(thisMile, thatMile) * -1;
}

function compareByStartDate(direction) {
    return direction === 'desc' ? compareByStartDateDesc : compareByStartDateAsc
}

function compareByDate(thisVal, thatVal) {
    const thisDate = Date.parse(thisVal);
    const thatDate = Date.parse(thatVal);

    if (isNaN(thisDate))
        return 1;
    if (isNaN(thatDate))
        return -1;
    return thatDate - thisDate;
}