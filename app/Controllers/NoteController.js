
const STORAGE = new WeakMap();
const MODAL_INSTANCE = new WeakMap();

class NoteController {

  constructor(localStorageService, $uibModalInstance, phrase, note) {
    console.log('NoteController called.');
    STORAGE.set(this, localStorageService);
    MODAL_INSTANCE.set(this, $uibModalInstance);

    this.selectedNote = note;
    this.selectedPhrase = phrase;
  }

   saveNote() {
       console.log('selected note id: ' + this.selectedPhrase.id);
       console.log('selected: ' + this.selectedNote);

       // save note in local storage
       let noteId = this.selectedPhrase.id;
       STORAGE.get(this).set('note-' + noteId, this.selectedNote);
       MODAL_INSTANCE.get(this).close('saved');
   }

   cancel() {
      MODAL_INSTANCE.get(this).dismiss('cancel');
   }
 }

NoteController.$inject = ['localStorageService', '$uibModalInstance', 'phrase', 'note'];

export default NoteController;
