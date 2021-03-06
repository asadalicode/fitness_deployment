// `.env.ts` is generated by the `npm run env` command
// `npm run env` exposes environment variables as JSON for any usage you might
// want, like displaying the version or getting extra config from your CI bot, etc.
// This is useful for granularity you might need beyond just the environment.
// Note that as usual, any environment variables you expose through it will end up in your
// bundle, and you should not use it for any sensitive information like passwords or keys.
import { env } from './.env';

export const environment = {
  production: true,
  image_url: 'https://api.fitandmore.app',
  // image_url: 'https://backend-fitness.codesorbit.net',
  backendUrl: 'http://localhost:4300',
  version: env.npm_package_version + '-dev',
  serverUrl: 'https://api.fitandmore.app/api',
  // serverUrl: 'https://backend-fitness.codesorbit.net/api',
  sasGeneratorUrl: 'https://stottle-blob-storage-api.azurewebsites.net',
  sasURL:
    'https://fitandmorestorage.blob.core.windows.net/fit-n-more-free-content?sv=2020-08-04&ss=b&srt=sco&sp=rwdlacx&se=2023-11-16T23:13:13Z&st=2021-11-18T15:13:13Z&spr=https,http&sig=qSlovArDISHF1snEmgu%2BCZvhTEl9lI34QXq921Ex0rg%3D',
  storageAccount: 'fitandmorestorage',
  containerName: 'fit-n-more-free-content',
  Config: {
    sas:
      'https://fitandmorestorage.blob.core.windows.net/fit-n-more-free-content?sv=2020-08-04&ss=b&srt=sco&sp=rwdlacx&se=2023-11-16T23:13:13Z&st=2021-11-18T15:13:13Z&spr=https,http&sig=qSlovArDISHF1snEmgu%2BCZvhTEl9lI34QXq921Ex0rg%3D',
    storageAccount: 'fitandmorestorage',
    containerName: 'fit-n-more-free-content',
  },

  sasContainerUrl:
    'https://fitandmorestorage.blob.core.windows.net/fit-n-more-free-content',
  sasTokenUrl:
    '?sv=2020-08-04&ss=b&srt=sco&sp=rwdlacx&se=2023-11-16T23:13:13Z&st=2021-11-18T15:13:13Z&spr=https,http&sig=qSlovArDISHF1snEmgu%2BCZvhTEl9lI34QXq921Ex0rg%3D',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'es-ES'],
};
