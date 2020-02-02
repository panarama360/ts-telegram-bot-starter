import {buildBot, MetadataArgsStorage} from "ts-telegraf-decorators";
import Telegraf from "telegraf";
import {config} from "./config";
import {setupDatabase} from "./database";
import {regUser} from "./common/middlewares/RegUser";
import {getConnection} from "typeorm";
import {setupServer} from "./server";
import {Container} from "typedi";

declare const module: any;
async function bootstrap(){
    try{
        getConnection();
    }catch (e) {
        await setupDatabase();
    }
    MetadataArgsStorage.reset();
    console.log(config.get('dev'));
    let cla;
    if(config.get('dev')) {
        let entityContext = (require as any).context('.', true, /\.controller\.ts$/);
        cla = entityContext.keys().map(id => {
            const entityModule = entityContext(id);
            const [entity] = Object.values(entityModule);
            return entity;
        });
    }
    const bot = new Telegraf(config.get('token'));
    bot.use(regUser());
    buildBot({
        bot,
        container: Container,
        controllers: config.get('dev') ? cla: [__dirname+'/controllers/**.ts']
    });
    let server;
    if(config.get('dev')) {
        await bot.launch();
        // server = await setupServer(bot);
    }
    else
        server = await setupServer(bot);

    if (module.hot != null) {
        module.hot.accept();
        module.hot.dispose(async () => {
            if(server) server.close()
        });
    }
}
bootstrap();
