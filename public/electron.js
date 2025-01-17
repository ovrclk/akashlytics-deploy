// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const winston = require("winston");
const url = require("url");
const isDev = require("electron-is-dev");
// const { autoUpdater } = require("electron-updater");

const Sentry = require("@sentry/electron");

const appVersion = app.getVersion();
const appEnv = isDev ? "development" : "production";
let startUrl = process.env.ELECTRON_START_URL;

Sentry.init({
  dsn: "https://fc8f0d800d664154a0f1babe0e318fbb@o877251.ingest.sentry.io/5827747",
  environment: appEnv,
  release: appVersion
});

// app.on("ready", () => {
//   autoUpdater.checkForUpdatesAndNotify();
// });

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.File({ filename: "electron.log" })]
});

logger.info("isDev " + isDev);

logger.info("Loaded electron (app version " + appVersion + ")");

function createWindow() {
  try {
    logger.info("Creating Browser Window");
    const icon = path.join(__dirname, "icon.png");

    logger.info("icon: " + icon);

    // Create the browser window.
    const mainWindow = new BrowserWindow({
      title: "Akashlytics Deploy",
      width: 1024,
      height: 768,
      minWidth: 991,
      minHeight: 743,
      icon: icon,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        webSecurity: !isDev,
        additionalArguments: [appVersion, appEnv]
      }
    });

    //mainWindow.removeMenu();

    logger.info("Created Browser Window");

    if (isDev) {
      mainWindow.webContents.openDevTools();
    } else {
      startUrl = url.format({
        pathname: path.join(__dirname, "./index.html"),
        protocol: "file:",
        slashes: true
      });
    }

    logger.info(`Start url: ${startUrl}`);

    mainWindow.loadURL(startUrl);

    // autoUpdater.on("update-available", () => {
    //   mainWindow.webContents.send("update_available");
    // });
    // autoUpdater.on("update-downloaded", () => {
    //   mainWindow.webContents.send("update_downloaded");
    // });

    // ipcMain.on("restart_app", () => {
    //   autoUpdater.quitAndInstall();
    // });

    ipcMain.on("isDev", (event, arg) => {
      event.reply("isDev", isDev);
    });
  } catch (error) {
    logger.error(error);
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  logger.info("Creating window");

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
