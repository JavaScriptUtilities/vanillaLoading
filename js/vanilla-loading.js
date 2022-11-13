/*
 * Plugin Name: Vanilla-JS Loading
 * Version: 0.6.0
 * Plugin URL: https://github.com/JavaScriptUtilities/vanillaLoading
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

var vanillaLoading = function(assets, settings) {
    'use strict';
    var self = this,
        _assetsCount = 0,
        _currentPercent = 0,
        _assetsToDownload = 999,
        _assetPercent = 100,
        _assets = [];

    /* FILTER SETTINGS */

    if (typeof settings !== 'object') {
        settings = {};
    }
    if (!settings.callBackPercent) {
        settings.callBackPercent = function(_percent) {
            console.log(_percent);
        };
    }
    if (!settings.finalCallback) {
        settings.finalCallback = function() {
            console.log('final');
        };
    }

    /* METHODS */

    self.callBackDownloadedAsset = function(response, url, callback, arg1) {
        _assetsToDownload--;
        _currentPercent += _assetPercent;
        if (_assetsToDownload < 1) {
            _currentPercent = 100;
            settings.finalCallback();
        }
        else {
            settings.callBackPercent(_currentPercent);
        }
        if (typeof callback == 'string') {
            window[callback](response, url, arg1);
        }
        if (typeof callback == 'function') {
            callback.call(response, url, arg1);
        }
    };

    self.downloadAsset = function(url, timeout, callback, arg1) {
        if (url.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
            return self.downloadAssetImage(url, timeout, callback, arg1);
        }
        else {
            return self.downloadAssetDefault(url, timeout, callback, arg1);
        }
    };

    /* Download via AJAX */
    self.downloadAssetDefault = function(url, timeout, callback, arg1) {
        var _isLoaded = false;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                if (_isLoaded) {
                    return;
                }
                _isLoaded = true;
                self.callBackDownloadedAsset(xhr.response, url, callback, arg1);
            }
        };

        if (timeout) {
            setTimeout(function() {
                if (_isLoaded) {
                    return;
                }
                _isLoaded = true;
                self.callBackDownloadedAsset(false, url, callback, arg1);
            }, timeout);
        }
        xhr.open("GET", url, true);
        xhr.send(null);
    };

    /* Download via image creation */
    self.downloadAssetImage = function(url, timeout, callback, arg1) {
        var _isLoaded = false;
        var _img = new Image();
        _img.onload = function() {
            if (_isLoaded) {
                return;
            }
            _isLoaded = true;
            self.callBackDownloadedAsset(false, url, callback, arg1);
        };
        if (timeout) {
            setTimeout(function() {
                if (_isLoaded) {
                    return;
                }
                _isLoaded = true;
                self.callBackDownloadedAsset(false, url, callback, arg1);
            }, timeout);
        }
        _img.src = url;
    };

    /* Prepare asset loading  */
    (function() {
        var _winWidth = window.innerWidth;
        /* Filter valid assets */
        if (typeof assets !== 'object') {
            console.log('Assets is not a valid object');
            return false;
        }
        /* Isolate every correct asset */
        for (var i = 0, tmpLen = assets.length; i < tmpLen; i++) {
            if (!assets[i] || typeof assets[i] !== 'object' || !assets[i].url) {
                continue;
            }
            /* Check screen width requirements */
            if (!assets[i].minScreenWidth) {
                assets[i].minScreenWidth = 0;
            }
            if (!assets[i].maxScreenWidth) {
                assets[i].maxScreenWidth = 99999;
            }
            if (_winWidth < assets[i].minScreenWidth || _winWidth > assets[i].maxScreenWidth) {
                continue;
            }
            /* Add this asset to the list */
            _assets.push(assets[i]);
        }
        /* Kill if no asset is valid */
        if (_assets.length < 1) {
            console.log('None of the specified assets are valid');
            return false;
        }

        /* Update vars */
        _assetsCount = _assets.length;
        _assetsToDownload = _assetsCount;
        _assetPercent = 100 / _assetsCount;
        var _tmpCallback,
            _timeout,
            _tmpArg1;

        /* Trigger download */
        for (var y = 0, len = _assets.length; y < len; y++) {
            _tmpCallback = _assets[y].callback || [];
            _timeout = _assets[y].timeout || 0;
            _tmpArg1 = _assets[y].arg1 || [];
            self.downloadAsset(_assets[y].url, _timeout, _tmpCallback, _tmpArg1);
        }
    }());

    return self;
};
