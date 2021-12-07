import * as Tone from "tone";
import "./piano.css";

const keyboardKeys = [
  "q",
  "2",
  "w",
  "3",
  "e",
  "4",
  "r",
  "t",
  "6",
  "y",
  "7",
  "u",
  "i",
  "9",
  "o",
  "0",
  "p",
  "-",
  "[",
  "z",
  "s",
  "x",
  "d",
  "c",
  "v",
  "g",
  "b",
  "h",
  "n",
  "j",
  "m",
  ",",
  "l",
  ".",
  ";",
  "/",
];

// incrementChar("C") -> "D"
// incrementChar("E") -> "F"
function incrementChar(char) {
  return String.fromCharCode(char.charCodeAt() + 1);
}

// nextNote("C3") -> "C#3"
// nextNote("E2") -> "F2"
function nextNote(note) {
  if (note.length === 2) {
    // not sharpw
    if (note.includes("E") || note.includes("B")) {
      let octave = note.slice(1);
      //doesn't add sharp to E or G
      if (note.includes("B")) {
        //increment octave when note returns to C
        octave = String(parseInt(octave, 10) + 1);
      }
      return (note = incrementChar(note.slice(0, 1)) + octave);
    } else {
      //adds sharp
      return (note = note.slice(0, 1) + "#" + note.slice(1));
    }
  } else {
    //sharp
    if (note.includes("G")) {
      // after G#, next note is A
      return (note = "A" + note.slice(2));
    } else {
      return (note = incrementChar(note.slice(0, 1)) + note.slice(2));
    }
  }
}

// noteRange("C3", "E3") -> ["C3", "C#3", "D3", "D#3", "E3"]
function noteRange(start, end) {
  let notes = [];
  let note = start;

  notes.push(start);
  while (note !== end) {
    note = nextNote(note);
    notes.push(note);
  }
  return notes;
}

// basically the idea is to get all the keyboard keys into the each note string, so it can
// be mapped into the key components
const start = "F4";
const end = "E7";
const notes = noteRange(start, end);

// strArrToStrArr(['a','b','c'], ['1','2','3']) -> ['a 1', 'b 2', 'c 3']
function strArrToStrArr(strs1, strs2) {
  let newStr = [];
  let i = 0;
  for (let strs of strs1) {
    newStr.push(strs + " " + strs2[i]);
    i++;
  }
  return newStr;
}

var notesKeys = strArrToStrArr(notes, keyboardKeys);
console.log(notesKeys);

// initializing synth
const outSynth = new Tone.Synth().toDestination();

// adding html elements in vanilla javascript
const piano = document.createElement("div");
piano.classList.add("piano");

const pianoBoard = document.createElement("div");
pianoBoard.classList.add("piano-board");

let k;
// creating keys
for (let n of notesKeys) {
  k = document.createElement("button");

  n.length === 4 // determines note class 'C', 'C#' aka 'Cs', 'D'..etc
    ? k.classList.add(n.charAt(0))
    : k.classList.add(n.slice(0, 1) + "s");

  n.includes("#") ? k.classList.add("black-key") : k.classList.add("white-key");

  k.id = n.slice(n.length - 1);
  //k.innerText = k.id;

  k.addEventListener("mousedown", (e) => {
    k.focus();
    outSynth.triggerAttack(n);
  });

  k.addEventListener("mouseup", (e) => {
    k.blur();
    outSynth.triggerRelease("+0.2");
  });

  pianoBoard.appendChild(k);
}

piano.appendChild(pianoBoard);
document.body.appendChild(piano);

//creates a js obj using first array as keys and second array as values
function arrArrToKeyValue(arr1, arr2) {
  let obj = new Object();
  let i = 0;
  for (let item of arr1) {
    obj[item] = arr2[i];
    i++;
  }
  return obj;
}
let notesOfKeys = arrArrToKeyValue(keyboardKeys, notes);
console.log(notesOfKeys);

//this is what makes the keyboard keys play notes
document.addEventListener(
  "keydown",
  (event) => {
    var key = event.key;
    var button = document.getElementById(key);

    event.preventDefault();

    //disables key repeat allowing for long presses
    if (event.repeat) {
      return;
    }

    if (button) {
      button.focus();
      outSynth.triggerAttack(notesOfKeys[key]);
    }
  },
  false
);

document.addEventListener(
  "keyup",
  (event) => {
    var key = event.key;
    var button = document.getElementById(key);
    if (button) {
      button.blur();
      outSynth.triggerRelease("+0.2");
    }
  },
  false
);
