import {setupServer} from "./server";
import {setupDatabase} from "./database";


async function start(){
    await setupDatabase()
    await setupServer();
}
start()
