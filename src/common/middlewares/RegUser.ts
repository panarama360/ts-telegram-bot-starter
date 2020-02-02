import {ContextMessageUpdate, Context} from "telegraf";
import {UserEntity} from "../entity/User.entity";
export function regUser(firstLogin?: (ctx: Context)=>void) {
    return async (ctx: ContextMessageUpdate, next)=> {
        if (!ctx.chat || !ctx.from) {
            await next();
            return
        }
        let user = await UserEntity.findOne({
            chatId: ctx.chat.id
        });
        if (!user) {

            // const parent = await UserEntity.findOne({
            //     chatId: refId
            // })
            user = new UserEntity({
                chatId: ctx.message.from.id,
                isBot: ctx.message.from.is_bot,
                firstName: ctx.message.from.first_name,
                username: ctx.message.from.username,
                lastName: ctx.message.from.last_name,
                languageCode: ctx.message.from.language_code,
            });
            let refId = ctx.message.text.split(' ')[1];
            if(refId && Number.isInteger(+refId))
                user.parentRef = await UserEntity.findOne({
                    chatId: +refId
                })
            await user.save();
            (ctx as any).firstStart = true;
            if(firstLogin)
                firstLogin(ctx);

        }
        (ctx as any).user = user;

        await next();
        await UserEntity.update({
            id: user.id
        },{
            session: (ctx as any).session
        });

    }
}
