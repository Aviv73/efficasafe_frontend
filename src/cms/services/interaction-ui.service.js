export const interactionUIService = {
    getInteractionColor,
    getRecommendationOrderMap,
    getEvidenceLevelDictionary,
    calculateEvidenceLevel,
    getRefsOrder,
    getSortedRefs,
    formatRefStrs,
    getShortRecommendation,
    getIsRed,
    getIsPositive,
    getPrintStyle
}


function formatRefStrs(refStr) {
    const formatedRefs = getRefsOrder(refStr);
    let formatedRefStr = '';
    let isSequence = false;
    for (let i = 0; i < formatedRefs.length; i++) {
      if (formatedRefs[i - 1] === undefined) formatedRefStr += formatedRefs[i];

      if (Math.abs(formatedRefs[i] - formatedRefs[i - 1]) > 1) {
        if (isSequence) formatedRefStr += '-' + (formatedRefs[i - 1]);
        formatedRefStr += ',' + formatedRefs[i];
        isSequence = false;
      } else if (Math.abs(formatedRefs[i] - formatedRefs[i - 1]) === 1) isSequence = true;

      if (i === (formatedRefs.length - 1) && formatedRefs[i - 1] !== undefined && isSequence) {
        formatedRefStr += '-' + formatedRefs[i];
      }
    }
    return `(${formatedRefStr})`;
  }

function getSortedRefs(txt, refs) {
    const refsOrder = getRefsOrder(txt);
    const sortedRefs = [];
    refsOrder.forEach(refIdx => {
      const ref = refs.find(currRef => currRef.draftIdx === refIdx);
      sortedRefs.push(ref);
    });
    return sortedRefs;
}

function getRefsOrder(txt, isUnique = true, withRange = true) {
    const regex = /\(([\d- ,\d]+)\)/g;
    const notUniqueRefs = txt.match(regex);
    if (!notUniqueRefs) return [];
    const refs = (isUnique) ? notUniqueRefs.filter(_onlyUnique) : notUniqueRefs;
    
    let cleanRefs = refs.map(ref => {
        ref = ref.substring(1, ref.length - 1);
        if (!ref.includes(',') && !ref.includes('-')) ref = +ref;
        else {
            ref = ref.split(',');
            for (let i = 0; i < ref.length; i++) {
                if (!ref[i].includes('-')) ref[i] = +ref[i];
            }
        }
        return ref;
    });
    cleanRefs = cleanRefs.flat(1);
    cleanRefs = cleanRefs.map(ref => {
        if (typeof ref === 'string' && ref.includes('-')) {
            const [ num1, num2 ] = ref.split('-').map(currRef => +currRef);
            if (num1 > num2) return [ num1, num2 ];
            const numsBetween = (withRange) ? _getAllNumbersBetween(num1, num2) : [ num1, num2 ];
            
            return numsBetween;
        }
        return ref;
    });
    cleanRefs = cleanRefs.flat(1);
    cleanRefs.filter(ref => ref.toString().length < 4);
    
    return (isUnique) ? _removeDuplicates(cleanRefs) : cleanRefs;
}

function calculateEvidenceLevel(refs) {
    const map = _getEvidenceLevelMap(refs)

    if (
        (map.meta || map.systematic || map['drug label']) ||
        ((map.clinical && map.clinical > 1) || (map.retrospective && map.retrospective > 1) || (map.retrospective && map.clinical))
        ) {
        return 'A';
    } else if (
        (map.clinical && map.animal) ||
        (map.clinical && map['in vitro']) ||
        (map.retrospective && map.animal) ||
        (map.retrospective && map['in vitro'])
    ) {
        return 'B';
    } else if (map.clinical || map.retrospective) {
        return 'C';
    } else if (map.case) {
        return 'D';
    } else if (
        (map.animal && map.animal > 1) ||
        (map['in vitro'] && map['in vitro'] > 1) ||
        (map.animal && map['in vitro'])
    ) {
        return 'E';
    } else if (map.animal || map['in vitro']) {
        return 'F';
    } else return 'Z';
}

function getInteractionColor(recommendation) {
    switch (recommendation.toLowerCase()) {
        case 'avoid coadministration':
        case 'coadministration is not advised':
            return '#E63946'; // $red
        case 'caution should be taken':
        case 'coadministration is not contraindicated but caution should be taken':
        case 'coadministration is possible but caution should be taken':
            return '#F6D55C'; // $yellow
        case 'coadministration is not contraindicated':
        case 'coadministration is not contraindicated and may even be advised':
        case 'coadministration is possible':
        case 'coadministration is possible and may even be advised':
        case 'coadministration is advised':
            return '#56C596'; // $green 
        default:
            return '#a4b8c6';
    }
}

