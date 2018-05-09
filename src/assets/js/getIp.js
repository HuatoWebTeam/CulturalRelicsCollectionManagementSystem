
// ActionX

// function GetLocalIPAddr () {
//     var oSetting = null, ip = null;
//     try {
//         oSetting = new ActiveXObject('rcbdyctl.Setting');
//         ip = oSetting.GetIPAddress;
//         if(ip.length === 0) {
//             return null;
//         }
//         oSetting = null;
//     } catch (e) {
//         return ip
//     }
//     return ip;
// }

// 获取本地真实ip
export const getIp = (callback) => {
    var ip_dups = {};

    // console.log(GetLocalIPAddr())
    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;
    var mediaConstraints = {
        optional: [{ RtpDataChannels: true }]
    };

    //firefox already has a default stun server in about:config
    //  media.peerconnection.default_iceservers =
    //  [{"url": "stun:stun.services.mozilla.com"}]
    var servers = undefined;

    //add same stun server for chrome
    if (window.webkitRTCPeerConnection)
        servers = { iceServers: [{ urls: "stun:stun.services.mozilla.com" }] };

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    //listen for candidate events
    pc.onicecandidate = function (ice) {

        //skip non-candidate events
        if (ice.candidate) {
            console.log(ice.candidate)
            //match just the IP address
            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
            // var ip_addr = ip_regex.exec(ice.candidate.candidate)[1];
            var ip_addr;
            if (ice.candidate.candidate.match(ip_regex)) {
                console.log('----1------')
                ip_addr = ice.candidate.candidate.match(ip_regex)[1];
            } 
            //remove duplicates
            // console.log(ip_dups)
            // console.log(ip_dups[ip_addr)
            // 原来的
        
            // if (ip_dups[ip_addr] === undefined)
            //     callback(ip_addr);

            // ip_dups[ip_addr] = true;
            // 修改的
            if(ip_addr !== undefined) {
                callback(ip_addr);
                ip_dups[ip_addr] = true;
            }
        }
    };

    //create a bogus data channel
    pc.createDataChannel("");

    //create an offer sdp
    pc.createOffer(function (result) {

        //trigger the stun server request
        pc.setLocalDescription(result).then(() => { })

    }, function () { });
}