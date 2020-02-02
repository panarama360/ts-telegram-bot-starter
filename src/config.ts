import * as conf from 'dotenv';
conf.config();
import * as convict from 'convict';
import {MetadataArgsStorage} from "ts-telegraf-decorators";
const schema = {
    environment: {
        doc: 'The applicaton environment',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV',
        arg: 'node_env',
    },
    token:{
        env: 'TOKEN',
        arg: 'token',
        default: ''
    },
    url: {
        arg: 'url',
        default: ''
    },
    program: {
        doc: 'The program which runs code',
        format: ['node', 'tsnode', 'webpack', 'production'],
        default: 'node',
        env: 'PROGRAM',
        arg: 'program',
    },
    port: {
        format: 'port',
        default: 3000,
        env: 'PORT',
        arg: 'port',
    },
    dev: {
        default: true,
    },
    connection: {
        env: 'DATABASE_URL',
        arg: 'DATABASE_URL',
        default: ''
    },
    typeorm: {
        keepConnectionAlive: {
            default: true,
        },
        type: {
            default: 'postgres',
            env: 'TYPEORM_CONNECTION',
            arg: 'typeorm_connection',
        },
        host: {
            default: 'localhost',
        },
        username: {
            default: 'postgres',
        },
        password: {
            env: 'TYPEORM_PASSWORD',
            default: '',
        },
        database: {
            default: '',
            env: 'TYPEORM_DATABASE',
            arg: 'typeorm_database',
        },
        synchronize: {
            default: true,
            format: Boolean,
        },
        logging: {
            default: true,
            format: Boolean,
        },
        entities: {
            default: ['src/**/*.entity.{ts,js}'],
        },
    }
}

export const config = convict(schema).validate();
if (config.get('program') === 'webpack') {
    // @ts-ignore
    let entityContext = require.context('.', true, /\.entity\.ts$/);
    config.set('typeorm.entities', entityContext.keys().map(id => {
        const entityModule = entityContext(id);
        const [entity] = Object.values(entityModule);
        return entity;
    }));

}
if (config.get('environment') !== 'development') {
    config.set('dev', false);
}
if (config.get('environment') === 'test') {
    config.set('typeorm.keepConnectionAlive', false);
}
