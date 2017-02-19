# Serverless Config As Json

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

Serverless plugin to export a resolved serverless.yml configuration to Json on the terminal.

Intended to be used as part of a serverless toolchain.

```
# Export the entire configuration
sls toJson

# Export a single key
sls toJson -k environment

# Export multiple keys
sls toJson -k environment,resources
```

