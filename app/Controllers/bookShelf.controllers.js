import HomeController from './HomeController';
import AddBookController from './AddBookController';
import ArchiveController from './ArchiveController';
import PhraseController from './PhraseController';

var moduleName='phrase.controllers';

angular.module(moduleName, [])
    .controller('bookShelf.homeController', HomeController)
    .controller('bookShelf.addBookController', AddBookController)
    .controller('bookShelf.archiveController', ArchiveController)
    .controller('phrase.phraseController', PhraseController);

export default moduleName;
