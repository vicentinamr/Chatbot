const API_KEY = "ebc3aa367c8eaa429590b9281059bc37"; // Coloque aqui sua chave da OpenWeatherMap
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', () => {
    const pergunta = userInput.value.trim();
    if(pergunta === '') return;
    addMessage(pergunta, 'user-message');
    processMessage(pergunta);
    userInput.value = '';
});

// Enviar mensagem ao pressionar Enter
userInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendBtn.click();
    }
});

function addMessage(text, className) {
    const message = document.createElement('div');
    message.textContent = text;
    message.className = className;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function processMessage(pergunta) {
    pergunta = pergunta.toLowerCase();

    if(pergunta.includes('clima') || pergunta.includes('tempo')) {
        // Captura cidade após "em"
        const regex = /em ([a-zA-ZÀ-ÿ\s]+)/i;
        const match = pergunta.match(regex);
        if(match && match[1]) {
            const cidade = match[1].trim();
            getWeather(cidade);
        } else {
            addMessage("Por favor, informe a cidade usando 'clima em [cidade]'.", 'bot-message');
        }
    } else {
        addMessage("Desculpe, posso responder apenas perguntas sobre o clima.", 'bot-message');
    }
}

async function getWeather(cidade) {
    // Proxy gratuito para evitar bloqueio CORS
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const apiUrl = encodeURIComponent(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`);

    try {
        const response = await fetch(proxyUrl + apiUrl);
        if (response.status === 200) {
            const dataWrapped = await response.json();
            const data = JSON.parse(dataWrapped.contents);
            const temp = data.main.temp;
            const desc = data.weather[0].description;
            const cidadeNome = data.name;
            const pais = data.sys.country;
            addMessage(`O clima em ${cidadeNome}, ${pais} é ${temp}°C com ${desc}.`, 'bot-message');
        } else {
            addMessage("Erro ao obter dados do clima.", 'bot-message');
        }
    } catch (error) {
        addMessage("Erro na conexão com a API.", 'bot-message');
    }
}
