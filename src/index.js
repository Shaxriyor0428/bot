const { Telegraf, session } = require('telegraf');

const bot = new Telegraf('HERE IS BOT TOKEN');

try {
    bot.use(async (ctx, next) => {
        return next();
    });
    bot.use(session());
} catch (error) {
    console.error("❌ Failed to initialize session middleware:", error);
}

bot.launch();
console.log("🚀 Bot ishga tushdi!");

bot.on('chat_join_request', async (ctx) => {
    const request = ctx.chatJoinRequest;
    const fullName = `${request.from.first_name || ''} ${request.from.last_name || ''}`.trim();
    const userChatId = request.user_chat_id;
    const channelId = request.chat.id;

    console.log('📥 Join request:', fullName, userChatId);

    // ✅ Adminga xabar yuboriladi
    await ctx.telegram.sendMessage(5995279818, `📥 Yangi so‘rov: ${fullName}`, {
            reply_markup: {
        inline_keyboard: [
            [
                {
                    text: '✅ Qabul qilish',
                    callback_data: `approve_${channelId}_${userChatId}`
                }
            ]
        ]
    }

    });
});
bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;

    if (data.startsWith('approve_')) {
        const [_, chatIdRaw, userChatIdRaw] = data.split('_');

        const chatId = Number(chatIdRaw);
        const userId = Number(userChatIdRaw);

        try {
            // ✅ Foydalanuvchini qabul qilish
            await ctx.telegram.approveChatJoinRequest(chatId, userId);

            // ✅ Adminga javob qaytarish
            await ctx.answerCbQuery('✅ Qabul qilindi!');
            await ctx.editMessageText('✅ Foydalanuvchi kanalga qo‘shildi');

            // ✉️ Kanalga xabar yuborish
            await ctx.telegram.sendMessage(chatId, `🎉 <a href="tg://user?id=${userId}">Xush kelibsiz!</a>`, {
                parse_mode: 'HTML'
            });

        } catch (err) {
            console.error('❌ Approve xatoligi:', err);
            await ctx.answerCbQuery('❌ Xatolik: ' + err.description);
        }
    }
});



bot.start(async (ctx) => {
    console.log(ctx.from.id);
    return ctx.reply('Hello, world!');
});

bot.on('message', async (ctx) => {
    console.log(ctx.from.id);
    return ctx.reply('Hello, world!');
});

module.exports = bot;
