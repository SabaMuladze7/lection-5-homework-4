const skillInput = document.getElementById("skill-input");
const addBtn = document.getElementById("add-btn");
const clearBtn = document.getElementById("clear-btn");
const skillsList = document.getElementById("skills-list");
const counterEl = document.getElementById("counter");
const statusMessage = document.getElementById("status-message");
const errorMessage = document.getElementById("error-message");

let totalSkills = 0;

function updateUI() {
    counterEl.textContent = totalSkills;

    if (totalSkills === 0) {
        statusMessage.textContent = "სია ჯერ ცარიელია — დროა რამე ახალი ისწავლო! 💡";
        statusMessage.className = "text-sm text-slate-400 font-medium tracking-wide";
    } else if (totalSkills < 5) {
        statusMessage.textContent = `შესანიშნავია! შენ აქტიურად სწავლობ ${totalSkills} უნარს 🎯`;
        statusMessage.className = "text-sm text-sky-400 font-medium tracking-wide";
    } else {
        statusMessage.textContent = `წარმოუდგენელი ტემპი! უკვე ${totalSkills} უნარზე მუშაობ 🔥`;
        statusMessage.className = "text-sm text-emerald-400 font-semibold tracking-wide";
    }
}

function addSkill() {
    const text = skillInput.value.trim();

    if (text === "") {
        errorMessage.classList.remove("hidden");
        skillInput.classList.add("border-rose-500");
        return;
    }

    errorMessage.classList.add("hidden");
    skillInput.classList.remove("border-rose-500", "animate-pulse");

    const li = document.createElement("li");
    li.className = "group flex items-center justify-between bg-slate-900/90 border border-slate-700/60 rounded-xl px-4 py-3 hover:border-sky-500/70 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 transform translate-y-0";

    li.innerHTML = `
    <span class="text-sm text-slate-200 font-medium flex items-center gap-2.5">
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-sky-500/10 text-sky-400 text-xs">⭐</span> 
      <span class="group-hover:text-white transition-colors">${text}</span>
    </span>
    <button class="delete-btn text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg transition-all duration-200" title="უნარის წაშლა">
      🗑️
    </button>
  `;

    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
        li.remove();
        totalSkills--;
        updateUI();

    });

    skillsList.appendChild(li);
    totalSkills++;
    updateUI();

    skillInput.value = "";

}

function clearAll() {
    if (totalSkills === 0) return;

    skillsList.innerHTML = "";
    totalSkills = 0;
    updateUI();
    errorMessage.classList.add("hidden");
    skillInput.classList.remove("border-rose-500");
}

addBtn.addEventListener("click", addSkill);

skillInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addSkill();
    }
});

clearBtn.addEventListener("click", clearAll);

updateUI();