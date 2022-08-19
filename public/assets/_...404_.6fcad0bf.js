import { u as useContext, S as ServerContext, o as onCleanup, g as getNextElement, a as getNextMarker, i as insert, c as createComponent, T as Title, t as template } from './index.8304b404.js';

function HttpStatusCode(props) {
  useContext(ServerContext);

  onCleanup(() => {
  });
  return null;
}

const _tmpl$ = /*#__PURE__*/template(`<main><!#><!/><!#><!/><h1>Page Not Found</h1><p>Visit <a href="https://docs.solidjs.com/start" target="_blank">docs.solidjs.com/start</a> to learn how to build SolidStart apps.</p></main>`);
function NotFound() {
  return (() => {
    const _el$ = getNextElement(_tmpl$),
          _el$3 = _el$.firstChild,
          [_el$4, _co$] = getNextMarker(_el$3.nextSibling),
          _el$5 = _el$4.nextSibling,
          [_el$6, _co$2] = getNextMarker(_el$5.nextSibling);
          _el$6.nextSibling;

    insert(_el$, createComponent(Title, {
      children: "Not Found"
    }), _el$4, _co$);

    insert(_el$, createComponent(HttpStatusCode, {
      code: 404
    }), _el$6, _co$2);

    return _el$;
  })();
}

export { NotFound as default };
