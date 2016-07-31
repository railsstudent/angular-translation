
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
      this.assignAdditionalProperty();
      this.visiblePhrases = {};
      this.hiddenPhrases = {};
      this.constructPhrases('visible', this.visiblePhrases);
      this.constructPhrases('hidden', this.hiddenPhrases);
      this.updateCount(this.visiblePhrases, this.hiddenPhrases);
      this.filterByStatus();
      this.checkAll = false;
      this.disableButtons = true;
      this.numSelectedPhrases = 0;
      this.unit = 'phrase';
    }

    assignAdditionalProperty() {
      _.forEach(this.phrases, (o) => {
        if (o.status == 'visible') {
          o.icon = 'icon-eye-open';
        } else if (o.status == 'hidden') {
          o.icon = 'icon-eye-close';
        }
        o.selected = false;
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

    changeChecked() {
        let ref = this;
        ref.numSelectedPhrases = 0;
        console.log('checkAll: ' + ref.checkAll);
        _.forEach(ref.filteredPhrases, (o) => {
           o.selected = ref.checkAll;
           if (o.selected == true) {
              ref.numSelectedPhrases = ref.numSelectedPhrases + 1;
           }
        });
        ref.disableButtons = !ref.checkAll;
        ref.unit = (ref.numSelectedPhrases <= 1 ? 'phrase' : 'phrases');
    }

   selectPhrase(phraseId) {
      let ref = this;
      let selectedPhrase = _.find(ref.filteredPhrases, (o) => {
                  return o.id == phraseId;
              });
      if (selectedPhrase) {
          if (selectedPhrase.selected == true) {
               // increment count
               ref.numSelectedPhrases = ref.numSelectedPhrases + 1;
          } else {
              ref.numSelectedPhrases = ref.numSelectedPhrases - 1;
          }
          ref.disableButtons = (ref.numSelectedPhrases <= 0);
          ref.unit = (ref.numSelectedPhrases <= 1 ? 'phrase' : 'phrases');
          if (ref.numSelectedPhrases == (ref.phrasesObj.visibleCount + ref.phrasesObj.hiddenCount)) {
            ref.checkAll = true;
          } else {
            ref.checkAll = false;
          }
      }
    }

    updatePhraseStatus(newStatus) {
      let ref = this;
      _.forEach(ref.filteredPhrases, (o, k) => {
          if (o.selected == true && o.status != newStatus) {
             o.status = newStatus;
             // hidden -> visible
             if (newStatus == 'visible') {
               o.icon = 'icon-eye-open';
               ref.phrasesObj.visibleCount = ref.phrasesObj.visibleCount + 1;
               ref.phrasesObj.hiddenCount = ref.phrasesObj.hiddenCount - 1;
               ref.visiblePhrases[k] = o;
               delete ref.hiddenPhrases[k];
             } else if (newStatus == 'hidden') {
               // visible -> hidden
               o.icon = 'icon-eye-close';
               ref.phrasesObj.visibleCount = ref.phrasesObj.visibleCount - 1;
               ref.phrasesObj.hiddenCount = ref.phrasesObj.hiddenCount + 1;
               ref.hiddenPhrases[k] = o;
               delete ref.visiblePhrases[k];
             }
          }
          o.selected = false;
      });

      ref.numSelectedPhrases = 0;
      ref.checkAll = false;
      STORAGE.get(this).set('phrases', this.phrases);
      this.filterByStatus();
    }
}

PhraseController.$inject = ['phraseSvc', 'localStorageService'];

export default PhraseController;
