//simple resource loader
(function () {
    var resourceCache: Record<string, HTMLImageElement | false> = {};
    var loading = [];
    var readyCallbacks: (() => void)[] = [];

    // Load an image url or an array of image urls
    function load(urlOrArr: string | string[]) {
        if (urlOrArr instanceof Array) {
            urlOrArr.forEach(function (url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url: string) {
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
            img.src = url;
        }
    }

    function get(url: string) {
        return resourceCache[url] as HTMLImageElement;
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

    function onReady(func: () => void) {
        readyCallbacks.push(func);
    }

    window["resources"] = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();
