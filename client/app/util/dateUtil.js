export default {
    fullDateFormat: 'YYYY-MM-DD HH:mm:ss',
    shortDateFormat: 'YYYY-MM-DD',

    parse: function (value) {
        if (!value) {
            return null;
        }
        value = value.toString();

        return new Date(Number(value.substr(0, 4)),
            Number(value.substr(4, 2)) - 1,
            Number(value.substr(6, 2)),
            Number(value.substr(8, 2)),
            Number(value.substr(10, 2)),
            Number(value.substr(12, 2))
        )
    },

    toString: function (date, format) {
        if (date === undefined || typeof date !== 'object' || date === null) {
            return '-';
        }
        let returnValue = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();
        if (format === true) {
            returnValue += "  " + this.getFullTime(date);
        }
        return returnValue;
    },

    getShortMonthName: function (date) {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return (months[date.getMonth()].substr(0, 3));
    },

    formatAMPM: function (date) {
        if (date === undefined || typeof date !== 'object' || date === null) {
            return '';
        }
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ampm;
        return strTime;
    },

    getUtDateTime: function (date) {
        var dateToConvert = new Date();
        if (date) {
            dateToConvert = new Date(date);
        }
        return dateToConvert.toISOString().slice(0, 19).replace('T', ' ');
    },

    getLocalDateTime: function (utcDate) {
        if (!utcDate) {
            return;
        }
        var d = new Date(utcDate);
        var offset = new Date().getTimezoneOffset();
        d.setMinutes(d.getMinutes() - offset);
        return d;
    },
    
    getFullTime(date) {
        if (!date)
            return
        return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    },

    getTimeDiff(firstDate, secondDate) {
        var timeStart = new Date(firstDate).getTime();
        var timeEnd = new Date(secondDate).getTime();
        var hourDiff = timeEnd - timeStart; //in ms
        var secDiff = hourDiff / 1000; //in s
        return (secDiff + " Secs");
        //TODO - In Future if we need to show the time in hours and mins.
        // var minDiff = hourDiff / 60 / 1000; //in minutes
        // var hDiff = hourDiff / 3600 / 1000; //in hours
        // var humanReadable = {};
        // debugger
        // humanReadable.hours = Math.floor(hDiff);
        // humanReadable.minutes = minDiff - 60 * humanReadable.hours;
        // humanReadable.seconds = secDiff - minDiff * 60;

    },
    
    formateSecond(totalSeconds, isMinutes) {
        if (!totalSeconds) {
            return "0s";
        }
        totalSeconds = isMinutes ? (totalSeconds * 60) : totalSeconds;
        var month = Math.floor(totalSeconds / 2419200);
        totalSeconds %= 2419200;
        var week = Math.floor(totalSeconds / 604800);
        totalSeconds %= 604800;
        var day = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        var hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        return (
            (month ? month + 'mth ' : '') +
            (week ? week + 'w ' : '') +
            (day ? day + 'd ' : '') +
            (hours ? hours + 'h ' : '') +
            (minutes ? minutes + 'm ' : '') +
            (month != 0 || week != 0 || day != 0 || hours != 0 || minutes != 0 ? (seconds ? seconds + 's' : '') : seconds + 's')
        )
    }
}