const extAPI = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener("DOMContentLoaded", () => {
  const timeDisplay = document.getElementById("time-display");
  const globalToggle = document.getElementById("global-toggle");
  const providerToggles = document.querySelectorAll(".provider-toggle");

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

      providerToggles.forEach((toggle) => {
        toggle.checked = !data.disabledProviders.includes(toggle.value);
      });
    },
  );

  globalToggle.addEventListener("change", (e) => {
    extAPI.storage.local.set({ globalEnabled: e.target.checked });
  });

  providerToggles.forEach((toggle) => {
    toggle.addEventListener("change", () => {
      extAPI.storage.local.get({ disabledProviders: [] }, (data) => {
        let disabled = data.disabledProviders;

        if (toggle.checked) {
          disabled = disabled.filter((p) => p !== toggle.value);
        } else {
          if (!disabled.includes(toggle.value)) {
            disabled.push(toggle.value);
          }
        }

        extAPI.storage.local.set({ disabledProviders: disabled });
      });
    });
  });
});
