// chrome.runtime.onInstalled.addListener(function() {
//     chrome.storage.sync.set({color: '#3aa757'}, function() {
//       console.log("The color is green.");
//     });
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//       chrome.declarativeContent.onPageChanged.addRules([{
//         conditions: [new chrome.declarativeContent.PageStateMatcher({
//           pageUrl: {hostEquals: 'developer.chrome.com'},
//         })
//         ],
//             actions: [new chrome.declarativeContent.ShowPageAction()]
//       }]);
//     });
//   });



// chrome.runtime.onInstalled.addListener(function() {
//   chrome.tabs.create({url: '/index.html'});
// });

console.log("background : we are at the top");

var data_sources = ['screen', 'window', 'audio'],
    desktopMediaRequestId = '';

chrome.runtime.onConnect.addListener(function(port) {
	console.log("ext background : hi friend");
  port.onMessage.addListener(function (msg) {
    console.log('message from NetScreen');
    console.log(msg);

    if(msg.type === 'SS_UI_REQUEST') {
      requestScreenSharing(port, msg);
    }

    if(msg.type === 'SS_UI_CANCEL') {
      cancelScreenSharing(msg);
    }
  });
});

function requestScreenSharing(port, msg) {
  // https://developer.chrome.com/extensions/desktopCapture
  // params:
  //  - 'data_sources' Set of sources that should be shown to the user.
  //  - 'targetTab' Tab for which the stream is created.
  //  - 'streamId' String that can be passed to getUserMedia() API
  desktopMediaRequestId = chrome.desktopCapture.chooseDesktopMedia(data_sources, port.sender.tab, function(streamId) {
    if (streamId) {
      msg.type = 'SS_DIALOG_SUCCESS';
      msg.streamId = streamId;
    } else {
      msg.type = 'SS_DIALOG_CANCEL';
    }
    port.postMessage(msg);
  });
}

function cancelScreenSharing(msg) {
  if (desktopMediaRequestId) {
     chrome.desktopCapture.cancelChooseDesktopMedia(desktopMediaRequestId);
  }
}