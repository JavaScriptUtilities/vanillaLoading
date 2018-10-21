/*
 * Plugin Name: Vanilla-JS Loading
 * Version: 0.2.0
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

    self.callBackDownloadedAsset = function() {
        _assetsToDownload--;
        _currentPercent += _assetPercent;
        if (_assetsToDownload < 1) {
            _currentPercent = 100;
            settings.finalCallback();
        }
        else {
            settings.callBackPercent(_currentPercent);
        }
    };

    self.downloadAsset = function(url) {
        if (url.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
            return self.downloadAssetImage(url);
        }
        else {
            return self.downloadAssetDefault(url);
        }
    };

    /* Download via AJAX */
    self.downloadAssetDefault = function(url) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                self.callBackDownloadedAsset();
            }
        };
        xhr.open("GET", url, true);
        xhr.send(null);
    };

    /* Download via image creation */
    self.downloadAssetImage = function(url) {
        var _img = new Image();
        _img.onload = self.callBackDownloadedAsset;
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

        /* Trigger download */
        for (var y = 0, len = _assets.length; y < len; y++) {
            self.downloadAsset(_assets[y].url);
        }
    }());

    return self;
};