function getShortRecommendation(fullRec) {
    switch (fullRec.toLowerCase()) {
        case 'avoid coadministration':
        case 'coadministration is not advised':
            return fullRec;
        case 'caution should be taken':
        case 'coadministration is not contraindicated but caution should be taken':
            return 'Caution should be taken';
        case 'coadministration is possible but caution should be taken':
            return 'Possible with caution';
        case 'coadministration is not contraindicated':
        case 'coadministration is not contraindicated and may even be advised':
            return 'Not contraindicated';
        case 'coadministration is possible':
            return 'Coadministration is possible';
        case 'coadministration is possible and may even be advised':
                return 'Coadministration may be advised';
        case 'coadministration is advised':
            return 'Coadministration is advised';
    }
}

function getRecommendationOrderMap() {
    return {
        'Avoid coadministration': 10,
        'Coadministration is not advised': 9,
        'Caution should be taken': 8,
        'Coadministration is not contraindicated but caution should be taken': 7,
        'Coadministration is possible but caution should be taken': 6,
        'Coadministration is not contraindicated': 5,
        'Coadministration is not contraindicated and may even be advised': 4,
        'Coadministration is possible': 3,
        'Coadministration is possible and may even be advised': 2,
        'Coadministration is advised': 1
    }
}

function getEvidenceLevelDictionary() {
    return [
        'A - multi clinical or meta or systematic',
        'B - 1 clinical or retrospective + pre-clinical',
        'C - 1 clinical or retrospective',
        'D - case report',
        'E - multi pre-clinical',
        'F - 1 pre clinical'
    ];
}

function getIsRed(fullRec){
    switch (fullRec) {
        case 'Avoid coadministration':
        case 'Coadministration is not advised':
            return true
        default:
            return false    
    }
}

function getIsPositive(fullRec){
    switch (fullRec){
        case 'Coadministration is not contraindicated and may even be advised':
        case 'Coadministration is possible':
        case 'Coadministration is possible and may even be advised':
        case 'Coadministration is advised':
        case 'Coadministration is possible but caution should be taken':
            return true
        default:
            return false
    }
}                    

function _removeDuplicates(arr) {
    var seenMap = {};
    var resArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i] in seenMap)) {
            resArr.push(arr[i]);
            seenMap[arr[i]] = true;
        }
    }
    return resArr;
}

function _onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function _getAllNumbersBetween(num1, num2) {
    const numbers = [];
    for (let i = num1; i < num2 + 1; i++) {
        numbers.push(i);
    }
    return numbers;
}

function _getEvidenceLevelMap(refs) {
    const map = refs.reduce((acc, ref) => {
        if (!acc[ref.type]) acc[ref.type] = 1;
        else acc[ref.type]++;
        return acc;
    }, {});
    return map;
}

