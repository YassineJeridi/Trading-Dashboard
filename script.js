const tradingPairs = [
    'BTCUSD', 'EURUSD', 'XAUUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD', 'USDCHF', 'EURGBP',
    'EURJPY', 'GBPJPY', 'CHFJPY', 'EURCHF', 'AUDJPY', 'AUDCAD', 'NZDCAD', 'EURNZD', 'GBPAUD', 'GBPCHF'
];

const cardContainer = document.getElementById("cardContainer");
const chartContainer = document.getElementById("chartContainer");
const chartTitle = document.getElementById("chartTitle");
const tradingViewChart = document.getElementById("tradingViewChart");
const openChartBtn = document.getElementById("openChartBtn");
let currentChartUrl = "";

// Populate trading pairs
tradingPairs.forEach(pair => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `<h3>${pair}</h3>`;
    card.onclick = () => {
        currentChartUrl = `https://www.tradingview.com/chart/?symbol=OANDA:${pair}`;
        chartTitle.innerText = `${pair} Chart`;
        tradingViewChart.src = `https://www.tradingview.com/widgetembed/?symbol=OANDA:${pair}&interval=60&hidesidetoolbar=1&hidelegend=1`;
        chartContainer.style.display = "block";
    };
    cardContainer.appendChild(card);
});

// Open chart in new tab
openChartBtn.onclick = () => {
    if (currentChartUrl) {
        window.open(currentChartUrl, "_blank");
    }
};

// Fetch economic news
async function fetchEconomicNews() {
    try {
        const apiKey = "YOUR_ALPHA_VANTAGE_API_KEY"; // Replace with your Alpha Vantage API key
        const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=FOREX:USD&apikey=${apiKey}`);
        const data = await response.json();
        const newsList = document.getElementById("newsList");
        newsList.innerHTML = "";

        if (data.feed && data.feed.length > 0) {
            // Sort news by relevance_score in descending order
            const sortedNews = data.feed.sort((a, b) => b.relevance_score - a.relevance_score);

            sortedNews.slice(0, 10).forEach(news => {
                const listItem = document.createElement("li");
                let importanceColor = "";

                // Determine importance color based on relevance_score
                if (news.relevance_score > 75) {
                    importanceColor = "#ff4d4d"; // Red for high importance
                } else if (news.relevance_score >= 50) {
                    importanceColor = "#ffa64d"; // Orange for medium importance
                } else {
                    importanceColor = "#4dff4d"; // Green for low importance
                }

                listItem.innerHTML = `
                    <strong style="color: ${importanceColor};">${news.title}</strong><br>
                    <em>Source: ${news.source}</em><br>
                    <span>Relevance: ${news.relevance_score}</span><br>
                    <a href="${news.url}" target="_blank">Read more</a>
                `;
                newsList.appendChild(listItem);
            });
        } else {
            newsList.innerHTML = "<li>No news available at the moment.</li>";
        }
    } catch (error) {
        console.error("Error fetching economic news:", error);
        document.getElementById("newsList").innerHTML = "<li>Failed to load news. Please try again later.</li>";
    }
}

fetchEconomicNews();