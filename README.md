# [Your Extension Name]

This is a quick-start template for building browser extensions that inject custom content into LLM wait states. It is powered by the [llm-wait-injector](https://github.com/SalvadorCorreia/llm-wait-injector) engine.

## Setup

1. Click the **Use this template** button on GitHub to create your own repository.
2. Clone your new repository to your local machine.
3. Initialize the core engine by running this command in the project root:
   ```bash
   git submodule update --init

   ```

## Development

This repository is your workspace. The core engine is safely isolated in the `core/` directory.

* `payload/`: Edit `index.js` and `style.css` to build your custom injection.
* `manifest.json`: Update your extension name, descriptions, and permissions. Ensure all core scripts point to the `core/` directory.
* `icons/`: Replace the default images with your own extension icons.

To test the extension:

* **Chrome/Edge:** Go to `chrome://extensions/`, enable "Developer mode", and click "Load unpacked". Select the root folder of this repository.
* **Firefox:** Go to `about:debugging#/runtime/this-firefox` and click "Load Temporary Add-on". Select any file in this repository.

## Updating the Core Engine

To receive bug fixes and new LLM providers from the core engine without affecting your custom files, run:

```bash
git submodule update --remote

```

## License

This template is provided under the [MIT License](https://www.google.com/search?q=LICENSE). You can replace the root `LICENSE` file with one that fits your project. The core engine inside the `core/` directory retains its original license.
