let selectionEndTimeout = null,
  event = new Event("selectionEnd");

let x, y;

document.onmousemove = (e) => {
  x = e.pageX;
  y = e.pageY;
};

const tipStyle = `
        height: auto;
        width: auto;
        position: absolute;
        color: #fff;
        padding: 5px;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
        cursor: pointer;
        background: #fff;
        display: none;
    `;
const tip = `<div id="recap-tooltip" style="${tipStyle}"><svg style="height: 25px; transform: scale(1.1); width: 35px;" class="ov-icon" aria-hidden="true" width="46.08" height="46.08" viewBox="-1.6 -1.6 19.2 19.2" fill="#000" style="font-size: 2.88em;"><path d="M4.545 6.714L4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z"></path><path d="M0 2a2 2 0 012-2h7a2 2 0 012 2v3h3a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-3H2a2 2 0 01-2-2V2zm2-1a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V2a1 1 0 00-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 01-.415-.492 1.988 1.988 0 01-.94.31z"></path></svg></div>`;

document.body.innerHTML += tip;

document.addEventListener("click", function (event) {
  let get = document.getElementById("recap-tooltip");
  if (!get.contains(event.target)) {
    get.style.display = "none";
  }
});

document.addEventListener("selectionEnd", async function () {
  chrome.storage.sync.get(
    {
      showTTT: true,
    },
    (items) => {
      const on = items.showTTT;
      if (on) {
        const string = window.getSelection().toString();
        const styles = `
        height: 350px; 
        width: 450px; 
        position: absolute; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        z-index: 999999; 
        background: #fff; 
        border-radius: 10px;
        
    `;
        const iframe = `
        height: 100%; 
        width: 100%;
        border: none !important;
        position: fixed;
    `;
        const html = `<div id="recap-popup" style="${styles}">
        <iframe style="${iframe}" src="https://awordaday.vercel.app/${string}"></iframe>
    </div>`;
        const tooltip = document.getElementById("recap-tooltip");
        const popup = document.getElementById("recap-popup");
        tooltip.style.top = y + 15 + "px";
        tooltip.style.left = x + "px";
        tooltip.style.display = "block";
        const container = document.createElement("div");
        // styles
        container.innerHTML = html;
        container.style.height = "100vh";
        container.style.width = "100vw";
        container.style.background = "rgba(0,0,0,0.35)";
        container.style.position = "fixed";
        container.style.top = "0";
        container.style.left = "0";
        container.style.display = "none";
        // events
        container.addEventListener("click", () => {
          //const div = document.getElementById("recap-popup");
          document.body.removeChild(container);
        });

        if (!popup) {
          document.body.appendChild(container);
        }

        tooltip.addEventListener("click", () => {
          container.style.display = "block";
          tooltip.style.display = "none";
        });
      }
    }
  );
});

["mouseup", "selectionchange"].map((e) => {
  document.addEventListener(e.toString(), (evt /*event*/) => {
    if (selectionEndTimeout && evt.type == "selectionchange") {
      clearTimeout(selectionEndTimeout);
      //console.info("User Selection Changed");
    }

    selectionEndTimeout = setTimeout(function () {
      if (evt.type == "mouseup" && window.getSelection().toString() != "") {
        document.dispatchEvent(event);
      }
    }, 100);
  });
});
