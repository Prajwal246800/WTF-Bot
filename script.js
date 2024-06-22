import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "./node_modules/@google/generative-ai";
import MarkdownIt from './node_modules/markdown-it';
// alert("Hello, world!");
document.addEventListener('DOMContentLoaded', () => {
    // console.log('DOMContentLoaded');
    let API_KEY = 'AIzaSyBhc_Pub6pZL4yxciDn9-zNX6r3D0Er9XM';
    let form = document.querySelector('form');
    let promptInput = document.querySelector('textarea[name="queries"]');
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
            // const prompt = document.querySelector('textarea[name="prompt"]').value;
            const prompt = `Hello! I am Kaavya, the AI chatbot for the WTF Fund.

The WTF Fund, an investment initiative started by Nikhil Kamath, the co-founder of Zerodha, is dedicated to supporting and investing in early-stage startups, particularly in the technology sector. To enhance our operations, we have recently opened positions for AI roles.

On June 21, 2024, at 4:00 PM, Pranav had a meeting with Shreyas, a WTF Council member responsible for interviewing candidates for these roles. During the meeting, Pranav presented an innovative approach to streamline our processes using AI chatbots. His proposal was impressive and led to his selection for the position. Here are the key advantages of the chatbot Pranav proposed:

Advantages of Pranav's Chatbot:

Handles Questions: The chatbot efficiently answers numerous questions from community members, significantly reducing the burden on Kaavya and Shreyas.
Checks Application Status: It allows applicants to check the status of their WTF fund application by entering their startup name or application number, thereby eliminating the need for manual status updates.
Analyzes Market Data: Utilizing current market data, the chatbot analyzes each application to assess the growth potential or decline of the idea, providing valuable insights.
Saves Time: By automating responses and status checks, the chatbot saves time for both users and administrators, enhancing overall efficiency.
Consistent Information: It ensures consistency by providing the same answers to everyone, thereby maintaining uniformity in information dissemination.
Handles More Queries: The chatbot can manage a large number of questions and applications without increasing the workload for human staff, making it scalable.
Provides Insights: It offers useful insights by analyzing data about which ideas are likely to succeed or need improvement, aiding better decision-making.
Engages Users: The chatbot leads to higher user satisfaction and engagement within the community by providing faster and more accurate responses.
Additional Benefits Highlighted in the Presentation:

Problem Statement Addressed: Pranav identified key issues such as the overwhelming number of questions directed at Kaavya and Shreyas and the spamming by applicants eager to check their application status. His solution effectively addresses these problems.
Community Engagement: By handling queries and providing up-to-date application status, the chatbot enhances the overall engagement and satisfaction of the WTF community members.
Pranav’s well-rounded approach and the advantages his chatbot offers make it a valuable addition to the WTF Fund's operations, ensuring streamlined processes and better support for our community and applicants.

This demo model was built to showcase the capabilities of Pranav's team. They will proceed with the best development practices and incorporate more advanced voice models in the future.

If anyone wants to apply for WTF Fund, they can check this link: 🚀 @everyone Exciting News! Introducing WTFund 🚀

We're thrilled to announce the launch of WTFund, India's first non-dilutive grant program dedicated to empowering young entrepreneurs. Backed by Nikhil Kamath, WTFund is committed to supporting audacious founders 25 and under.

What We Offer:

🕵 40 promising founders will receive up to ₹20 lakhs each to accelerate their ventures.
⚡ Sector-agnostic funding to foster diverse and innovative ideas.
📚 Outsized community, mentorship, FTM, and talent support.
Our applications are NOW OPEN! We're looking for founders who are ready to seize an incredible growth opportunity. If you're a young entrepreneur dreaming big, apply today and take the first step towards transforming your vision into reality.

🔗 Apply Now: http://www.allthingswtf.com/wtfund

As an AI application filter and startup analyzer, you will play a crucial role in evaluating applications based on specific metrics and providing insightful analyses to support investment decisions.`;
            chatHistory.push({
                role: 'user',
                parts: [
                    { text: promptInput.value.trim() + '\n\n<!-- Please respond in 30 words or less. -->' }
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
                    console.error('Error parsing stream response:', err);
                    output.innerHTML = "Due to privacy concerns, we are unable to disclose further details on this matter. Try Asking Any Other Topics";
                    break; // Exit the loop if parsing fails
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
            console.error('Error in getGeminiResponse:', e);
            output.innerHTML += '<hr>' + e.message;
        }
    }
    

    // form.onsubmit = async (ev) => {
    //     ev.preventDefault();
    //     synth.cancel();
    //     output.textContent = 'Generating...';
    //     getGeminiResponse();
    // };

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
            // console.log(transcript);
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
        startButton.disabled;
        // console.log("start Listening Function")
        recognition.start();
        isListening = true;
    }
    function stopListening() {
        synth.cancel();
        // console.log("stop Listening Function");
        recognition.stop();
        isListening = false;
    }
    recognition.addEventListener('result', handleVoiceResult);
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function intro() {
        startButton.disabled;
        synth.cancel();
        output.innerHTML = '';
        promptInput.textContent = 'Calling...';
        playAudioForDuration();
        await sleep(3000);
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
        }, 2000);
    }
    function endCall() {
        speakText("Thank you for contacting our AI. It was a pleasure speaking with you.");
    }
});