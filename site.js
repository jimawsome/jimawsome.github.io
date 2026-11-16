const status = document.getElementById("status");
const incident = document.getElementById("incident");
status.addEventListener("click", () => {
  incident.hidden = !incident.hidden;
  status.setAttribute("aria-expanded", String(!incident.hidden));
});

const quips = {
  "table-tennis": "Reconciled. You can take the paddle, not the spin.",
  "rock-climbing": "Recreated. Gravity is a dependency I can't remove.",
  "skiing": "Recreated. Desired state: fresh powder.",
  "cooking": "Recreated. Someone has to feed the on-call engineer.",
  "pickleball": "Recreated in record time. This one has a strict PodDisruptionBudget.",
};

const log = document.getElementById("term-log");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

document.querySelectorAll("#hobbies tbody tr").forEach((row) => {
  const name = row.dataset.name;
  const st = row.querySelector(".st");
  const rs = row.querySelector(".rs");
  let busy = false;

  row.querySelector("button").addEventListener("click", async () => {
    if (busy) return;
    busy = true;
    log.textContent = `$ kubectl delete hobby ${name}\nhobby "${name}" deleted\n`;
    for (const [phase, ms] of [["Terminating", 700], ["Pending", 500], ["ContainerCreating", 700]]) {
      st.textContent = phase;
      st.className = "st warn";
      await sleep(ms);
    }
    st.textContent = "Running";
    st.className = "st";
    rs.textContent = String(Number(rs.textContent) + 1);
    log.textContent += `${quips[name]}\n`;
    busy = false;
  });
});

console.log(
  "%cHey, you opened the console.",
  "color:#76b900;font-weight:bold;font-size:14px",
  "\nIf you're debugging my site, we should probably talk. jimmy.jdaruwala@gmail.com"
);
