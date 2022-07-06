// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

const debug = process.env.DEBUG;

let appWindow;

app.on("ready", ready);
app.on("window-all-closed", closeWindow);
app.on("activate", activate);

function ready() {
  appWindow = new BrowserWindow({
    title: "Fast tracing",
    fullScreenable: false,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, "./assets/logo/lm-logo.png"),
  });

  appWindow.setMenu(null);
  appWindow.maximize();
  appWindow.minimizable = false;
  appWindow.resizable = false;

  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "./index.html"),

      protocol: "file:",
      slashes: true,
    })
  );

  if (debug) {
    // if (true) {
    appWindow.webContents.openDevTools();
    appWindow.resizable = true;
    appWindow.fullScreenable = true;
  }

  /* SERVER */
  // var app = require("./server/bin/www")();
}

function activate() {
  if (appWindow === null) {
    ready();
  }
}

function closeWindow() {
  if (process.platform !== "darwin") {
    app.quit();
  }
  process.exit(0);
}
