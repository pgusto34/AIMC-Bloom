import { wait_time_ms, test_type, speed } from "./constants.js";
let message = document.getElementById('messagebox');
let tone = document.getElementById('tonebox');
let toneInput = document.getElementById('tone_input');
let timeout  = setTimeout(function(){}, 0)

/**
 * Take a string append it character by character to the tmp textbox. Put the
 * cursor at the very end of the tmp textbox afterward.
 *
 * @param {String} txt - the text the function will add to the tmp textbox
 */
function typeWriter(txt) {
  message.contentEditable = false;
  for (let i = 0; i < txt.length; i++ ) {
    setTimeout( function () {
      let tmp_text = document.getElementById('tmp_text');
      tmp_text.textContent += txt.charAt(i);
    },speed * i);
  }
  setTimeout(() => {
    message.contentEditable = true;
    message.focus();
    placeCaretAtEnd(message);
  }, 1000);

}

/**
 * a key event to
 * 1) check when the user has stop typing, and call the API after to get
 * autocomplete text.
 * 2) check if the key pressed was Tab to turn the autocomplete text to actual
 * text (visual change)
 * 3) Add back the tmp text node element if it get deleted by the backspace or
 * delete default event.
 */
message.addEventListener('keydown', function(e){
  if (e.key.length === 1) {
    clearTimeout(timeout);
    console.log('User is typing')
    timeout = setTimeout(function() {
      //TODO: Call API and passed the vlaue and message as body.
      console.log(tone.value);
      console.log(toneInput.value);
      console.log(message.textContent);
      //TODO: typeWriter will be call once backend return a content.
      typeWriter(test_type);
      console.log('User is not typing');
      }, wait_time_ms)
  } else if (e.key === 'Tab') {
    e.preventDefault();
    e.stopPropagation();
    let newText = tmp_text.textContent;
    tmp_text.textContent = '';
    message.textContent += newText;
    message.innerHTML += `<span id="tmp_text"></span>`;
  } else if (e.key === "Backspace" || e.key === "Delete") {
    let tmp_text = document.getElementById('tmp_text');
    if(!tmp_text) {
      message.innerHTML += `<span id="tmp_text"></span>`;
    }
  }
  message.focus();
  placeCaretAtEnd(message);
})

// Gonna be honest, no idea how this work. Just stole it.
// https://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser/4238971#4238971
function placeCaretAtEnd(el) {
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