function getPrintStyle(){
    return `
    @font-face {
        font-family: roboto;
        src: url('../assets/fonts/Roboto-Regular.ttf');
    }
    @font-face {
        font-family: roboto-medium;
        src: url('../assets/fonts/Roboto-Medium.ttf');
    }
    @font-face {
        font-family: roboto-light;
        src: url('../assets/fonts/Roboto-Light.ttf');
    }
    @font-face {
        font-family: roboto-bold;
        src: url('../assets/fonts/Roboto-Bold.ttf');
    }
    @font-face {
        font-family: segoe-ui;
        src: url('../assets/fonts/Segoe-UI.woff');
    }
    @font-face {
        font-family: mulish;
        src: url('../assets/fonts/Mulish-Regular.ttf');
    }
    @font-face {
        font-family: tw-cen;
        src: url('../assets/fonts/TwCenClassMTStd-Regular.otf');
    }


    * {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
      }
    *,
    *::before,
    *::after {
        box-sizing: border-box;
      }

    body {
        font-size: 1rem;
        font-weight: normal;
        font-family: sans-serif;
        color: #484848;
        letter-spacing: 0;
        line-height: 1.25rem;
      }  

    .print-modal-preview {
        background-color: #F8F8F8;
      }
      .print-modal-preview-interaction {
        padding: 0 24px;
        background-color: #FFFFFF;
      }
      .print-modal-preview-interaction-header {
        font-size: 1.125rem;
        line-height: 1.25rem;
        margin-block-end: 1.125rem;
        padding: 0.75rem 0 1.125rem;
        text-align: center;
        position: relative;
      }
      .print-modal-preview-interaction-header [alt=Logo] {
        position: absolute;
        top: 12px;
        left: 0;
        width: 140px;
      }
      .print-modal-preview-interaction-header::before {
        content: "";
        width: 100%;
        height: 6px;
        position: absolute;
        left: 0;
        bottom: 6px;
        background-image: linear-gradient(90deg, #235775, #54C394);
      }
      .print-modal-preview-interaction-header::after {
        content: "";
        width: 100%;
        height: 1px;
        position: absolute;
        left: 0;
        bottom: 0;
        background-image: linear-gradient(90deg, #235775, #54C394);
      }
      .print-modal-preview-interaction-summary {
        padding-block-end: 1.375rem;
        font-size: 1rem;
        line-height: 1.25rem;
        align-items: stretch;
        gap: 0.5rem;
        position: relative;
      }
      .print-modal-preview-interaction-summary::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-image: linear-gradient(90deg, #235775, #54C394);
      }
      .print-modal-preview-interaction-summary > * {
        flex-basis: 50%;
      }
      .print-modal-preview-interaction-summary .capsule {
        border-radius: 100px;
        border: 1px solid #d5d5d5;
        padding: 0.375rem 1rem;
        text-align: center;
      }
      .print-modal-preview-interaction-summary .interaction-capsules {
        display: flex;
      }
      .print-modal-preview-interaction-summary .interaction-capsules-side {
        height: 100%;
        width: 50%;
        border: 1px solid #d5d5d5;
        box-shadow: none;
        padding: 0.375rem 1rem;
      }
      .print-modal-preview-interaction-summary .interaction-capsules-side > span {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .print-modal-preview-interaction-summary .recommendation-capsule {
        color: #FFFFFF;
      }
      .print-modal-preview-interaction-summary .recommendation-capsule-icon {
        margin-inline-end: 0.375rem;
      }
      .print-modal-preview-interaction-summary .recommendation-capsule .clip-txt {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .print-modal-preview-interaction-summary .recommendation-capsule .material-design-icon {
        height: 16px;
      }
      .print-modal-preview-interaction-summary .note,
      .print-modal-preview-interaction-summary .level-of-evidence {
        color: #205072;
      }
      .print-modal-preview-interaction-summary .narrow-therapuetic-warnning {
        font-size: 0.875rem;
        text-align: center;
        padding: 0.75rem 1rem;
        border: 1px solid #E63946;
        border-radius: 3px;
      }
      .print-modal-preview-interaction-content {
        padding: 0.5rem 0 1rem;
        font-size: 0.875rem;
      }
      .print-modal-preview-interaction-content-subheader {
        color: #205072;
        text-transform: uppercase;
        margin-block-end: 0.375rem;
      }
      .print-modal-preview-interaction-content .paragraph {
        margin-block-end: 1.125rem;
      }
      .print-modal-preview-interaction-content .small-header {
        color: #484848;
        margin-block-end: 0.375rem;
      }
      .print-modal-preview-interaction-content .enzymes-opener {
        margin-block-end: 0.25rem;
      }


      .interaction-capsules {
        min-width: max-content;
        max-width: 100%;
        z-index: 0;
        margin-block-end: 0;
        position: relative;
      }
      .interaction-capsules-side {
        display: inline-block;
        width: 11.25rem;
        padding: 0.625rem 1rem;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-color: #FFFFFF;
        border-radius: 100px;
        box-shadow: 0px 2px 2px rgba(177, 177, 177, 0.3);
        position: relative;
      }
      .interaction-capsules-side .cap {
        position: absolute;
        top: 0;
        height: 100%;
      }
      .interaction-capsules-side .cap-left {
        right: 0;
      }
      .interaction-capsules-side .cap-right {
        left: 0;
      }



    .flex-center {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .flex-align-center {
        display: flex;
        align-items: center;
    }
    .flex-coloumn {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .flex-space-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .flex-wrap {
        flex-wrap: wrap;
    }
    .flex-wrap-r {
        flex-wrap: wrap-reverse;
    }
    .d-flex {
        display: flex;
    }
    .d-block {
        display: block;
    }
    .p-relative {
        position: relative;
    }
    .u-hide {
        visibility: hidden;
    }

    `
}