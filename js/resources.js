//simple resource loader
(function () {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];
    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if (urlOrArr instanceof Array) {
            urlOrArr.forEach(function (url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }
    function _load(url) {
        if (resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function () {
                resourceCache[url] = img;
                if (isReady()) {
                    readyCallbacks.forEach(function (func) { func(); });
                }
            };
            resourceCache[url] = false;
            // toDataUrl(url, (data: any) => {
            //     img.src = data;
            // })
            img.src = url;
            //img.crossOrigin = "Anonymous"
            //img.setAttribute('crossOrigin', '');
        }
    }
    // helper to transform to base64
    // see other question for more help
    function toDataUrl(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    }
    function get(url) {
        return resourceCache[url];
    }
    function isReady() {
        var ready = true;
        for (var k in resourceCache) {
            if (resourceCache.hasOwnProperty(k) &&
                !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }
    function onReady(func) {
        readyCallbacks.push(func);
    }
    window["resources"] = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();
