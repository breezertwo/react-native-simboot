"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  simboot: () => simboot
});
module.exports = __toCommonJS(src_exports);

// src/ios/configuration.ts
var import_fs = __toESM(require("fs"));

// src/util/errorFn.ts
var errorFn = (method, msg) => {
  console.error(`\x1B[31m${method} failed with:
${msg}`);
  process.exit(1);
};

// src/util/runCmd.ts
var import_child_process = require("child_process");
var run = (commandLine) => new Promise((resolve, reject) => {
  const [command, ...args] = commandLine.split(/\s+/);
  const child = (0, import_child_process.spawn)(command, args);
  const output = [];
  child.stdout.on("data", (chunk) => output.push(chunk));
  child.on("close", () => resolve(output.join("").trim()));
  child.on("error", (error) => reject(error));
});

// src/ios/configuration.ts
var getConfigurations = (_xcodeprojPath) => __async(void 0, null, function* () {
  var _a;
  try {
    let xcodeproj = _xcodeprojPath || getXCodeProjectPath();
    const out = yield run(`xcodebuild -list -project ${xcodeproj} -json`);
    const xcodeConfig = JSON.parse(out);
    if ((_a = xcodeConfig == null ? void 0 : xcodeConfig.project) == null ? void 0 : _a.configurations) {
      return xcodeConfig.project.configurations;
    }
    errorFn("[getConfigurations]", "No configurations found in Xcode project");
  } catch (error) {
    const errorMessage = `
      Couldn't get configurations from Xcode project.
      Make sure you are in the root of your project and ios folder exists.
      If you are using a custom path, make sure its correct.`;
    errorFn("[getConfigurations]", errorMessage);
  }
});
var getXCodeProjectPath = () => {
  try {
    return import_fs.default.readdirSync("ios", { withFileTypes: true }).map((item) => item.name).filter((item) => item.indexOf("xcodeproj") !== -1)[0];
  } catch (error) {
    errorFn(
      "[getConfigurations]",
      "iOS project folder not found. Make sure you are in the root of your project and ios folder exists. If you are using a custom path, make sure to configure it in the config file."
    );
  }
};

// src/ios/ios.ts
var runIOS = (xcodeprojPath) => __async(void 0, null, function* () {
  const configs = yield getConfigurations(xcodeprojPath);
  console.log("Configurations found:", configs);
});

// src/util/info.ts
var import_path = __toESM(require("path"));
var parseConfig = (config) => ({
  root: required(config.root, "root"),
  xcodeprojPath: () => {
    var _a;
    const iosProject = required((_a = config == null ? void 0 : config.project) == null ? void 0 : _a.ios, "project.ios");
    return iosProject.xcodeprojPath || import_path.default.join(
      required(iosProject.sourceDir, "project.ios.sourceDir"),
      required(iosProject.xcodeProject, "project.ios.xcodeProject").name.replace(".xcworkspace", ".xcodeproj")
    );
  },
  pbxprojPath: () => {
    var _a;
    const iosProject = required((_a = config == null ? void 0 : config.project) == null ? void 0 : _a.ios, "project.ios");
    return iosProject.pbxprojPath || import_path.default.join(
      required(iosProject.sourceDir, "project.ios.sourceDir"),
      required(iosProject.xcodeProject, "project.ios.xcodeProject").name.replace(".xcworkspace", ".xcodeproj"),
      "project.pbxproj"
    );
  },
  buildGradlePath: () => {
    var _a;
    const androidProject = required((_a = config == null ? void 0 : config.project) == null ? void 0 : _a.android, "project.android");
    return import_path.default.join(
      required(androidProject.sourceDir, "project.android.sourceDir"),
      required(androidProject.appName, "project.android.appName"),
      "build.gradle"
    );
  }
});
var required = (value, name) => {
  if (!value) {
    throw new Error(`Missing required value: ${name}, found: ${value}`);
  }
  return value;
};

// src/index.ts
var simboot = (config, args) => __async(void 0, null, function* () {
  console.log("\u{1F3C3} Running boot script");
  const info = parseConfig(config);
  console.log("\u{1F4F1} Collecting infos... \u2615\uFE0F");
  console.log("\u{1F4F1} Project root:", info.root);
  if (args.ios) {
    console.log("\u{1F34F} Running iOS script");
    yield runIOS(args.iosXcodeprojPath || info.xcodeprojPath());
  }
  if (args.android) {
    console.log("\u{1F4F1} Android project:", info.buildGradlePath());
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  simboot
});
