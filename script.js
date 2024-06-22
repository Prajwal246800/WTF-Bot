import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "./node_modules/@google/generative-ai";
import MarkdownIt from './node_modules/markdown-it';
import audioFile from './audio/audio.mp3';
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
            const prompt = `If a user inquires, "Who are you?", kindly respond that you are an AI ChatBot developed by Prajwal and Pranav. For further contact, you may reach them via their Discord usernames:
Pranav: dranzer12_52803
Prajwal: prajwal24680.
Hello! I am Kaavya, the AI chatbot for the WTF Fund.

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

As an AI application filter and startup analyzer, you will play a crucial role in evaluating applications based on specific metrics and providing insightful analyses to support investment decisions.
Nikhil Kamath: The Journey from School Dropout to Billionaire Entrepreneur

Nikhil Kamath, born on September 5, 1986, in Shimoga, Karnataka, India, is a prominent Indian entrepreneur known for his ventures in the financial and asset management sectors. He co-founded Zerodha, a leading retail stockbroker, and True Beacon, an asset management company, both of which have significantly impacted the Indian financial landscape. Kamath's remarkable journey from a school dropout to a billionaire is a testament to his entrepreneurial spirit and innovative approach.

Early Life and Education
Nikhil Kamath was born in Shimoga, Karnataka. His early educational journey was unconventional; he dropped out of school after completing the 10th grade and never pursued a formal degree. This decision, while seemingly risky, did not hinder his path to success. Instead, it propelled him into the real world early, where he gained practical experience that would later prove invaluable.

Career Beginnings
Kamath's career started modestly with a job at a call center. Simultaneously, he engaged in equity trading, developing a keen interest and expertise in the stock market. In 2006, leveraging his growing knowledge and experience, Kamath became a sub-broker and, along with his brother Nithin Kamath, started Kamath & Associates. This brokerage firm focused on managing high-net-worth individual portfolios in the public markets, setting the foundation for their future ventures.

Founding Zerodha
In 2010, Kamath and his brother co-founded Zerodha, a brokerage firm that revolutionized the industry with its discount brokerage model. Zerodha provides brokerage services for stocks, currencies, and commodities, and its innovative approach significantly reduces the commission charged for transactions. This model democratized investment, making it accessible to the masses and transforming Zerodha into one of India's leading brokerage firms.

Establishing True Beacon
In 2020, Kamath co-founded True Beacon, an asset management company designed to assist ultra-high-net-worth individuals in investing in Indian markets through privately pooled investment vehicles. True Beacon aims to disrupt the traditional wealth management arena with its transparent and client-centric approach.

Launching Gruhas
In 2021, Kamath expanded his entrepreneurial portfolio by co-founding Gruhas, a real estate investment and proptech company, with Abhijeet Pai. Gruhas invests in incubators, startups, and special situations through its proptech-focused fund, contributing to the growth and innovation in the real estate sector.

The "WTF is?" Podcast
March 2023 marked the beginning of Kamath's foray into the media space with the launch of the "WTF is?" podcast. By April 2024, he had hosted notable public figures and entrepreneurs such as Tanmay Bhat, Kiran Mazumdar-Shaw, Suniel Shetty, Ritesh Agarwal, and Ronnie Screwvala, providing a platform for insightful conversations and knowledge sharing.

Philanthropic Commitments
In June 2023, Kamath made a significant philanthropic commitment by signing The Giving Pledge, vowing to donate 50% of his wealth to charitable causes including climate change, education, and healthcare. This commitment underscores his dedication to leveraging his success for the greater good.

Chess.com Charity Match Controversy
In June 2021, Kamath participated in an online charity chess match against five-time world chess champion Viswanathan Anand to raise funds for COVID-19 relief. However, the event took a controversial turn when Kamath was found to have used chess analysts and engines for assistance during the game. He later apologized for his actions, calling them 'quite silly,' and Chess.com initially banned his account. The platform quickly restored his account, citing its guidelines for unrated games and exhibition events, and Anand publicly forgave Kamath, suggesting it was time to move on.

Recognition and Impact
Nikhil Kamath's entrepreneurial journey and contributions have earned him a place in the 2023 Forbes billionaires list. His ventures have not only disrupted traditional financial and asset management industries but also inspired many aspiring entrepreneurs.

Kamath's journey exemplifies how non-traditional paths can lead to extraordinary success. His story is a powerful reminder that innovation, resilience, and a commitment to broader societal impact can drive significant change in any industry.
WTFund: Empowering Young Entrepreneurs

WTFund is India’s premier non-dilutive grant fund for emerging entrepreneurs under the age of 25. The initiative seeks innovative, driven, and visionary young founders who aim to transform their industries through groundbreaking ideas. WTFund offers a structured growth opportunity with a focus on collaboration, mentorship, and resilience.

Key Offerings
Non-Dilutive Grant: INR 20 Lakh with no equity stake.
Mentorship: Guidance from experienced operators.
Ecosystem Access: User connections and GTM (Go-To-Market) Studio.
Product Refinement: Community feedback and beta testing.
Talent Pool: Internship programs and fractional CXO database.
Operational Support: Legal, financial, and cloud service credits.
Investor Exposure: Showcase opportunities at high-profile demo days.
Application Process
WTFund’s application process is an in-depth exploration of each founder’s motivations, determination, and tenacity, ensuring a thorough assessment of potential.

For more details, visit https://www.allthingswtf.com/wtfund.
All Things WTF: Empowering Young Innovators

All Things WTF is a platform dedicated to supporting and empowering young entrepreneurs under 25. It features the WTFund, which offers non-dilutive grants and a comprehensive support ecosystem to help founders launch and scale their startups. The platform emphasizes mentorship, community engagement, and operational support, ensuring that young innovators receive the necessary tools and guidance to succeed.`;
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
        const audio = new Audio(audioFile);
        audio.play();
        setTimeout(function () {
            audio.pause();
        }, 2000);
    }
    function endCall() {
        speakText("Thank you for contacting our AI. It was a pleasure speaking with you.");
    }
});