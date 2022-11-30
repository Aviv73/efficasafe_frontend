const errorImg = require('@/client/assets/imgs/error.svg')
const closeImg = require('@/client/assets/imgs/close-btn.svg')

function toast({type = 'error', msg = '', html = '', timeout = 10000} = {}, olCloseCb) {
  const styleStr =`<style>
    ${_StyleEl('.toast-alert', {
      position: 'fixed',
      zIndex: 20,
      top: '40px',
      right: '50%',
      transform: 'translateX(50%)',
      padding: '10px',
      borderRadius: '4px',
      fontStyle: 'italic',
      fontSize: '0.875rem',
      width: '370px',
      '&.success': {
        backgroundColor: 'green',
        '.prime-msg': {
          // color: 'green-darker'
        }
      },
      '&.warning': {
        backgroundColor: 'yellow',
        '.prime-msg': {
          // color: 'yellow-darker'
        }
      },
      '&.error': {
        backgroundColor: '#FFF5F5',
        '.prime-msg': {
          // color: '#E63946',
          '&::before': {
            content: `url(${errorImg})`,
            marginInlineEnd: '5px'
          }
        }
      },
      a: {
        // color: 'black',
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'underline'
      },
      '@keyframes fadeaway': {
        '0%': {opacity: '100%'},
        '100%': {opacity: '0%'}
      },
      '&.fade': {
        animationName: 'fadeaway',
        animationDuration: '1s'
      },
      '.close-btn': {
        position: 'absolute',
        top: '3px',
        right: '3px',
        backgroundImage: `url(${closeImg})`,
        backgroundSize: `10px 10px`,
        width: '10px',
        height: '10px',
        content: '""'
      },
      '@media (max-width: 420px)': {
        width: '90vw',
        textAlign: 'center',
        '.sec-msg': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }
      }
    })}
  </style>`

  let toastEl;

  let isClosed = false;
  const onClose = () => {
    if (isClosed) return;
    isClosed = true;
    document.body.removeChild(toastEl);
    olCloseCb?.();
  }

  toastEl = _El(`<div class="toast-alert ${type}">
    ${styleStr}
    ${msg? `<p class="prime-msg">${msg}</p>` : ''}
    ${html || ''}
  </div>`, {}, [_El(`<button class="close-btn"></button>`, {onclick: onClose})]);

  document.body.appendChild(toastEl);

  if (timeout) setTimeout(() => {
    if (isClosed) return;
    toastEl.classList.add('fade')
    setTimeout(() => {
      onClose();
    }, timeout - 1000);
  }, timeout);

  return onClose;
}

export const alertService = {
  toast
}



function _getElType(template) {
  if (template[0] === '<' && template[template.length-1] === '>') {
      if (template[1] === '/') {
          return template.split('/')[1].split(' ')[0].split('>')[0];
      } 
      else {
          return template.split('<')[1].split(' ')[0].split('>')[0].split('/')[0];
      }
  } else return;
}
function _El(htmlStr = '', evs = {}, children = []) {
  let parentType = 'div';
  const elType = _getElType(htmlStr);
  if (elType === 'tr') parentType = 'table';
  else if (elType === 'td') parentType = 'tr';
  const parent = document.createElement(parentType);
  parent.innerHTML = htmlStr;
  const el = parent.firstChild;
  for (let evName in evs) el[evName] = evs[evName];
  children.forEach(child => child && el.appendChild(child));
  return el;
}
function _StyleEl(selector = '', style = {}, tab = 0) {
  const tabStr = '\t'.repeat(tab);
  let styleStr = `${tabStr}${selector} {`;
  let nestedStyle = ''
  for (let key in style) {
      const val = style[key];
      key = _stringToLowerKabab(key);
      if (typeof val === 'object') {
          const isCssRule = key[0] === '@';
          if (!isCssRule) {
              let nestedSelector = selector;
              if (key[0] === '&') nestedSelector += key.slice(1);
              else nestedSelector += ` ${key}`;
              nestedStyle += _StyleEl(nestedSelector, val);
          } else {
              nestedStyle += `${key} {\n`;
              const rullType = key.split(' ')[0].split('@')[1];
              if (rullType === 'keyframes') for (let c in val) nestedStyle += _StyleEl(c, val[c]);
              else nestedStyle += _StyleEl(selector, val, 1);
              nestedStyle += '}\n';
          }
      }
      else styleStr += `\n${tabStr}\t${key}: ${val};`;
  }
  styleStr += `\n${tabStr}}\n`;
  styleStr += nestedStyle;
  return styleStr;
}
function _stringToLowerKabab(str) {
  const CAPS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let fixedStr = '';
  for (let i = 0; i < str.length; i++) {
      let curr = str[i];
      let lowerCurr = curr.toLowerCase();
      if (CAPS.includes(curr)) {
          if (i === 0) fixedStr += lowerCurr;
          else if (str[i-1] && (str[i-1] !== ' ')) fixedStr += `-${lowerCurr}`;
      } else fixedStr += lowerCurr;
  }
  return fixedStr;
}
