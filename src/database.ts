import {createConnection} from "typeorm";
import {config} from "./config";

export async function setupDatabase(){
     return createConnection(config.get<any>('typeorm'))
}
