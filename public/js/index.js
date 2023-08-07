import { wait_time_ms, test_type, TEXT_TRANSFORM_PATH, AUTOCOMPLETE_PATH, speed_fast, speed_normal, speed_slow } from "./constants.js";
let message = document.getElementById('messagebox');
let toneBox = document.getElementById('tonebox');
let toneInput = document.getElementById('tone_input');

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
const redoButton = document.getElementById('redo-button')

async function submitTone() {
  //TODO: Call API and passed the value and message as body. (/text-transform)
  let data = new FormData()
  data.append("text", message.textContent)
  if(toneInput.value !== '') {
    data.append("tone", toneInput.value)
  } else {
    data.append("tone", toneBox.value)
  }
  let transformResponse = await fetch(TEXT_TRANSFORM_PATH, {method: "POST", body: data})
  let transformText = await transformResponse.text()
  console.log(transformText)
  const desiredOutput = transformText
  outputTypewriter(desiredOutput)
}

function reset() {
  message.textContent = '';
  message.innerHTML += `<span id="tmp_text"></span>`;
  outputTimeoutArray.forEach((e) => {
    clearTimeout(e)
  })
  autocompleteTimeoutArray.forEach((e) => {
    clearTimeout(e)
  })
  output.textContent = '';
  toneInput.value = '';
  toneBox.value = 'formal';
  message.contentEditable = true;
  message.focus();
  placeCaretAtEnd(message);
  autocompleteText = '';
  resetButton.disabled = false;
}

// Code to switch views from https://stackoverflow.com/questions/25981198/how-to-hide-one-div-and-show-another-div-using-button-onclick
function switchView() {
  let autocompleteView = document.getElementById('autocomplete-view')
  let transformView = document.getElementById('transform-view')
  if (transformView !== undefined) {
    if (autocompleteView.style.display === 'none' || autocompleteView.style.display === '') {
      transformView.style.display = 'none'
      autocompleteView.style.display = 'block'
      message.addEventListener('keydown', autocomplete);
    } else {
      transformView.style.display = 'block'
      autocompleteView.style.display = 'none'
      message.removeEventListener('keydown', autocomplete);
    }
  }
  reset();
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

let autocompleteTimeoutArray = []
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
  redoButton.disabled = true;
  let speed = 0;
  if (txt.length > 150) {
    speed = speed_fast;
  } else if (txt.length > 75) {
    speed = speed_normal;
  } else {
    speed = speed_slow;
  };
  for (let i = 0; i < txt.length; i++ ) {
    autocompleteTimeoutArray[i] = setTimeout( function () {
      let tmp_text = document.getElementById('tmp_text');
      tmp_text.textContent += txt.charAt(i);
    },speed * i);
  }
  autocompleteTimeoutArray[txt.length] = setTimeout(() => {
    message.contentEditable = true;
    redoButton.disabled = false;
    message.focus();
    placeCaretAtEnd(message);
    autocompleteText = '';
    console.log("autocomplete text reset")
  }, speed * txt.length);
  return autocompleteTimeoutArray[txt.length];
}

let autocompleteText = '';


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

function autocomplete(e) {
  console.log("Entering autocomplete")
  if (autocompleteView === undefined || autocompleteView === 'none') return
  console.log()
  if (e.key.length === 1) {
    clearTimeout(timeout);
    console.log('User is typing')
    timeout = setTimeout(async function() {
      autocompeteHelper();
      console.log('User is not typing');
      console.log(autocompleteText.length);
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
    console.log(tmp_text === null)
    if(tmp_text === null) {
      e.preventDefault();
      message.innerHTML += `<span id="tmp_text"></span>`;
    } else if (tmp_text.textContent !== '') {
      clearTimeout(timeout);
      e.preventDefault();
      e.stopPropagation();
      tmp_text.textContent = '';
      timeout = setTimeout(async function() {
        if (message.textContent !== '') {
          autocompeteHelper();
        }
        console.log('User is not typing');
        console.log(autocompleteText.length);
        }, wait_time_ms)
    } else if (tmp_text.textContent === '' && message.textContent === '') {
      e.preventDefault();
    }
  } else {
    clearTimeout(timeout)
  }
  message.focus();
  placeCaretAtEnd(message);
}

redoButton.addEventListener('click', async (e) => {
  let tmp_text = document.getElementById('tmp_text');
  redoButton.disabled = true;
  if (tmp_text.textContent !== '' && autocompleteText.length === 0 ) {
    tmp_text.textContent = '';
    autocompeteHelper();
    console.log(redoButton.disabled)
  } else {
    setTimeout(() => {redoButton.disabled = false}, 5000);
    redoButton.disabled = false;
    console.log("redo was not call")
  }
})

async function autocompeteHelper() {
  let tmp_text = document.getElementById('tmp_text');
  if (autocompleteText.length === 0 && tmp_text.textContent.length === 0) {
    //TODO: Call API and passed the vlaue and message as body.
    let data = new FormData()
    data.append("text", message.textContent)
    if(toneInput.value !== '') {
      data.append("tone", toneInput.value)
    } else {
      data.append("tone", toneBox.value)
    }
    let autocompleteResponse = await fetch(AUTOCOMPLETE_PATH, {method: "POST", body: data})
    autocompleteText = await autocompleteResponse.text()
    console.log(autocompleteText)
    //TODO: typeWriter will be call once backend return a content.
    typeWriter(autocompleteText);
  }
}
let outputTimeoutArray = [];
function outputTypewriter(txt) {
  if (!resetButton.disabled) {
    resetButton.disabled = true;
    let speed = 0;
    output.textContent = '';
    if (txt.length > 150) {
      speed = speed_fast;
    } else if (txt.length > 75) {
      speed = speed_normal;
    } else {
      speed = speed_slow;
    };
    for (let i = 0; i < txt.length; i++ ) {
      outputTimeoutArray[i] = setTimeout( function () {
        output.textContent += txt.charAt(i);
      },speed * i);
    }
    setTimeout(() => {
      resetButton.disabled = false;
    }, speed * txt.length);
  }
}