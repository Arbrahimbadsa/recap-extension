// Saves options to chrome.storage
function save_options() {
  var isTTT = document.getElementById("ttt").checked;
  chrome.storage.sync.set(
    {
      showTTT: isTTT,
    },
    function () {
      setTimeout(() => {
        alert("Saved!");
      }, 500);
    }
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get(
    {
      showTTT: true,
    },
    function (items) {
      document.getElementById("ttt").checked = items.showTTT;
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
