import moment from 'moment';
var qs = require('qs');

module.exports = {
    /**
     * isArray
     *
     * @param mixed input
     * @return bol
     */
    is_array(obj) {
        if (obj.constructor.toString().indexOf('Array') == -1) {
            return false;
        }
        return true;
    },
    /**
     * stripHTML
     *
     * @param mixed input
     * @parm mixed output
     */
    stripHTML(html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    },
    tryParseJSON(jsonString) {
        try {
            var obj = JSON.parse(jsonString);
            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns null, and typeof null === "object", 
            // so we must check for that, too. Thankfully, null is falsey, so this suffices:
            if (obj && typeof obj === "object") {
                return obj;
            }
        }
        catch (e) { }

        return false;
    },
    getIframeUrl(screen) {
        var url = '';

        var moodleData = this.tryParseJSON(localStorage.moodleData);
        if (moodleData) {
            var moodleInfo = moodleData.find(x => x.Name == screen);
            if (moodleInfo) {
                url = moodleInfo.Url;
            }
        }

        return url;
    },

    getFormData(data) {
        var formData = new FormData();
        Object.keys(data).forEach(function (key) {
            formData.append(key, data[key]);
        })
        return formData;
    },

    postError(data) {
        fetch("http://exceptionbrowser.durlabhcomputers.com/ExceptionHandler.ashx?MachineName=TracOn&DateTime=" + moment().format('MM/DD/YYYY hh:mm:ss a') + "&DateTimeUTC=" + moment.utc().format('MM/DD/YYYY hh:mm:ss a'), {
            method: 'POST',
            body: this.getFormData(data)
        })
            .then((response) => response.text())
            .then((responsetext) => {
                console.log(responsetext)
            })
            .catch((error) => {
                console.error(error);
            });
    },
    mobileAndTabletcheck() {
        var check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;

    },

    getImageSrc(src) {
        if (!window.cordova || !window.cordova.file) {
            return src;
        }

        var path = cordova.file.applicationDirectory + 'www/' + src;
        console.log(path);
        return path;
    },
    loginMoodle(username, password, loginUrl) {
        var data = {};
        data.username = username;
        data.password = password;
        var params = qs.stringify(data);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open('POST', loginUrl, true);

        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function () {
            var responseText = xhr.responseText;
            var sess = responseText.substring(responseText.indexOf('sesskey'), responseText.indexOf('sesskey') + 20)
            var moodleSessKey = sess.split('":"');
            if (moodleSessKey && moodleSessKey.length > 0) {
                localStorage.setItem(moodleSessKey[0], moodleSessKey[1]);//sesskey
            }
        };
        xhr.send(params);
    },
    logOutMoodle() {
        if (localStorage.moodleData) {
            var moodleData = JSON.parse(localStorage.moodleData);
            if (moodleData) {
                var moodleInfo = moodleData.find(x => x.Name == 'logout');
                if (moodleInfo && moodleInfo.Url) {
                    var iframeURL = moodleInfo.Url;

                    var xhr = new XMLHttpRequest();
                    xhr.withCredentials = true;
                    xhr.open('POST', iframeURL, true);
                    xhr.onload = function (res) {
                        //TODO if needed
                    };
                    xhr.send();
                }
            }
        }
    }
};