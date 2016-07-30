var moduleName='phrase.services';

const HTTP = new WeakMap();

class PhraseService {

  constructor($http) {
    HTTP.set(this, $http);
  }

  loadAll() {
    return HTTP.get(this).get('/api/phrases');
  }

  static phraseFactory($http){
    return new PhraseService($http);
  }
}

PhraseService.phraseFactory.$inject = ['$http'];
angular.module(moduleName, [])
  .factory('phraseSvc', PhraseService.phraseFactory);

export default moduleName;
