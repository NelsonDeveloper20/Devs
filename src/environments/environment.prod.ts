
export const environment = {
  production: true,  
  clientId: 'd8ba7c99-e1c1-4560-a154-1bdcb83ad43f',
  tenanId: 'b5fdc43d-890f-4208-917d-107c711d57cc',
  applicationId: 'd8ba7c99-e1c1-4560-a154-1bdcb83ad43f', 
  authority: 'https://login.microsoftonline.com/b5fdc43d-890f-4208-917d-107c711d57cc',
  authRedirectUri: '', 
  logoutRedirectUri: '', 
  //baseUrl: 'http://10.0.2.5:82', // PRODUCCION
  //urlSap:'http://10.0.2.5:8081/'

  baseUrl: window.location.hostname === '10.0.2.5' ? 'http://10.0.2.5:82' : 'http://191.98.160.56:82',
  urlSap: window.location.hostname === '10.0.2.5' ? 'http://10.0.2.5:8081/' : 'http://191.98.160.56:8081/',

};