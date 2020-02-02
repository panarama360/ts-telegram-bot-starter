import {createConnection} from "typeorm";
import {config} from "./config";

export async function setupDatabase(){
     const url = config.get<any>('connection').trim();
     if(url.length)
          return createConnection({
               "type": "postgres",
               "url": url,
               "synchronize": true,
               "logging": false,
               entities: config.get<any>('typeorm.entities')
          })
     else
          return createConnection(config.get<any>('typeorm'))
}
