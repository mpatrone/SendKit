import { 
    telegramMessageOutputSchema,
    telegramMessageOptionsSchema,
    telegramSendMessageRequestSchema,
    telegramSendMessageResponseSchema,
    type TelegramMessageOptions, 
    type TelegramMessageOutput 
} from "./schemas";

export async function sendTelegramMessage(
    input: TelegramMessageOptions): Promise<TelegramMessageOutput> {
        const parsedInput = telegramMessageOptionsSchema.parse(input);
        const requestBody = telegramSendMessageRequestSchema.parse({
            chat_id: parsedInput.chatId,
            text: parsedInput.message
        });

        const response = await fetch(`https://api.telegram.org/bot${parsedInput.botToken}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: await Response.json(requestBody).text()
        });
        const responseData = await response.json();
        const parsedResponse = telegramSendMessageResponseSchema.parse(responseData);

        if (!parsedResponse.ok || !parsedResponse.result) {
            throw new Error(parsedResponse.description ?? "Failed to send Telegram message");
        }

        return telegramMessageOutputSchema.parse({
            ok: true,
            chatId: parsedInput.chatId,
            messageId: parsedResponse.result.message_id
        });
}