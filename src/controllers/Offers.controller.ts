import {Hears, Leave, On, TFContext, TFWizard, TFWizardStep} from "ts-telegraf-decorators";
import {ContextMessageUpdate, Markup} from "telegraf";
import {Buttons} from "../common/Text";
// import {getFromContainer} from "ts-telegraf-decorators";
import {MainController} from "./Main.controller";
import Container from "typedi";
import {ReportEntity} from "../common/entity/Report.entity";
import {OfferEntity} from "../common/entity/Offer.entity";

@TFWizard('offer')
export class ReportController {

    @TFWizardStep(1)
    start(@TFContext()ctx: any){
        const keyboard = Markup
            .keyboard([
                [Buttons.main],
            ])
            .resize()
            .extra();
        ctx.reply('Отправте нам рессурс который хоте ли бы добавить, только onion ссылки и описание:', keyboard)
        return ctx.wizard.next();
    }

    @TFWizardStep(2)
    @On('text')
    async report(@TFContext()ctx: ContextMessageUpdate){
        let offerEntity = new OfferEntity();
        offerEntity.text = ctx.message.text;
        offerEntity.user = (ctx as any).user;
        await offerEntity.save()
        ctx.reply('Спасибо за предложение. ID предложения:  <b>'+offerEntity.id+'</b>', {
            parse_mode: "HTML"
        });
        return this.leave(ctx);
    }

    @Hears(Buttons.main)
    async leave(@TFContext()ctx: any){

        await ctx.scene.leave()
        await Container.get(MainController).start(ctx)
    }
}
