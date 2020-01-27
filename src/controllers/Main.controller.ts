import {Start, TFContext, TFController} from "ts-telegraf-decorators";

@TFController()
export class MainController {
    @Start()
    start(@TFContext()ctx){
        console.log('1212')
        ctx.session.start = 123;
    }
}
