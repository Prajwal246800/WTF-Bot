import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import MarkdownIt from 'markdown-it';

let API_KEY = 'AIzaSyBhc_Pub6pZL4yxciDn9-zNX6r3D0Er9XM';
let form = document.querySelector('form');
let promptInput = document.querySelector('textarea[name="Queries"]');
let output = document.querySelector('#output');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let isListening = false;
let chatHistory = [];
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance()
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();


window.addEventListener("beforeunload", function () {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        if (isListening === true) {
            stopListening();
        }
    }
});

async function getGeminiResponse() {
    try {
        const prompt = document.querySelector('textarea[name="prompt"]').value;
        chatHistory.push({
            role: 'user',
            parts: [
                { text: promptInput.value + ' Respond in 30 words or less.' }
            ]
        });
        let contents = [
            {
                role: 'model',
                parts: [
                    { text: prompt }
                ]
            },
            ...chatHistory.map(entry => ({
                role: entry.role,
                parts: entry.parts
            }))
        ];
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
            ],
        });
        const result = await model.generateContentStream({ contents });
        let buffer = [];
        let md = new MarkdownIt();
        for await (let response of result.stream) {
            try {
                let text = response.text();
                buffer.push(text);
                output.innerHTML = md.render(buffer.join(''));
            } catch (err) {
                output.innerHTML = "Due to privacy concerns, we are unable to disclose further details on this matter. Try Asking Any Other Topics";
            }
        }
        chatHistory.push({
            role: 'model',
            parts: [
                { text: buffer.join('') }
            ]
        });
        speakText(output.innerHTML);
    } catch (e) {
        output.innerHTML += '<hr>' + e;
    }
}

form.onsubmit = async (ev) => {
    ev.preventDefault();
    synth.cancel();
    output.textContent = 'Generating...';
    getGeminiResponse();
};
function speakText(text) {
    if (window.speechSynthesis) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        utterance.lang = "en-In";
        const selectFemaleVoice = () => {
            const voices = synth.getVoices();
            for (let voice of voices) {
                if (voice.name.includes('Female') || voice.name.includes('Zira') || voice.name.includes('Indian English')) {
                    return voice;
                }
            }
            return null;
        };
        synth.onvoiceschanged = () => {
            const selectedVoice = selectFemaleVoice();
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            utterance.pitch = 2.0;
            utterance.rate = 1.5;
            synth.speak(utterance);
        };
        if (synth.getVoices().length !== 0) {
            const selectedVoice = selectFemaleVoice();
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            utterance.pitch = 2.0;
            utterance.rate = 1.2;
            synth.speak(utterance);
        }
        utterance.onend = () => {
            if (!isListening && !(promptInput.innerHTML.trim().split(' ').includes('bye'))) {
                startListening();
            }
        }
    } else {
        alert("Your browser doesn't support Speech Synthesis.");
    }
}
function handleVoiceResult(event) {
    let transcript = '';
    output.textContent = '';
    for (let i = 0; i < event.results.length; ++i) {
        transcript = event.results[i][0].transcript;
        console.log(transcript);
    }
    promptInput.textContent = transcript;
    if (isListening === true) {
        stopListening();
    }
    if (promptInput.innerHTML.trim().split(' ').includes('bye')) {
        endCall();
    }
    else {
        getGeminiResponse();
    }
}
function startListening() {
    console.log("start Listening Function")
    recognition.start();
    isListening = true;
}
function stopListening() {
    console.log("stop Listening Function");
    recognition.stop();
    isListening = false;
}
recognition.addEventListener('result', handleVoiceResult);
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function intro() {
    promptInput.textContent = 'Calling...';
    playAudioForDuration();
    await sleep(6000);
    promptInput.textContent = '';
    speakText('Hello there How Can I Help You?');
}
startButton.addEventListener('click', intro);
stopButton.addEventListener('click', stopListening);
recognition.addEventListener('end', () => {
    if (isListening) {
        recognition.start();
    }
});
recognition.addEventListener('error', (event) => {
    console.error('Speech recognition error:', event.error);
    if (isListening) {
        recognition.start();
    }
});
function playAudioForDuration() {
    var audio = document.getElementById('myAudio');
    audio.play();
    setTimeout(function () {
        audio.pause();
    }, 5000);
}
function endCall() {
    speakText("Thank you for contacting our AI. It was a pleasure speaking with you.");
}