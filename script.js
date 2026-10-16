let selectedCatagory = "All";
let searchText = "";

async function loadGames(catagory, selectedCatagory) {
    // Games
    const response = await fetch("https://raw.githubusercontent.com/CalebEGUDUDE/Chillest-Website-Games/refs/heads/main/games/games.json");

    if (!response.ok) {
        throw new Error(`Could not load games-debug.json: ${response.status}`);
    }

    const gamesJson = await response.json();
    const gamesSpot = document.querySelector("#games");

    gamesSpot.replaceChildren();

    if (!gamesSpot) {
        throw new Error('Could not find an element with id="game-load".');
    }
    
    for (const game of gamesJson) {
        const card = document.createElement("div");
        card.className = "game-container";

        const name = document.createElement("p");
        name.className = "game-name";
        name.textContent = game.name;

        const icon = document.createElement("img");
        icon.className = "game-icon";
        icon.src = game.icon
            ? `https://raw.githubusercontent.com/CalebEGUDUDE/Chillest-Website-Games/refs/heads/main/${game.icon}`
            : "/placeholder.png";
        icon.alt = game.name;

        const play = document.createElement("button")
        play.type = "button";
        play.className = "play";
        play.textContent = "Play";

        play.addEventListener("click", async () => {
            const gameTab = window.open("", "_blank");
        
            if (!gameTab) {
                console.error("The browser blocked the new tab. Allow pop-ups and try again.");
                return;
            }
        
            try {
                const gameUrl = new URL(
                    game.html,
                    "https://raw.githubusercontent.com/CalebEGUDUDE/Chillest-Website-Games/refs/heads/main/"
                );
        
                const response = await fetch(gameUrl);
        
                if (!response.ok) {
                    throw new Error(`Could not load ${game.html}: ${response.status}`);
                }
        
                const html = await response.text();
                const gameDocument = new DOMParser().parseFromString(html, "text/html");
        
                const base = gameDocument.createElement("base");
                base.href = gameUrl.href;
                gameDocument.head.prepend(base);
        
                gameTab.document.open();
                gameTab.document.write(
                    html
                );
                gameTab.document.close();
            } catch (error) {
                gameTab.close();
                console.error("Could not open the game:", error);
            }
        });

        const download = document.createElement("button");
        download.type = "button";
        download.className = "download";
        download.textContent = "Download";

        download.addEventListener("click", async () => {
            try {
                const gameUrl = new URL(
                    game.html,
                    "https://raw.githubusercontent.com/CalebEGUDUDE/Chillest-Website-Games/refs/heads/main/"
                );
        
                const response = await fetch(gameUrl);
        
                if (!response.ok) {
                    throw new Error(`Could not download ${game.html}: ${response.status}`);
                }
        
                const html = await response.text();
                const blob = new Blob([html], { type: "text/html" });
                const blobUrl = URL.createObjectURL(blob);
        
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = game.html.split("/").pop() || "game.html";
                document.body.append(link);
                link.click();
                link.remove();
        
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            } catch (error) {
                console.error("Could not download the game:", error);
            }
        });

        const catagoryGame = game.html.split("/")[2];

        if (catagoryGame === "DEBUG") {
            continue;
        }

        if (catagory !== "All" && catagoryGame !== catagory) {
            continue;
        }

        if (!game.name.toLowerCase().includes(searchText)) {
            continue;
        }

        card.append(name, icon, play, download);
        gamesSpot.append(card);

    }

    // Catagories
    const catagoriesSpot = document.querySelector("#catagories-main")

    if (!catagoriesSpot) {
        throw new Error('Could not find "#catagories-main".');
    }

    const getCatagory = game => game.html.split("/")[2];
    const catagories = [
        "All",
        ...new Set(
            gamesJson
                .map(getCatagory)
                .filter(catagory => catagory && catagory !== "DEBUG")
        )
    ];

    catagoriesSpot.replaceChildren();

    for (const catagory of catagories) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = catagory;
        button.classList.toggle("active", catagory === selectedCatagory);

        button.addEventListener("click", () => {
            selectedCatagory = catagory;
            loadGames(catagory, catagory).catch(console.error);
        });

        catagoriesSpot.append(button);

    }

}

loadGames("All", "All").catch(console.error);




const searchInput = document.querySelector("#search");

searchInput.addEventListener("input", () => {
    searchText = searchInput.value.trim().toLowerCase();
    loadGames(selectedCatagory, selectedCatagory).catch(console.error);
});




const gamesButton = document.querySelector(".side.games")
const settingsButton = document.querySelector(".side.settings");
const gamesPanel = document.querySelector("#games");
const settingsPanel = document.querySelector("#settings-panel");
const categoryButtons = document.querySelector("#catagories-main");

gamesButton.addEventListener("click", () => {
    gamesPanel.hidden = false;
    settingsPanel.hidden = true;
    categoryButtons.hidden = false;
});

settingsButton.addEventListener("click", () => {
    gamesPanel.hidden = true;
    settingsPanel.hidden = false;
    categoryButtons.hidden = true;   
});

const mainButtons = document.querySelectorAll("#catagories .side");

mainButtons.forEach(button => {
    button.addEventListener("click", () => {
        mainButtons.forEach(item => item.classList.remove("active"));
        button.classList.add("active");
    })
});

async function splashText() {
    const splashResponse = await fetch(
        "https://raw.githubusercontent.com/CalebEGUDUDE/Chillest-Website-Games/refs/heads/main/assets/text/splashes.json"
    );

    if (!splashResponse.ok) {
        throw new Error(`Could not load splashes.json: ${splashResponse.status}`);
    }

    const splashJson = await splashResponse.json();
    const splashSpot = document.querySelector("#splash");

    if (!splashSpot) {
        throw new Error('Could not find an element with id="splash".');
    }

    const splashes = splashJson.splashes;
    if (!Array.isArray(splashes) || splashes.length === 0) {
        throw new Error("splashes.json does not contain any splash text.");
    }

    splashSpot.textContent =
        splashes[Math.floor(Math.random() * splashes.length)];
}

splashText().catch(console.error);