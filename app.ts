import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { Logger, JSONTransport } from '@deepkit/logger';
import { HelloWorldControllerHttp } from './src/controller/hello-world.http';
import { HelloWorldControllerRpc } from './src/controller/hello-world.rpc';
import { Service } from './src/app/service';
import { AppConfig } from './src/app/config';

new App({
    config: AppConfig,
    controllers: [
        HelloWorldControllerHttp,
        HelloWorldControllerRpc,
    ],
    providers: [
        Service,
    ],
    imports: [new FrameworkModule({ debug: true })]
})
    .loadConfigFromEnv({ envFilePath: ['production.env', '.env'] })
    .setup((module, config: AppConfig) => {
        if (config.environment === 'production') {
            //enable logging JSON messages instead of formatted strings

            module.configureProvider<Logger>(v => v.addTransport(new JSONTransport));

            //disable debugging
            module.getImportedModuleByClass(FrameworkModule).configure({debug: false});
        }
    })
    .run();
