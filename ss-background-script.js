var in_session = false;
var current_session_links = [];
var all_sessions = [];
var current_session = "";

function logURL(requestDetails) {
  if( in_session == true ) {
      current_session_links.push(requestDetails.url);
      console.log("Session links: " + current_session_links);
  }
}

// callback to set() just checks for errors
function onSet() {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    console.log("OK");
  }
}

function gotItem(item) {
    console.log("The item is: " + item);
    console.log("FIRST ITEM: " + item['colour']);
}

function getSessions(sessions) {
    all_sessions = sessions['sessions'];
    console.log("Got the sessions. " + sessions['sessions']);
}

function makeSessionId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

chrome.webRequest.onCompleted.addListener(
  logURL,
  {urls: ["<all_urls>"], types:["main_frame"]}
);


function openPage() {
  in_session = !in_session;
  if( in_session == true ) {
      console.log("We would start the session here.");
  }
  else {
      console.log("We would end the session here.");
  }
}

function changeSession(message,sender,func) {
    if( in_session == false ) {
        console.log("We got a message and we are starting a session."); 
        chrome.storage.local.get('sessions',getSessions);
        current_session = makeSessionId();
        all_sessions.push(current_session);
        chrome.storage.local.set({
            sessions: all_sessions
        }, onSet);
        chrome.storage.local.get('colour',gotItem);
        in_session = true;
    } else {
        console.log("Ending a session");
        in_session = false;
        chrome.storage.local.set({
            colour: current_session_links
        }, onSet);
        current_session_links = [];
    }
}

chrome.browserAction.onClicked.addListener(openPage);
chrome.runtime.onMessage.addListener(changeSession);
