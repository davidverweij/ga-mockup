var audioCheck = false;
var result = {}; // store all choices made

function arrayMax(arr) { // get the maximal value in an array
  let len = arr.length,
    max = -Infinity;
  while (len--) {
    if (arr[len] > max) max = arr[len];
  }
  return max;
}

function reset() {
  // clear the variable
  result = {};

  // clean the screen
  var elem = document.getElementById("conversation");
  elem.innerHTML = '<div id="bottom_spacer"><p></p></div>';

  // first message
  googleSays(
    "Welcome to this Google Assistant Mockup. Please choose an option",
    "state1",
    ["option 1", "option 2", "option 3", "option 4"]);

}

function userSays(state, choice) {
  // store the interaction
  result[state] = choice;

  // feed back the input
  let html = '<div class="message right m_right"><p>' + choice + '</p></div>';
  addElement('conversation', 'div', 'message_wrap right', html);

  // remove the suggestions
  var elem = document.getElementById("suggestions");
  elem.parentNode.removeChild(elem);

  // determine the next response (a crude if_else tree)
  switch (state) {
    case "state1":
      googleSays(
        "Very well, " + choice + " it is. Which colour do you want?",
        "state2",
        ["Red", "Blue", "Purple", "White","Orange"]);
      break;
    case "state2":
      switch (choice) {
        case "Purple":
          googleSays(
            "I am sorry, " + choice + " is not available. Any other colour you'd like?",
            "state2",
            ["Red", "Blue", "White","Orange"]);
          break;
        default:
          googleSays(
            "Excellent! And how about size?",
            "stateFINAL",
            ["Size 1", "42", "the usual", "surprise me!"]);
          break;
      }
      break;
    case "stateFINAL":

      // show a loading spinner
      let html2 = '<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>';
      addElement('conversation', 'div', 'lds-spinner', html2);
      let elem2 = document.getElementById('bottom_spacer');
      elem2.scrollIntoView();

      // finishe conversation nicely
      let x = setTimeout(finishConversation, 6000);
      break;
    default:
      console.log("Unknown state!");
      break;
  }
}

function finishConversation() {
  // remove the spinner
  var elem = document.getElementsByClassName("lds-spinner");
  elem[0].remove();

  // first reply
  googleSays(
    "Got it! I have ordered a " + result.state2 + " "+ result.state1 + " in a size " + result.stateFINAL + ".",
    "",
    []);

  // second reply and show reset button
  let x = setTimeout(function() {
    // first reply
    googleSays(
      "You should receive the item within 5 working days.",
      "",
      []);
    setTimeout(googleReset, 5000);

    // update the dashboard
    var elem = document.getElementById("result");
    elem.innerHTML = 'User purchased a ' + result.state2 + " "+ result.state1 + " in a size " + result.stateFINAL + ".";
    
  }, 1500);
}

function googleSays(text, state, suggestions) {
  speak(text);
  let html = '<div class="message_wrap left"><div class="message left m_left"><p>' + text + '</p></div></div>';
  if (state !== '') html += "<div id='suggestions'></div>"
  addElement('conversation', 'div', 'message_wrap left', html);
  for (let i = 0; i < suggestions.length; i++) {
    html = '<a onclick="userSays(\'' + state + '\',\'' + suggestions[i] + '\');">' + suggestions[i] + '</a>';
    addElement('suggestions', 'div', 'right button', html);
  }
  let elem2 = document.getElementById('bottom_spacer');
  elem2.scrollIntoView();
}

function googleReset() {
  let html = '<div class="button reset"><a onclick="reset();">Reset Simulator</a></div>';
  addElement('conversation', 'div', 'message_wrap', html);
  let elem2 = document.getElementById('bottom_spacer');
  elem2.scrollIntoView();
}


function speak(text) { //https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
  if ('speechSynthesis' in window && audioCheck) {
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.pitch = 1.5; //0 to 2

    msg.text = text;
    speechSynthesis.speak(msg);

  }
}

function audioChange(checkbox) {
  if (checkbox.checked == true) {
    audioCheck = true;
  } else {
    audioCheck = false;
    speechSynthesis.cancel();
  }
}

function addElement(parentId, elementTag, add_class, html) {
  if (parentId == "conversation") {
    var elem = document.getElementById("bottom_spacer"); //remove spacer bottom,
    elem.parentNode.removeChild(elem);
  }
  // Adds an element to the document

  var p = document.getElementById(parentId);
  var newElement = document.createElement(elementTag);
  let classes = add_class.split(" ");
  for (let i = 0; i < classes.length; i++) {
    newElement.classList.add(classes[i]);
  }
  newElement.innerHTML = html;
  p.appendChild(newElement);

  if (parentId == "conversation") {
    var newElement = document.createElement("div");
    newElement.setAttribute("id", "bottom_spacer");
    newElement.innerHTML = "<p> </p>";
    p.appendChild(newElement);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("audioCheck").checked == true) {
    audioCheck = true;
  } else {
    audioCheck = false;
  }
  reset();
});
