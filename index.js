'use strict';
class ServerlessPlugin {

    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;

        this.commands = {
            toJson: {
                usage: 'Exports the configuration to Json',
                lifecycleEvents: [
                    'exportConfigurationToJson'
                ],
                options: {
                    keys: {
                        usage: 'Specify the keys (comma delimited) to export (e.g. --keys environment,resources or -k environment,resources)',
                        required: false,
                        shortcut: 'k',
                    },
                }
            }
        };

        this.hooks = {
            'before:toJson:exportConfigurationToJson': this.exportConfigurationToJson.bind(this)
        };
    }

    exportConfigurationToJson() {
        let res = {};

        let resolve = (v) => this.serverless.variables.populateProperty(v);

        let config = [
            {
                key: 'service',
                src: this.serverless.service.service,
                type: 'S'
            },
            {
                key: 'package',
                src: this.serverless.service.package,
                type: 'S'
            },
            {
                key: 'environment',
                src: this.serverless.service.provider.environment,
                type: 'M'
            },
            {
                key: 'functions',
                src: this.serverless.service.functions,
                type: 'M'
            },
            {
                key: 'custom',
                src: this.serverless.service.custom,
                type: 'M'
            },
            {
                key: 'resources',
                src: this.serverless.service.resources,
                type: 'M'
            }
        ];

        let exports;

        if (!this.options.keys) {
            exports = config;
        } else {
            let keysWanted = this.options.keys.split(',');
            exports = config.filter((entry) => {
                return keysWanted.indexOf(entry.key) >= 0;
            });
        }

        exports.forEach((entry) => {
            let type = entry.type;
            switch (type) {
                case 'M':
                    res[entry.key] = {};
                    if (entry.src) {
                        for (let key in entry.src) {
                            if (entry.src.hasOwnProperty(key)) {
                                res[entry.key][key] = resolve(entry.src[key]);
                            }
                        }
                    }
                    break;
                case 'S':
                    res[entry.key] = entry.src;
                    break;
                default:
                    throw new Error(`Illegal export type found: '${type}'`);
            }
        });

        console.log(JSON.stringify(res, null, 2));
    }
}

module.exports = ServerlessPlugin;
