const { Telegraf } = require('telegraf');

const bot = new Telegraf('7887478476:AAH_2kwqcMTkAGepshf84ftWeiLTLHLVaeQ');
bot.launch();
console.log("🚀 Bot ishga tushdi!");

bot.on('chat_join_request', async (ctx) => {
    const request = ctx.chatJoinRequest;
    const fullName = `${request.from.first_name || ''} ${request.from.last_name || ''}`.trim();
    const userId = request.from.id;
    const channelId = request.chat.id;

    console.log(`📥 Yangi so‘rov: ${fullName} (${userId})`);

    try {
        await ctx.telegram.approveChatJoinRequest(channelId, userId);
        await ctx.telegram.sendMessage(channelId, `🎉 <a href="tg://user?id=${userId}">${fullName}</a>, kanalga xush kelibsiz!`, {
            parse_mode: 'HTML'
        });

    } catch (error) {
        console.error('❌ So‘rovni qabul qilishda xatolik:', error);
    }
});

bot.start((ctx) => {
    return ctx.reply('Salom! Bu bot kanalga qo‘shiluvchilarni avtomatik qabul qiladi.');
});

module.exports = bot;
