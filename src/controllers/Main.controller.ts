import {Action, Hears, Start, TFContext, TFController} from "ts-telegraf-decorators";
import {ContextMessageUpdate, Markup} from "telegraf";
import {Buttons} from "../common/Text";
import {getTreeRepository, IsNull} from "typeorm";
import {CategoryEntity} from "../common/entity/Category.entity";
import {from, of} from 'rxjs';
import {take, bufferCount, toArray, map, filter} from "rxjs/operators";
import {SiteEntity} from "../common/entity/Site.entity";

@TFController()
export class MainController {
    @Hears(Buttons.main)
    @Start()
    start(@TFContext()ctx: ContextMessageUpdate){
        const user = (ctx as any).user;
        const firstStart = (ctx as any).firstStart;
        const keyboard = Markup
            .keyboard([
                [Buttons.category],
                [Buttons.add, Buttons.report], // Row1 with 2 buttons

            ])
            .resize()
            .extra();
        if(firstStart){
            return  ctx.reply('Добро пожаловать!', keyboard)
        }

        return ctx.reply('👌', keyboard)
    }
    @Action('category')
    @Hears(Buttons.category)
    async showCategory(@TFContext()ctx: ContextMessageUpdate){
        // let categoryButtons = await getTreeRepository(CategoryEntity)
        //     .findTrees()
        let categoryButtons = await CategoryEntity
            .find()
            .then(value => from(value)
                .pipe(
                    filter(value1 => value1.show),
                    map(value1 => Markup.callbackButton(value1.name, 'selectCategory:'+value1.id+':0')),
                    bufferCount(3),
                    toArray()
                ).toPromise());
        if(ctx.callbackQuery)
            ctx.editMessageText('*Категории*',{
                parse_mode: 'MarkdownV2',
                reply_markup: Markup.inlineKeyboard(categoryButtons as any)
            });
        else
            ctx.reply('*Категории*',{
                parse_mode: 'MarkdownV2',
                reply_markup: Markup.inlineKeyboard(categoryButtons as any)
            });
    }

    @Action(/selectCategory:(\d+):(\d+)/)
    async showSites(@TFContext()ctx: ContextMessageUpdate){
        console.log(ctx.match);
        const idCategory = ctx.match[1]
        const category = await CategoryEntity.findOne(idCategory);
        const page = ctx.match[2]
        const sites = await SiteEntity.createQueryBuilder('site')
            .where('site.category = :id and site.show = :show', {id: idCategory, show: true})
            .getMany()
            .then(value => from(value)
            .pipe(
                map(value1 => Markup.callbackButton(value1.name, 'site:'+value1.id+':0')),
                bufferCount(2),
                toArray()
            ).toPromise());
        sites.push([Markup.callbackButton(Buttons.back, 'category')])
        ctx.editMessageText('Категории/*'+category.name+'*',{
            parse_mode: 'MarkdownV2',
            reply_markup: Markup.inlineKeyboard(sites as any)
        });
    }

    @Action(/site:(\d+):(\d+)/)
    async selectSite(@TFContext()ctx: ContextMessageUpdate){
        const idSite = ctx.match[1]
        const site = await SiteEntity.findOne({
            id: +idSite,
        }, {relations: ['category']})
        let buttons = [];
        try{
            buttons = site.buttons.map(value => Markup.urlButton(value.text, value.url))
        }catch (e) {
        }
        ctx.editMessageText('Категории/'+site.category.name+'/<b>'+site.name+'</b>\n\n'+site.text,{
            parse_mode: 'HTML',
            reply_markup: Markup.inlineKeyboard([
                buttons,
                [Markup.callbackButton(Buttons.back, 'selectCategory:'+site.category.id+':0')]
            ])
        });
    }

    @Hears(Buttons.report)
    report(@TFContext()ctx){
        return ctx.scene.enter('report')
    }

    @Hears(Buttons.add)
    offer(@TFContext()ctx){
        return ctx.scene.enter('offer')
    }
}
