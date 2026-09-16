const extAPI = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener("DOMContentLoaded", () => {
  const timeDisplay = document.getElementById("time-display");
  const globalToggle = document.getElementById("global-toggle");
  const providerList = document.getElementById("provider-list");
  const resetBtn = document.getElementById("reset-time-btn");

  extAPI.storage.local.get(
    {
      globalEnabled: true,
      disabledProviders: [],
      totalWaitTimeMs: 0,
    },
    (data) => {
      const totalSeconds = Math.floor(data.totalWaitTimeMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      timeDisplay.textContent = `${minutes}m ${seconds}s`;

      globalToggle.checked = data.globalEnabled;

      fetch(extAPI.runtime.getURL("manifest.json"))
        .then((response) => response.json())
        .then((manifest) => {
          const scripts = manifest.content_scripts[0].js;
          const providerScripts = scripts.filter((src) =>
            src.includes("/providers/"),
          );

          let loadedCount = 0;

          providerScripts.forEach((src) => {
            const script = document.createElement("script");
            script.src = extAPI.runtime.getURL(src);
            script.onload = () => {
              loadedCount++;
              if (loadedCount === providerScripts.length) {
                renderProviders(data.disabledProviders);
              }
            };
            document.body.appendChild(script);
          });
        });
    },
  );

  function renderProviders(disabledProviders) {
    if (window.LLMRegistry && window.LLMRegistry.providers) {
      window.LLMRegistry.providers.forEach((provider) => {
        const label = document.createElement("label");
        label.className = "toggle-row";

        const span = document.createElement("span");
        span.textContent = provider.name;

        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = "provider-toggle";
        input.value = provider.name;
        input.checked = !disabledProviders.includes(provider.name);

        input.addEventListener("change", () => {
          extAPI.storage.local.get({ disabledProviders: [] }, (currentData) => {
            let disabled = currentData.disabledProviders;

            if (input.checked) {
              disabled = disabled.filter((p) => p !== input.value);
            } else {
              if (!disabled.includes(input.value)) {
                disabled.push(input.value);
              }
            }

            extAPI.storage.local.set({ disabledProviders: disabled });
          });
        });

        label.appendChild(span);
        label.appendChild(input);
        providerList.appendChild(label);
      });
    }
  }

  globalToggle.addEventListener("change", (e) => {
    extAPI.storage.local.set({ globalEnabled: e.target.checked });
  });

  resetBtn.addEventListener("click", () => {
    extAPI.storage.local.set({ totalWaitTimeMs: 0 }, () => {
      timeDisplay.textContent = "0m 0s";
    });
  });
});
