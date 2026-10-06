import { Command } from "commander";

const program = new Command();

type TelegramResponse = {
    ok: boolean,
    result?: {
        message_id?: number
    }
    description?: string
}

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

    const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        }
    );

    const data = (await response.json()) as TelegramResponse;
    if (!data.ok) {
        console.error("Failed to send message:", data.description);
        process.exit(1);
    }
    
    const messageId = data.result?.message_id;
    console.log(`Sent Telegram message to chat: ${chatId}`);
    if (messageId !== undefined) {
        console.log(`Telegram message ID: ${messageId}`);
    }
  })


program.parseAsync(process.argv);