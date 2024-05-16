"use strict";

const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const ignore = require("ignore");

function activate(context) {
  if (!vscode.workspace.workspaceFolders) {
    return;
  }

  let ignoreList = ignore();
  const workspaceFolder = vscode.workspace.workspaceFolders[0];
  const ignoreFilePath = path.join(workspaceFolder.uri.fsPath, ".gitignore");

  if (fs.existsSync(ignoreFilePath)) {
    const ignoreContent = fs.readFileSync(ignoreFilePath, "utf8");
    ignoreList = ignore().add(ignoreContent);
  }

  const fileSystemWatcher = vscode.workspace.createFileSystemWatcher(
    "**/*",
    false,
    false,
    false
  );

  fileSystemWatcher.onDidCreate(async (event) => {
    if (path.basename(event.path) === ".gitkeep") {
      return;
    }
    if (
      ignoreList.ignores(
        event.fsPath.replace(workspaceFolder.uri.fsPath, "").slice(1)
      )
    ) {
      return;
    }
    const gitkeepPath = event.with({
      path: path.join(path.dirname(event.path), ".gitkeep"),
    });
    if (fs.existsSync(gitkeepPath.fsPath)) {
      await vscode.workspace.fs.delete(gitkeepPath);
    }
    const stats = await vscode.workspace.fs.stat(event);
    if (stats.type === vscode.FileType.Directory) {
      const directoryContents = await vscode.workspace.fs.readDirectory(event);
      if (directoryContents.length === 0) {
        createGitkeepFile(event.path);
      }
    } else if (
      event.path.replace(workspaceFolder.uri.fsPath, "") === "/.gitignore"
    ) {
      refreshIgnoreList(false);
    }
  });

  fileSystemWatcher.onDidChange(async (event) => {
    if (event.path.replace(workspaceFolder.uri.fsPath, "") === "/.gitignore") {
      refreshIgnoreList(false);
    }
  });

  fileSystemWatcher.onDidDelete(async (event) => {
    const directoryPath = path.dirname(event.path);
    if (
      ignoreList.ignores(
        event.fsPath.replace(workspaceFolder.uri.fsPath, "").slice(1)
      )
    ) {
      return;
    }
    const directoryContents = await vscode.workspace.fs.readDirectory(
      event.with({ path: directoryPath })
    );
    if (directoryContents.length === 0) {
      createGitkeepFile(directoryPath);
    } else if (
      event.path.replace(workspaceFolder.uri.fsPath, "") === "/.gitignore"
    ) {
      refreshIgnoreList(true);
    }
  });

  context.subscriptions.push(fileSystemWatcher);

  vscode.commands.registerCommand("extension.addGitKeep", () => {
    generateAndCheckDirectories(workspaceFolder.uri);
  });

  async function createGitkeepFile(filePath) {
    await vscode.workspace.fs.writeFile(
      workspaceFolder.uri.with({
        path: path.join(filePath, ".gitkeep"),
      }),
      new Uint8Array()
    );
  }

  function generateAndCheckDirectories(uri) {
    if (
      uri.fsPath !== workspaceFolder.uri.fsPath &&
      ignoreList.ignores(
        uri.fsPath.replace(workspaceFolder.uri.fsPath, "").slice(1)
      )
    ) {
      return;
    }

    vscode.workspace.fs
      .readDirectory(uri)
      .then((directoryContents) => {
        if (directoryContents.length === 0) {
          createGitkeepFile(uri.path); // Ensure this matches the function definition
        } else {
          directoryContents.forEach(([name, fileType]) => {
            if (fileType === vscode.FileType.Directory) {
              generateAndCheckDirectories(
                uri.with({ path: path.join(uri.path, name) })
              );
            }
          });
        }
      })
      .catch((error) => {
        console.error(`Error reading directory: ${error}`);
      });
  }

  async function refreshIgnoreList(clear) {
    if (clear) {
      return ignore();
    } else {
      const ignoreURL = workspaceFolder.uri.with({
        path: path.join(workspaceFolder.uri.fsPath, ".gitignore"),
      });
      const ignoreContent = await vscode.workspace.fs.readFile(ignoreURL);
      return ignore().add(ignoreContent.toString());
    }
  }
}

module.exports = { activate };
