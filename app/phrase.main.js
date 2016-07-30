import { default as controllersModuleName } from './Controllers/bookShelf.controllers';
import { default as servicesModuleName } from './bookShelf.services';
import { default as directivesModuleName } from './bookShelf.directives';
import { default as phraseModuleName } from './phrase.services';

var moduleName = 'bookShelf';

function config($routeProvider){
  $routeProvider
     .when('/', {
       templateUrl: 'templates/phrase.html',
       controller: 'phrase.phraseController',
       controllerAs: 'vm'
     })
    /*.when('/',{
      templateUrl:'templates/home.html',
      controller:'bookShelf.homeController',
      controllerAs:'vm'
    })
    when('/addBook',{
      templateUrl:'templates/addBook.html',
      controller:'bookShelf.addBookController',
      controllerAs:'vm'
    })
    .when('/archive', {
      templateUrl:'templates/archive.html',
      controller:'bookShelf.archiveController',
      controllerAs:'vm'
    })*/
    .otherwise({redirectTo:'/'});
}

config.$inject = ['$routeProvider'];

var app = angular.module(moduleName, ['ngRoute','ngMessages', servicesModuleName, controllersModuleName,
    directivesModuleName, phraseModuleName, 'LocalStorageModule' ])
  .config(config)
  // allow DI for use in controllers, unit tests
  .constant('_', window._)
  .run(function ($rootScope) {
     $rootScope._ = window._;
  });;

export default moduleName;
