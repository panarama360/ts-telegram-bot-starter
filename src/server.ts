import * as express from "express";
import { Database, Resource, UseAsTitle, UseForSearch } from "admin-bro-typeorm";
import { validate } from 'class-validator'

declare const module: any;
import AdminBro from "admin-bro";
import * as AdminBroExpress from "admin-bro-expressjs"
import {SiteEntity} from "./common/entity/Site.entity";
import {CategoryEntity} from "./common/entity/Category.entity";
import {ExtendedRecord} from "admin-bro-typeorm/lib/ExtendedRecord";
import {UserEntity} from "./common/entity/User.entity";
import {ReportEntity} from "./common/entity/Report.entity";
import {OfferEntity} from "./common/entity/Offer.entity";
import {config} from "./config";

Resource.validate = validate;
AdminBro.registerAdapter({ Database, Resource });

export async function setupServer(bot?: any){
    const adminBro = new AdminBro({
        branding: {
            companyName: 'Link Bot'

        },
        resources: [
            { resource: SiteEntity, options: {
                    name: 'Сайты',
                }},
            { resource: OfferEntity, options: {
                    name: 'Предложения',
                    sort: {
                        direction: 'desc',
                        sortBy: 'create'
                    }
                }},
            { resource: UserEntity, options: {
                    name: 'Пользователи',
                }},
            { resource: CategoryEntity, options: {
                name: 'Категории',
                }},
            { resource: ReportEntity, options: {
                name: 'Репорты',
                    sort: {
                        direction: 'desc',
                        sortBy: 'create'
                    }
                }},
        ],
        rootPath: '/admin',
    });


    const app = express();
    const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {

        authenticate: async (email, password) => {
            if(email == 'panarama360@gmail.com' && password == '848643')
                return true;
            if(email == 'any@bot.com' && password == 'nzkXV6tV3y')
                return true;
            return false;
        },
        cookiePassword: 'FSvYXqKVWeUefaTJmT8RsLM4AdfyH6a4nVTCQH5MBDQTpaNt4Lvtybvnp46J5XwYJHbwsRZnhq7c95xUhT3jdn8ykjkLyWrzjvmgU7bsVZgDAnznD23H47UwPZC9TQxE',
    });
    app.use(bot.webhookCallback('/FSvYXqKVWeUefaTJmT8RsLM4AdfyH6a4nVTCQH5MBDQTpaNt4Lvtybvnp46J5X'));
    try{
        await bot.telegram.deleteWebhook()
    }catch (e) {

    }
    await bot.telegram.setWebhook(config.get('url')+'/FSvYXqKVWeUefaTJmT8RsLM4AdfyH6a4nVTCQH5MBDQTpaNt4Lvtybvnp46J5X');
    app.use(adminBro.options.rootPath, router);
    return app.listen(8000);
}
