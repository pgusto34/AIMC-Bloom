import { wait_time_ms, test_type, TEXT_TRANSFORM_PATH, AUTOCOMPLETE_PATH, speed_fast, speed_normal, speed_slow } from "./constants.js";
let message = document.getElementById('messagebox');
let tone = document.getElementById('tonebox');
// const istyping = document.getElementById('istyping')
let timeout = setTimeout(function () { }, 0)

// the outputbox is the output in the index.html file
let output = document.getElementById('outputbox')

// Click on the button "submit". When that happens, make an API call to the text-transform route, and submit the output of the API call into the result textbox div.
const submitButton = document.getElementById('submit-tone')
const resetButton = document.getElementById('reset')
const autocompleteView = document.getElementById('autocomplete-view')
const transformView = document.getElementById('transform-view')
const autocompleteViewButton = document.getElementById('autocomplete-view-btn')
const transformViewButton = document.getElementById('transform-view-btn')

async function submitTone() {
  //TODO: Call API and passed the value and message as body. (/text-transform)
  let data = new FormData()
  data.append("text", message.textContent)
  data.append("tone", tone.value)
  let transformResponse = await fetch(TEXT_TRANSFORM_PATH, { method: "POST", body: data })
  let transformText = await transformResponse.text()
  console.log(transformText)
  const desiredOutput = tone.value + ": " + transformText

  return output.innerHTML = desiredOutput
}

function reset() {
  output.innerHTML = " "
}

// Code to switch views from https://stackoverflow.com/questions/25981198/how-to-hide-one-div-and-show-another-div-using-button-onclick
function switchView() {
  let autocompleteView = document.getElementById('autocomplete-view')
  let transformView = document.getElementById('transform-view')

  if (transformView !== undefined) {
    if (autocompleteView.style.display == 'none') {
      transformView.style.display = 'none'
      autocompleteView.style.display = 'block'
    } else {
      transformView.style.display = 'block'
      autocompleteView.style.display = 'none'
    }
  }
}


// Gonna be honest, no idea how this work. Just stole it.
// https://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser/4238971#4238971
function placeCaretAtEnd(el) {
  if (autocompleteView === undefined || autocompleteView === 'none') return
  el.focus();
  if (typeof window.getSelection != "undefined"
    && typeof document.createRange != "undefined") {
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
}

/**
 * Take a string append it character by character to the tmp textbox. Put the
 * cursor at the very end of the tmp textbox afterward.
 *
 * @param {String} txt - the text the function will add to the tmp textbox
 */
function typeWriter(txt) {
  console.log("entering typewriter")
  if (autocompleteView === undefined || autocompleteView === 'none') return;
  console.log("")
  message.contentEditable = false;
  for (let i = 0; i < txt.length; i++) {
    setTimeout(function () {
      let tmp_text = document.getElementById('tmp_text');
      tmp_text.textContent += txt.charAt(i);
    }, speed * i);
  }
  setTimeout(() => {
    message.contentEditable = true;
    message.focus();
    placeCaretAtEnd(message);
    autocompleteText = '';
    console.log("autocomplete text reset")
  }, speed * txt.length);
}

message.addEventListener('keydown', (e) => {
  console.log("Entering autocomplete")
  if (autocompleteView === undefined || autocompleteView === 'none') return
  console.log()
  if (e.key.length === 1) {
    clearTimeout(timeout);
    console.log('User is typing')
    timeout = setTimeout(async function () {
      //TODO: Call API and passed the vlaue and message as body.
      let data = new FormData()
      data.append("text", message.textContent)
      data.append("tone", tone.value)

      let autocompleteResponse = await fetch(AUTOCOMPLETE_PATH, { method: "POST", body: data })
      let autocompleteText = await autocompleteResponse.text()
      
      //TODO: typeWriter will be call once backend return a content.
      typeWriter(autocompleteText);
      console.log('User is not typing');
    }, wait_time_ms)
  } else if (e.key === 'Tab') {
    e.preventDefault();
    e.stopPropagation();
    let tmp_text = document.getElementById('tmp_text');
    let tmp = tmp_text.textContent;
    tmp_text.textContent = '';
    message.textContent += tmp;
    message.innerHTML += `<span id="tmp_text"></span>`;
  } else if (e.key === "Backspace" || e.key === "Delete") {
    let tmp_text = document.getElementById('tmp_text');
    if (!tmp_text) {
      message.innerHTML += `<span id="tmp_text"></span>`;
    }
  }
  message.focus();
  placeCaretAtEnd(message);
})

submitButton.addEventListener("click", (e) => {
  if (e) {
    submitTone()
  }
})

resetButton.addEventListener("click", (e) => {
  if (e) {
    reset()
  }
})

autocompleteViewButton.addEventListener("click", (e) => {
  if (e) {
    switchView()
  }
})

transformViewButton.addEventListener("click", (e) => {
  if (e) {
    switchView()
  }
})