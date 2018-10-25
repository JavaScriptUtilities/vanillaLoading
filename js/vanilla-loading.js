/*
 * Plugin Name: Vanilla-JS Loading
 * Version: 0.3.0
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

    self.downloadAsset = function(url, callback, arg1) {
        if (url.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
            return self.downloadAssetImage(url, callback, arg1);
        }
        else {
            return self.downloadAssetDefault(url, callback, arg1);
        }
    };

    /* Download via AJAX */
    self.downloadAssetDefault = function(url, callback, arg1) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                self.callBackDownloadedAsset(xhr.response, url, callback, arg1);
            }
        };
        xhr.open("GET", url, true);
        xhr.send(null);
    };

    /* Download via image creation */
    self.downloadAssetImage = function(url, callback, arg1) {
        var _img = new Image();
        _img.onload = function() {
            self.callBackDownloadedAsset(false, url, callback, arg1);
        };
        _img.src = url;
    };

    /* ASSETS */
    (function() {
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
            _tmpArg1;

        /* Trigger download */
        for (var y = 0, len = _assets.length; y < len; y++) {
            _tmpCallback = _assets[y].callback || [];
            _tmpArg1 = _assets[y].arg1 || [];
            self.downloadAsset(_assets[y].url, _tmpCallback, _tmpArg1);
        }
    }());

    return self;
};
