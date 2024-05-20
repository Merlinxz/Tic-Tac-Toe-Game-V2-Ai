// AI Responses
const aiResponses = [
    "Your move, human!",
    "I see your strategy.",
    "Think you can beat me?",
    "This will be interesting!",
    "Your turn!",
    "Let's see what you got!",
    "I'm ready for this.",
    "Here goes nothing.",
    "Bring it on!",
    "I won't go easy on you!"
];

function getRandomAIResponse() {
    const randomIndex = Math.floor(Math.random() * aiResponses.length);
    return aiResponses[randomIndex];
}

export { getRandomAIResponse };