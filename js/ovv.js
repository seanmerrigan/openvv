window.OpenVV_OVVID = (function() {

    // 'OVVID' is string substituted from AS
    var id = 'OVVID';
    var beaconsStarted = {};

    function findPlayer() {
        var embeds = document.getElementsByTagName('embed');

        for (var i = 0; i < embeds.length; i++) {
            if (embeds[i][id]) {
                return embeds[i];
            }
        }

        var objs = document.getElementsByTagName('object');

        for (var i = 0; i < objs.length; i++) {
            if (objs[i][id]) {
                return objs[i];
            }
        }

        return null;
    }

    function addSWFs(url) {

        if (url === '' || url === ('BEACON' + '_SWF_' + 'URL')) {
            return;
        }

        var player = findPlayer();

        if (player === null) {
            return;
        }

        var playerLocation = player.getClientRects()[0];
        var BEACON_SIZE = 1;

        for (var index = 1; index <= 5; index++) {
            var left, top;

            switch (index) {
                case 1: // TOP LEFT
                    left = playerLocation.left;
                    top = playerLocation.top;
                    break;

                case 2: // TOP RIGHT
                    left = playerLocation.left + playerLocation.width - BEACON_SIZE;
                    top = playerLocation.top;
                    break;

                case 3: // CENTER
                    left = playerLocation.left + ((playerLocation.width - BEACON_SIZE) / 2);
                    top = playerLocation.top + ((playerLocation.height - BEACON_SIZE) / 2);
                    break;

                case 4: // BOTTOM LEFT
                    left = playerLocation.left;
                    top = playerLocation.top + playerLocation.height - BEACON_SIZE;
                    break;

                case 5: // BOTTOM RIGHT
                    left = playerLocation.left + playerLocation.width - BEACON_SIZE;
                    top = playerLocation.top + playerLocation.height - BEACON_SIZE;
                    break;
            }

            var swfContainer = document.createElement('DIV');
            swfContainer.id = 'OVVBeaconContainer_' + index + '_' + id;
            swfContainer.style.position = 'absolute';
            swfContainer.style.zIndex = 99999;
            swfContainer.style.left = left + 'px';
            swfContainer.style.top = top + 'px';

            var html =
                '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + BEACON_SIZE + '" height="' + BEACON_SIZE + '">' +
                '<param name="movie" value="' + url + '?id=' + id + '&index=' + index + '" />' +
                '<param name="quality" value="low" />' +
                '<param name="bgcolor" value="#ffffff" />' +
                '<param name="wmode" value="transparent" />' +
                '<param name="allowScriptAccess" value="always" />' +
                '<param name="allowFullScreen" value="false" />' +
                '<!--[if !IE]>-->' +
                '<object id="OVVBeacon_' + index + '_' + id + '" type="application/x-shockwave-flash" data="' + url + '?id=' + id + '&index=' + index + '" width="' + BEACON_SIZE + '" height="' + BEACON_SIZE + '">' +
                '<param name="quality" value="low" />' +
                '<param name="bgcolor" value="#ff0000" />' +
                '<param name="wmode" value="transparent" />' +
                '<param name="allowScriptAccess" value="always" />' +
                '<param name="allowFullScreen" value="false" />' +
                '<!--<![endif]-->' +
                '</object>';

            swfContainer.innerHTML = html;
            document.body.insertBefore(swfContainer, document.body.firstChild);
        }
    }

    function isPlayerVisible() {

        if (!isReady()) {
            return false;
        }

        var visible = 0;

        for (var index = 1; index <= 5; index++) {
            if (isOnScreen(getBeacon(index)) && getBeacon(index).isVisible()) {
                visible += 1;
            }
        }

        return visible >= 3;
    }

    function isReady() {
        var ready = 0;

        for (beacon in beaconsStarted) {
            ready += 1;
        }

        return ready === 5;
    }

    function isOnScreen(element) {
        if (element === null) {
            return false;
        }

        var screenWidth = Math.min(document.body.clientWidth, window.innerWidth);
        var screenHeight = Math.min(document.body.clientHeight, window.innerHeight);

        var objRect = element.getClientRects()[0];
        return (objRect.top < screenHeight && objRect.bottom > 0 && objRect.left < screenWidth && objRect.right > 0);
    }

    function getBeacon(index) {
        return document.getElementById('OVVBeacon_' + index + '_' + id);
    }

    function beaconStarted(index) {
        beaconsStarted[index] = true;
    }

    // 'BEACON_SWF_URL' is string substituted from ActionScript
    addSWFs('BEACON_SWF_URL');

    return {
        isPlayerVisible: isPlayerVisible,
        beaconStarted: beaconStarted,
        isReady: isReady
    };

})();