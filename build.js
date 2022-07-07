const fs = require("fs");
const path = require("path");
const jsYaml = require("js-yaml");

const configsDir = path.join(__dirname, "configs");

const configs = fs.readdirSync(configsDir);

configs.forEach((configName) => {
  const eslintConfig = jsYaml.load(
    fs.readFileSync(path.join(configsDir, configName), "utf8")
  );

  // correct relative extends of yml
  if (eslintConfig && eslintConfig.extends) {
    eslintConfig.extends = eslintConfig.extends.map((_extends) => {
      /**
       * @type {string}
       */
      const extendedPath = _extends;
      if (
        extendedPath.startsWith("./") &&
        (extendedPath.endsWith(".yml") || extendedPath.endsWith(".yaml"))
      ) {
        return extendedPath.substr(0, extendedPath.lastIndexOf(".")) + ".js";
      }
      return extendedPath;
    });
  }

  const outputConfigName =
    configName.substr(0, configName.lastIndexOf(".")) + ".js";

  fs.writeFileSync(
    path.join(__dirname, outputConfigName),
    "module.exports = " + JSON.stringify(eslintConfig, null, 2)
  );
});
