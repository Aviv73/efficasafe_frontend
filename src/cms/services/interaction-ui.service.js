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
    createWarnings
}

function createWarnings(mat1, mat2){
    const warnings = []
    if(mat1.isNarrowTherapeutic) warnings.push({title: 'Narrow Therapeutic', text: `Attention: ${mat1.name} has a narrow therapeutic range. Differences
    in dose or blood concentration may lead to serious therapeutic failures and/or adverse
    drug reactions.`})
    if(mat2.isNarrowTherapeutic) warnings.push({title: 'Narrow Therapeutic', text: `Attention: ${mat2.name} has a narrow therapeutic range. Differences
    in dose or blood concentration may lead to serious therapeutic failures and/or adverse
    drug reactions.`})

    if(mat1.isG6pd) warnings.push({title: 'G6PD', text: `Attention: People with G6PD deficiency should avoid ${mat1.name}.`})
    if(mat2.isG6pd) warnings.push({title: 'G6PD', text: `Attention: People with G6PD deficiency should avoid ${mat2.name}.`})

    if(mat1.isSalicylate) warnings.push({title: 'Salicylates', text: `Attention: ${mat1.name} contains salicylates. People with known sensitivity to salicylates should avoid this agent.`})
    if(mat2.isSalicylate) warnings.push({title: 'Salicylates', text: `Attention: ${mat2.name} contains salicylates. People with known sensitivity to salicylates should avoid this agent.`})
    
    if(mat1.isComposite) warnings.push({title: 'Composites', text: `Attention: ${mat1.name} belongs to the composite family. People with known sensitivity to herbs belonging to this family should avoid this agent.`})
    if(mat2.isComposite) warnings.push({title: 'Composites', text: `Attention: ${mat2.name} belongs to the composite family. People with known sensitivity to herbs belonging to this family should avoid this agent.`})
    
    if(mat1.isTannin) warnings.push({title: 'Tannins', text: `Attention: ${mat1.name} has high tannin content, which might reduce the absorption of drugs and minerals such as iron, zinc and to a lesser extent calcium. When coadministration is required a minimum of 2-hours separation is advised.`})
    if(mat2.isTannin) warnings.push({title: 'Tannins', text: `Attention: ${mat2.name} has high tannin content, which might reduce the absorption of drugs and minerals such as iron, zinc and to a lesser extent calcium. When coadministration is required a minimum of 2-hours separation is advised.`})

    if(mat1.isPhototoxicity) warnings.push({title: 'Phototoxicity', text: `Attention: ${mat1.name} might enhance skin vulnerability to sunlight. When consuming this agent, direct exposure to sunlight should be limited and precautions against sun damage should be taken.`})
    if(mat2.isPhototoxicity) warnings.push({title: 'Phototoxicity', text: `Attention: ${mat2.name} might enhance skin vulnerability to sunlight. When consuming this agent, direct exposure to sunlight should be limited and precautions against sun damage should be taken.`})
    
    if(mat1.isSulfa) warnings.push({title: 'Sulfa', text: `Attention: ${mat1.name} contains sulfa. People with known sensitivity to sulfa should avoid this agent.`})
    if(mat2.isSulfa) warnings.push({title: 'Sulfa', text: `Attention: ${mat2.name} contains sulfa. People with known sensitivity to sulfa should avoid this agent.`})

    return warnings
}

function formatRefStrs(refStr) {
    const formatedRefs = getRefsOrder(refStr);
    formatedRefs.sort((a,b) => {
        if(a > b) return 1
        if(a < b) return -1
        return 0
    })
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
        'F - 1 pre clinical',
        'Z'
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
        case 'Coadministration is possible and may even be advised':
        case 'Coadministration is advised':
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