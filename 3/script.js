// 1. DOM ელემენტების დაკავშირება
const factText = document.getElementById("fact-text");
const factSource = document.getElementById("fact-source");
const nextBtn = document.getElementById("next-btn");
const saveBtn = document.getElementById("save-btn");
const counterSpan = document.getElementById("counter");
const favList = document.getElementById("fav-list");
const favCount = document.getElementById("fav-count");
const emptyState = document.getElementById("empty-state");

// 2. მდგომარეობა (State & Arrays)
let currentFact = { text: "დააჭირე ღილაკს და აღმოაჩინე კოსმოსი...", source: "მოლოდინის რეჟიმი" };
let savedFacts = [];
let totalViews = 0;

// სარეზერვო (Fallback) მონაცემები ინტერნეტის გათიშვისთვის
const fallbackFacts = [
    { text: "მზე იმდენად დიდია, რომ მასში დაახლოებით 1.3 მილიონი დედამიწა ჩაეტევა.", source: "NASA (Fallback)" },
    { text: "ვენერაზე ერთი დღე უფრო გრძელია, ვიდრე ერთი წელიწადი.", source: "Space Facts (Fallback)" },
    { text: "მარსზე მზის ჩასვლა ლურჯი ფერისაა.", source: "Astronomy Daily (Fallback)" }
];

/**
 * 3. API Fetch: მონაცემების წამოღება სერვერიდან async/await-ით
 */
async function fetchFact() {
    nextBtn.disabled = true;
    factText.textContent = "იტვირთება ფაქტი სერვერიდან...";
    factSource.textContent = "⏳ გთხოვთ დაიცადოთ...";

    try {
        const response = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");

        if (!response.ok) {
            throw new Error("სერვერის შეცდომა");
        }

        const data = await response.json();

        // მიმდინარე ობიექტის განახლება
        currentFact = {
            text: data.text,
            source: data.source || "API"
        };

    } catch (error) {
        console.warn("API მიუწვდომელია, ვიყენებთ ლოკალურ მონაცემებს:", error.message);

        // თუ ინტერნეტი არ არის, ვიღებთ სარეზერვო სიიდან
        const randomIndex = Math.floor(Math.random() * fallbackFacts.length);
        currentFact = fallbackFacts[randomIndex];
    } finally {
        nextBtn.disabled = false;
        totalViews++;
        counterSpan.textContent = `ნანახია: ${totalViews}`;

        // DOM მანიპულაცია: ეკრანზე გამოტანა
        renderCurrentFact();
    }
}

/**
 * 4. DOM მანიპულაცია: მიმდინარე ფაქტის გამოსახვა
 */
function renderCurrentFact() {
    factText.textContent = `"${currentFact.text}"`;
    factSource.textContent = `— წყარო: ${currentFact.source}`;
}

/**
 * 5. ფავორიტებში შენახვა (State & Arrays)
 */
function saveFact() {
    // შემოწმება: ხომ არ გვაქვს უკვე შენახული ეს ფაქტი?
    const exists = savedFacts.some(f => f.text === currentFact.text);
    if (exists) {
        alert("⚠️ ეს ფაქტი უკვე შენახულია ფავორიტებში!");
        return;
    }

    // მასივში დამატება უნიკალური ID-ით
    savedFacts.push({ ...currentFact, id: Date.now() });

    // ფავორიტების სიის გადახატვა
    renderFavorites();
}

/**
 * 6. დინამიური ელემენტების რენდერი და წაშლა ფავორიტებიდან
 */
function renderFavorites() {
    favCount.textContent = `${savedFacts.length} ფაქტი`;

    if (savedFacts.length === 0) {
        emptyState.classList.remove("hidden");
        favList.innerHTML = "";
        favList.appendChild(emptyState);
        return;
    }

    emptyState.classList.add("hidden");
    favList.innerHTML = "";

    // თითოეული შენახული ფაქტისთვის HTML ელემენტის შექმნა
    savedFacts.forEach((fact) => {
        const li = document.createElement("li");
        li.className = "flex items-start justify-between gap-3 bg-slate-800 border border-slate-700/60 rounded-xl p-3 text-xs";

        li.innerHTML = `
      <div class="flex-1">
        <p class="text-slate-200 italic mb-1">"${fact.text}"</p>
        <span class="text-sky-400">— ${fact.source}</span>
      </div>
      <button class="delete-btn text-slate-400 hover:text-rose-400 p-1 transition cursor-pointer" title="წაშლა">
        ✕
      </button>
    `;

        // დინამიური წაშლის ლოგიკა (.filter() მეთოდით)
        li.querySelector(".delete-btn").addEventListener("click", () => {
            savedFacts = savedFacts.filter(f => f.id !== fact.id);
            renderFavorites();
        });

        favList.appendChild(li);
    });
}

// 7. ღილაკების მოსმენა (Event Listeners)
nextBtn.addEventListener("click", fetchFact);
saveBtn.addEventListener("click", saveFact);

// საწყისი ავტომატური ჩატვირთვა
fetchFact();