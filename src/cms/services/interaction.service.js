import { httpService } from './http.service.js';

const END_POINT = 'interaction';

export const interactionService = {
    list,
    getById,
    save,
    remove,
    removeMany,
    restore,
    getSortedRefs,
    getRefsOrder,
    formatRefStrs,
    getEmptyInteraction,
    calculateEvidenceLevel,
    getEvidenceLevelDictionary,
    getRecommendationOrderMap
}

function list(filterBy) {
    return httpService.get(END_POINT, filterBy);
}

function getById(id) {
    return httpService.get(`${END_POINT}/${id}`);
}

function save(interaction) {
    if (interaction._id) return httpService.put(`${END_POINT}/${interaction._id}`, interaction);
    else return httpService.post(`${END_POINT}`, interaction);
}

// restore to main collection:
function restore(interaction) {
    return httpService.post(`${END_POINT}`, interaction);
}

function remove(id) {
    httpService.delete(`${END_POINT}/${id}`);
}

function removeMany(ids) {
    httpService.delete(END_POINT, ids);
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
    const map = _evidenceLevelMap(refs)

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

function getEmptyInteraction() {
    return {
        isActive: false,
        side1Material: null,
        side2Material: null,
        side2Label: null,
        side2DraftName: '',
        updatedAt: null,
        src: 'manual',
        recommendation: '',
        note: '',
        summary: '',
        monitor: {
            general: '',
            labTests: '',
            otherTests: '',
            symptoms: ''
        },
        reviewOfStudies: '',
        evidenceLevel: '',
        indications: [],
        refs: [],
        editorDraft: {
            general: '',
            infoSide1: '',
            infoSide2: ''
        }
    }
}

function getRecommendationOrderMap() {
    return {
        'Avoid coadministration': 3,
        'Coadministration is not advised': 3,
        'Caution should be taken': 2,
        'Coadministration is not contraindicated but caution should be taken': 2,
        'Coadministration is possible but caution should be taken': 2,
        'Coadministration is not contraindicated': 1,
        'Coadministration is not contraindicated and may even be advised': 1,
        'Coadministration is possible': 1,
        'Coadministration is possible and may even be advised': 1,
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

function _evidenceLevelMap(refs) {
    const map = refs.reduce((acc, ref) => {
        if (!acc[ref.type]) acc[ref.type] = 1;
        else acc[ref.type]++;
        return acc;
    }, {});
    return map;
}