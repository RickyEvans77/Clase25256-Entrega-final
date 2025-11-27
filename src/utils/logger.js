import chalk from "chalk";

export const logInfo = (msg) => console.log(chalk.cyanBright(`ℹ️ ${msg}`));
export const logSuccess = (msg) => console.log(chalk.greenBright(`✅ ${msg}`));
export const logError = (msg) => console.log(chalk.bgRed.white(`❌ ${msg}`));
