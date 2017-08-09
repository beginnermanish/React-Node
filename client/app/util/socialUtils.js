const Twitter = require('twitter-node-client').Twitter;
export default {

    getFeed(typeId, url, options) {

    },
    facebook(options) {
        var fields = '?fields=id,name,picture,link,posts.limit(3){full_picture,message,created_time,likes{link,name,pic_square},comments{comment_count,from,message,created_time,is_hidden,message_tags}}';
        var request_url,
            limit = '&limit=' + options.limit,
            query_extention = '&access_token=' + options.access_token;
        request_url = options.url + fields + limit + query_extention;

        fetch(request_url, {
            method: 'GET',
            mode: 'CORS'
        }).then(response => {
            if (response.status === 200) {
                response.text().then(function (text) {
                    var data = JSON.parse(text);
                    options.callBack(data);
                });
            } else {
            }
        }).catch(function (err) {
        });
    },
    twitter(options) {
        var formData = new FormData();
        formData.append('clientName', 'twitter');
        formData.append('screenName', 'steris');

        fetch(options.url, {
            method: 'POST',
            body: formData,
            credentials: 'include',
            mode: 'CORS'
        }).then(response => {
            if (response.status === 200) {
                response.text().then(function (text) {
                    options.success(JSON.parse(text));
                });
            }
            else {
                options.failure(response);
            }
        }).catch(function (err) {
            options.failure(err);
        });
    },

    toString: function (date, format) {
        date = new Date(date);
        let returnValue = (date.getMonth() + 1) + '.' + date.getDate() + '.' + date.getFullYear();
        return returnValue;
    },

    dateTimeForBlogs: function (date) {
        var timeStr = date;
        var date = new Date(timeStr);
        var time = date.getHours();
        var day = date.getDay();
        var minutes = date.getMinutes();
        var ampm = time >= 12 ? 'pm' : 'am';
        var mm = date.getMinutes();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var dayames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
            "Saturday"
        ];
        let dateTimeYear = (date.getMonth() + 1) + '.' + date.getDate() + '.' + date.getFullYear();
        let returnValue = (dayames[day] + " " + time + ":" + mm + " " + ampm + " - " + dateTimeYear);
        return returnValue;
    }
};