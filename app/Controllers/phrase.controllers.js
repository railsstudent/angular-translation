import PhraseController from './PhraseController';
import NoteController from './NoteController';

var moduleName='phrase.controllers';

angular.module(moduleName, [])
    .controller('phrase.phraseController', PhraseController)
    .controller('phrase.noteController', NoteController);

export default moduleName;
