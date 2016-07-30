
const INIT = new WeakMap();
const SERVICE = new WeakMap();
const STORAGE = new WeakMap();

class PhraseController {

    constructor(phraseSvc, localStorageService) {
      console.log('PhraseController called.');
      STORAGE.set(this, localStorageService);
      SERVICE.set(this, phraseSvc);

      INIT.set(this, () => {
        let storage = STORAGE.get(this);
        this.currentStatus = '';
        if (storage.get('phrases')) {
           this.phrases = storage.get('phrases');
           this.initPhrases();
           this.printDebugStmt();
        } else {

          SERVICE.get(this).loadAll().then(
            (response) => {
              // return a list of phrases
              this.phrases = response.data;
              this.initPhrases();
              this.errMessage = '';
              this.printDebugStmt();
            }, (response) => {
                this.phrases = {};
                this.visiblePhrases = {};
                this.hiddenPhrases = {};
                this.updateCount(this.visiblePhrases, this.hiddenPhrases);
                this.errMessage = 'Failed to load phrases. Status: ' +
                    response.status + ', error: ' + response.data;
            });
         }
      });

      this.searchValue = '';
      this.filteredPhrases = {};
      this.phrasesObj = {
        visibleCount : 0,
        hiddenCount : 0
      };
      this.statusOptions = [
         { icon: 'icon-align-left', status: '', option: 'All Phrases' }
        ,{ icon: 'icon-eye-open', status: 'visible', option: 'Visible Phrases'  }
        ,{ icon: 'icon-eye-close', status: 'hidden', option: 'Hidden Phrases' }
      ];
      this.selectedButtonText = 'All Phrases';

      INIT.get(this)();
    }

    initPhrases() {
      this.assignPhraseIcon();
      this.visiblePhrases = {};
      this.hiddenPhrases = {};
      this.constructPhrases('visible', this.visiblePhrases);
      this.constructPhrases('hidden', this.hiddenPhrases);
      this.updateCount(this.visiblePhrases, this.hiddenPhrases);
      this.filterByStatus();
    }

    assignPhraseIcon() {
      _.forEach(this.phrases, (o) => {
        if (o.status == 'visible') {
          o.icon = 'icon-eye-open';
        } else if (o.status == 'hidden') {
          o.icon = 'icon-eye-close';
        }
      });
    }

    constructPhrases(status, filteredPhrases) {
      _.forEach(this.phrases, (o, k) => {
        if (o.status == status) {
            filteredPhrases[k] = o;
        }
      });
    }

    updateCount(visiblePhrases, hiddenPhrases) {
      this.phrasesObj.visibleCount = 0;
      this.phrasesObj.hiddenCount = 0;
      let ref = this;
      _.forEach(visiblePhrases, (o) => {
        ref.phrasesObj.visibleCount = ref.phrasesObj.visibleCount + 1;
      });

      _.forEach(hiddenPhrases, (o) => {
        ref.phrasesObj.hiddenCount = ref.phrasesObj.hiddenCount + 1;
      });
    }

    printDebugStmt() {
      console.log(this.phrases);
      console.log(this.visiblePhrases);
      console.log(this.hiddenPhrases);
      console.log('current status: ' + this.currentStatus);
      console.log('visible phrase: ' + this.phrasesObj.visibleCount);
      console.log('hidden phrase: ' + this.phrasesObj.hiddenCount);
    }

    filterByStatus() {
      let status = this.currentStatus;
      console.log('status: ' + status);
      let opt = _.find(this.statusOptions, (o) => {
          return o.status == status;
      });
      if (opt) {
        this.selectedButtonText = opt.option;
      }

      if (status == '') {
        this.filteredPhrases = this.phrases;
      } else if (status == 'visible'){
        this.filteredPhrases = this.visiblePhrases;
      } else if (status == 'hidden') {
        this.filteredPhrases = this.hiddenPhrases;
      }
      console.log('In filterByStatus, filteredPhrases: ' + this.filteredPhrases);
    }

    searchByKeyword() {
      let ref = this;
      ref.filterByStatus();
      if (ref.searchValue && ref.searchValue != '') {
        let tmpPhrases = ref.filteredPhrases;
         ref.filteredPhrases = {};
         let patt = new RegExp(ref.searchValue);
         _.forEach(tmpPhrases, (o, k) => {
           if (patt.test(o.id) || patt.test(o.context) || patt.test(o.value)) {
              ref.filteredPhrases[k] = o;
           } else {
              // load note from local storage and compare
              let note = STORAGE.get(ref).get('note-' + o.id);
              if (note) {
                 if (patt.test(note)) {
                   ref.filteredPhrases[k] = o;
                 }
              }
            }
        });

        // sort phrase by keyid
        ref.filteredPhrases = _.sortBy(ref.filteredPhrases, (o) => {
          return o.id;
        });
      }
    }
}

PhraseController.$inject = ['phraseSvc', 'localStorageService'];

export default PhraseController;
