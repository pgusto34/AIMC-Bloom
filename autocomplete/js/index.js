import { wait_time_ms, test_type, speed } from "./constants.js";
let message = document.getElementById('messagebox');
let tone = document.getElementById('tonebox');
// const istyping = document.getElementById('istyping')
let timeout  = setTimeout(function(){}, 0)

function typeWriter(txt) {
  for (let i = 0; i < txt.length; i++ ) {
    setTimeout( function () {
      let tmp_text = document.getElementById('tmp_text')
      tmp_text.textContent += txt.charAt(i)
    },50 * i)
  }
}

message.addEventListener('keydown', function(e){
  if (e.key.length === 1) {
    clearTimeout(timeout);
    // istyping.innerHTML = 'User is typing'
    console.log('User is typing')
    timeout = setTimeout(function() {
      //TODO: Call API and passed the vlaue and message as body.
      console.log(tone.value)
      console.log(message.textContent)
      //TODO: typeWriter will be call once backend return a content.
      typeWriter(test_type)
      console.log('User is not typing')
      }, wait_time_ms)
  } else if (e.key === 'Tab') {
    e.preventDefault();
    e.stopPropagation();
    let newText = tmp_text.textContent;
    tmp_text.textContent = '';
    message.textContent += newText;
    message.innerHTML += `<span id="tmp_text"></span>`
    message.focus();
    placeCaretAtEnd(message)
  }

})

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