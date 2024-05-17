# GitKeep Generator Extension for Visual Studio Code

## Overview

The GitKeep Generator is a Visual Studio Code extension developed by Harsh Vandana Sharma. Designed to automate the creation of `.gitkeep` files in empty directories within your project, it leverages the `.gitignore` file to determine which directories are considered empty and thus require a `.gitkeep` file. This process helps maintain a clean and organized repository structure, ensuring that all directories tracked by Git are intentional.

## Features

- Automatically generates `.gitkeep` files in empty directories based on the `.gitignore` file.
- Supports recursive scanning of directories to find empty folders.
- Updates the `.gitignore` file dynamically to reflect changes in the project structure.

## Installation

To install the GitKeep Generator extension, follow these steps:

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the square icon on the sidebar or pressing `Ctrl+Shift+X`.
3. Search for "GitKeep Generator".
4. Click on the Install button next to the extension in the search results.

## Usage

Once installed, the extension works automatically in the background. It monitors your workspace for changes and applies the following rules:

- If a new directory is created and is empty according to the `.gitignore` file, a `.gitkeep` file is added to prevent the directory from being ignored by Git.
- If an existing empty directory is deleted, the corresponding `.gitkeep` file is also removed.
- If the `.gitignore` file is modified, the extension updates its internal list of ignored patterns accordingly.

## Commands

The extension provides a command to manually trigger the generation of `.gitkeep` files across the entire workspace:

- Command ID: `extension.addGitKeep`
- Description: Generates `.gitkeep` files in empty directories based on the current `.gitignore` settings.

## Troubleshooting

- Ensure that the `.gitignore` file is correctly formatted and located at the root of your project.
- If the extension does not seem to be working, verify that your workspace folders are correctly set up in VS Code.
- Check the Output panel in VS Code for any errors or warnings related to the extension.

## Contributing

Contributions to improve the GitKeep Generator extension are welcome. Please feel free to submit pull requests or open issues on the GitHub repository.

## License

This extension is released under the MIT License. See the [LICENSE](LICENSE) file for more details.

---
