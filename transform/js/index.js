import { wait_time_ms, test_type, speed } from "./constants.js";
let message = document.getElementById('messagebox');
let tone = document.getElementById('tonebox');
// const istyping = document.getElementById('istyping')
let timeout = setTimeout(function () { }, 0)

// the outputbox is the output in the index.html file
let output = document.getElementById('outputbox')

message.addEventListener('keydown', function (e) {
  if (e.key.length === 1) {
    clearTimeout(timeout);
    // istyping.innerHTML = 'User is typing'
    console.log('User is typing')
    timeout = setTimeout(function () {
      //TODO: Call API and passed the vlaue and message as body. (/text-transform)
      console.log(tone.value)
      console.log(message.textContent)

    }, wait_time_ms)
  }
})


// Click on the button "submit". When that happens, make an API call to the text-transform route, and submit the output of the API call into the result textbox div.
const submitButton = document.getElementById('submit-tone')

const resetButton = document.getElementById('reset')

function submitTone() {
  //TODO: Call API and passed the value and message as body. (/text-transform)
  const apiCall = 'asdf'
  const desiredOutput = tone.value + ": " + apiCall

  return output.innerHTML = desiredOutput
}

function reset() {
  output.innerHTML = " "
}

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