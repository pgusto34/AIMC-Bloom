import { wait_time_ms, test_type, speed } from "./constants.js";
let message = document.getElementById('messagebox');
let tone = document.getElementById('tonebox');
const istyping = document.getElementById('istyping')
let timeout  = setTimeout(function(){}, 0)

function typeWriter(txt, i) {
  for (let i = 0; i < txt.length; i++ ) {
    setTimeout( function () {
      message.value += txt.charAt(i)
    },50 * i)
  }
}

message.addEventListener('keypress', function(){
	  clearTimeout(timeout);
    istyping.innerHTML = 'User is typing'
    timeout = setTimeout(function() {
      let i = 0
      //TODO: Call API
      console.log(tone.value)
      typeWriter(test_type, i)
      istyping.innerHTML = 'User is not typing'
     }, wait_time_ms)
})
