import { default as controllersModuleName } from './Controllers/phrase.controllers';
import { default as servicesModuleName } from './phrase.services';

var moduleName = 'phrase';

function config($routeProvider){
  $routeProvider
     .when('/', {
       templateUrl: 'templates/phrase.html',
       controller: 'phrase.phraseController',
       controllerAs: 'vm'
     })
    .otherwise({redirectTo:'/'});
}

config.$inject = ['$routeProvider'];

var app = angular.module(moduleName, ['ngRoute','ngMessages', 'LocalStorageModule', 'tooltips'
      , 'ui.bootstrap', servicesModuleName, controllersModuleName])
  .config(config)
  // allow DI for use in controllers, unit tests
  .constant('_', window._)
  .run(function ($rootScope) {
     $rootScope._ = window._;
  });;

export default moduleName;
