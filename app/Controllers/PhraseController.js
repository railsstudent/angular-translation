
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
        if (storage.get('phrases')) {
           this.phrases = storage.get('phrases');
           this.filterByStatus('');
        } else {

          SERVICE.get(this).loadAll().then(
            (response) => {
              // return a list of phrases
              this.phrases = response.data;
              this.filterByStatus('');
              this.errMessage = '';
              console.log(this.phrases);
              console.log('visible phrase: ' + this.phraseObj.visibleCount);
              console.log('hidden phrase: ' + this.phraseObj.hiddenCount);
            }, (response) => {
                this.phrases = {};
                this.errMessage = 'Failed to load phrases. Status: ' +
                    response.status + ', error: ' + response.data;
            });
         }
      });

      this.filteredPhrases = {};
      this.phraseObj =  {
         visibleCount: 0,
         hiddenCount: 0
      };

      this.statusOptions = [
         { icon: 'icon-align-left', status: '', option: 'All Phrases' }
        ,{ icon: 'icon-eye-open', status: 'visible', option: 'Visible Phrases'  }
        ,{ icon: 'icon-eye-close', status: 'hidden', option: 'Hidden Phrases' }
      ];
      this.selectedButtonText = 'All Phrases';

      INIT.get(this)();
    }

    countPhrases() {
      let ref = this;
      this.phraseObj.visibleCount = this.phraseObj.hiddenCount = 0;
      _.forEach(this.filteredPhrases, (o) => {
          if (o.status == 'visible') {
             o.icon = 'icon-eye-open';
             ref.phraseObj.visibleCount = ref.phraseObj.visibleCount + 1;
          } else {
             o.icon = 'icon-eye-close';
             ref.phraseObj.hiddenCount = ref.phraseObj.hiddenCount + 1;
          }
      });
    }

    filterByStatus(status) {
      console.log('status: ' + status);
      let opt = _.find(this.statusOptions, (o) => {
          return o.status == status;
      });
      if (opt) {
        this.selectedButtonText = opt.option;
      }

      if (status == '') {
        this.filteredPhrases = this.phrases;
      } else {
        let ref = this;
        this.filteredPhrases = [];
        _.forEach(this.phrases, (o) => {
            if (o.status == status) {
              ref.filteredPhrases.push(o);
            }
        });
      }
      console.log('In filterByStatus, filteredPhrases: ' + this.filteredPhrases);
      console.log('In filterByStatus, phrases: ' + this.phrases);
      this.countPhrases();
    }
}

PhraseController.$inject = ['phraseSvc', 'localStorageService'];

export default PhraseController;
