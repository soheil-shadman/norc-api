import moment from "moment";

const Sequelize = require('sequelize');

export function isEmptyString(str) {
    if (str == undefined)
        return true;
    if (typeof (str) == 'number')
        return false;
    return str == undefined || str == "undefined" || str == '' || str.replace(' ', '') == '' || str == '?';
}

export function isEmptyStringInArray(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (isEmptyString(arr[i]))
            return true;
    }
    return false;
}
export function getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    return (diff / 60000);
}

export function  generateRandomNumer() {
    return Math.floor(Math.random() * 9).toString()+Math.floor(Math.random() * 9).toString()+Math.floor(Math.random() * 9).toString()+Math.floor(Math.random() * 9).toString()
    
}
export const ICON_404 = '/images/404-image.png';

export function getResizedFileName(filePath, width, height) {
    if (isEmptyString(filePath))
        return filePath;
    let fileName = filePath.substring(0, filePath.indexOf('.'));
    let fileFormat = filePath.substring(filePath.indexOf('.'), filePath.length);
    let file_resize = fileName + `-resize-${width}x${height}` + fileFormat;
    return file_resize;
}

export function replaceAll(target, search, replacement) {
    return target.split(search).join(replacement);
}

export function moment_now() {
    // return moment().format('YYYY-MM-DD hh:mm:ss');
    return moment().format();
}
export function moment_today() {
    // return moment().format('YYYY-MM-DD hh:mm:ss');
    return moment().format(`YYYY-MM-DD`);
}

export function sequlize_now() {
    return Sequelize.fn('NOW');
}

export function isVideo(str) {
    return str.indexOf('.mp4') != -1 || str.indexOf('.avi') != -1 || str.indexOf('.mkv') != -1 || str.indexOf('.webm') != -1;
}

export function randomRange(min = 1000, max = 9999) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

export function setExpireTime(value, type = 'm') {
    return moment(moment_now()).add(value, type).format('YYYY-MM-DD hh:mm:ss');
}

export function setExpireTimeStamp(time) {
    let myDate = new Date();
    myDate.setHours(myDate.getHours() + time);
    let expireTimeStamp = new Date(myDate);
    return expireTimeStamp.getTime();
}

export function findInArray(arr, query = ['key', 'value'], all = false) {
    var result = all ? [] : undefined;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][query[0]] == query[1]) {
            if (!all)
                return arr[i];
            else
                result.push(arr[i]);
        }
    }
    return result;
}

export function findIndexInArray(arr, query = ['key', 'value'], all = false) {
    var result = all ? [] : undefined;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][query[0]] == query[1]) {
            if (!all)
                return i;
            else
                result.push(i);
        }
    }
    return result;
}

/**
 * convert old seal id to new seal id
 */

export function oldSealToNewSeal($seal_id) {
    let new_seal_id = 1;

    switch ($seal_id) {
        case 0:
            new_seal_id = 2;
            break;
        case 1:
            new_seal_id = 1;
            break;
        case 2:
            new_seal_id = 3;
            break;
        case 3:
            new_seal_id = 4;
            break;
        case 4:
            new_seal_id = 6;
            break;
        case 5:
            new_seal_id = 5;
            break;
        case 6:
            new_seal_id = 21;
            break;
        case 7:
            new_seal_id = 7;
            break;
        case 8:
            new_seal_id = 20;
            break;
        case 9:
            new_seal_id = 19;
            break;
        case 10:
            new_seal_id = 9;
            break;
        case 11:
            new_seal_id = 8;
            break;
        case 12:
            new_seal_id = 10;
            break;
        case 13:
            new_seal_id = 11;
            break;
        case 14:
            new_seal_id = 12;
            break;
        case 15:
            new_seal_id = 13;
            break;
        case 16:
            new_seal_id = 14;
            break;
        case 17:
            new_seal_id = 15;
            break;
        case 18:
            new_seal_id = 16;
            break;
        case 19:
            new_seal_id = 17;
            break;
        case 20:
            new_seal_id = 18;
            break;
        default:
            new_seal_id = 1
            break;
    }

    return new_seal_id;
}