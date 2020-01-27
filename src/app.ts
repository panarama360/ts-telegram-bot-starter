import {buildBot, MetadataArgsStorage} from "ts-telegraf-decorators";
import Telegraf from "telegraf";
import {config} from "./config";
import {setupDatabase} from "./database";
import {regUser} from "./common/middlewares/RegUser";
import {getConnection} from "typeorm";

declare const module: any;
async function bootstrap(){
    try{
        getConnection();
    }catch (e) {
        await setupDatabase();
    }
    MetadataArgsStorage.reset();

    let entityContext = (require as any).context('.', true, /\.controller\.ts$/);
    const cla = entityContext.keys().map(id => {
        const entityModule = entityContext(id);
        const [entity] = Object.values(entityModule);
        return entity;
    });
    const bot = new Telegraf(config.get('token'));
    bot.use(regUser());
    buildBot({
        bot,
        controllers: cla
    });
    await bot.launch();

    if (module.hot != null) {
        module.hot.accept();
        module.hot.dispose(async () => {
        });
    }
}
bootstrap();
