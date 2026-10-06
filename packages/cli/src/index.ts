import { Command } from "commander";
import { sendTelegramMessage } from "sendkit-core";

const program = new Command();

program
  .name("sendkit")
  .description("CLI for Sendkit")
  .command("telegram")
  .description("Send a Telegram message")
  .argument("<chatId>", "ID of the chat to send the message to")
  .argument("<message>", "Message to send")
  .action(async (chatId: string, message: string) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
        console.error("Telegram bot token is not set.");
        process.exit(1);
    }

    if (!chatId || !message) {
        console.error("Chat ID and message are required.");
        process.exit(1);
    }

    if (!message) {
        console.error("Message is required.");
        process.exit(1);
    }

    try {
        const response = await sendTelegramMessage({
            botToken: token,
            chatId,
            message
        });

        console.log(`Sent Telegram message to chat: ${response.chatId}`);
        console.log(`Message content: ${response.messageId}`);

    } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        console.error(`Telegram API request failed: ${detail}`);
        process.exit(1);
    }

    // Removed redundant code as it is already handled inside the try-catch block above.
  })


program.parseAsync(process.argv);