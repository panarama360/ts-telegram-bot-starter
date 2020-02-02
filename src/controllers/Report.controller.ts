import {Hears, Leave, On, TFContext, TFWizard, TFWizardStep} from "ts-telegraf-decorators";
import {ContextMessageUpdate, Markup} from "telegraf";
import {Buttons} from "../common/Text";
// import {getFromContainer} from "ts-telegraf-decorators";
import {MainController} from "./Main.controller";
import Container from "typedi";
import {ReportEntity} from "../common/entity/Report.entity";

@TFWizard('report')
export class ReportController {

    @TFWizardStep(1)
    start(@TFContext()ctx: any){
        const keyboard = Markup
            .keyboard([
                [Buttons.main],
            ])
            .resize()
            .extra();
        ctx.reply('Напишите нам соощение о нарушении которые вы заметили на ресурсах которые мы показываем:', keyboard)
        return ctx.wizard.next();
    }

    @TFWizardStep(2)
    @On('text')
    async report(@TFContext()ctx: any){
        let reportEntity = new ReportEntity();
        reportEntity.text = ctx.message.text;
        reportEntity.user = (ctx as any).user;
        await reportEntity.save()
        ctx.reply('Спасибо за сообщение, мы расмотрим и примим меры. ID репорта:  <b>'+reportEntity.id+'</b>', {
            parse_mode: "HTML"
        });
        return this.leave(ctx);
    }

    // @Leave()
    @Hears(Buttons.main)
    async leave(@TFContext()ctx: any){

        await ctx.scene.leave()
        await Container.get(MainController).start(ctx)
    }
}
