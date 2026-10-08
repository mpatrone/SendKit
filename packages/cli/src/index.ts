import { Command } from "commander";
import { sendTelegramMessage } from "sendkit-core";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import {z} from "zod";

const program = new Command();
const configPath = join(homedir(), ".config", "sendkit", "config.json");
const cliConfigSchema = z.object({
  telegramBotToken: z.string().min(1).optional()
});

function writeTelegramBotToken(token: string) { 
    mkdirSync(dirname(configPath), { recursive: true });
    writeFileSync(configPath, `${JSON.stringify({ telegramBotToken: token }, null, 2)}\n`, {
        mode: 0o600
    });
}

function getTelegramBotToken() {
    if (!existsSync(configPath)) {
        throw new Error("Telegram bot token is not set in the config.");
    }
    const rawConfig = readFileSync(configPath, "utf-8");
    const config = cliConfigSchema.parse(JSON.parse(rawConfig));
    if (!config.telegramBotToken) {
        throw new Error("Telegram bot token is not set in the config.");
    }
    return config.telegramBotToken;
}

program
  .name("sendkit")
  .command("init")
  .description("SendKit CLI backed by sendkit-core")
  .requiredOption("-t, --telegram-bot-token <token>", "Telegram bot token")
  .action(async (options: { telegramBotToken: string }) => {
    writeTelegramBotToken(options.telegramBotToken);
    console.log(`Saved SendKit CLI config to ${configPath }`)
  });

program
  .command("telegram")
  .description("Send a Telegram message")
  .argument("<chatId>", "ID of the chat to send the message to")
  .argument("<message>", "Message to send")
  .action(async (chatId: string, message: string) => {
    const token = getTelegramBotToken();

    const response = await sendTelegramMessage({
    botToken: token,
    chatId,
    message,
    });

    console.log(JSON.stringify(response, null, 2));

  });

await program.parseAsync(process.argv).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
});
