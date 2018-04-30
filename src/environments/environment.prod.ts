export const environment = {
  production: true,
  ace: {
    baseUri: '/assets/ace-builds/src-min',
    theme: 'xcode'
  },
  bitbucket: {
    baseUri: 'https://api.bitbucket.org/2.0',
    authorize: 'https://bitbucket.org/site/oauth2/authorize?client_id=xxx&response_type=token',
    proxyUrl: 'https://hapify-proxy.edouarddemotesmainard.com/bitbucket/php/index.php',
    proxyToken: 'VVmufSBsHyJcNAehytJDn3WZXsVHBa767W5tsezAKVhLXefpBpsSc8Z8NjdJy9JAn6Z43cxQzqsabR27FbwfujTe74vDXGBH'
  },
  deployer: {
    apiUrl: 'http://localhost:9000',
    session: {
      id: '4YDMFEK98B09Z0OVGVLJC5GMAXG14NJ5',
      key: 'Y9[NYnwdy7{Q{8!V:+JQJ:FwZ>~>hDR2[C}um?E#PcUY?aS_zUF$j57a\\?Eh-Y5K^}~4[k):zsb~Q/yrJXDf>n(gE~uB]d$~eC#Fpq]7)DtDh7]A<+AkB)v7F?ApjU\\='
    },
    wsUrl: 'ws://localhost:9000/websocket',
  },
  sync: false
};
