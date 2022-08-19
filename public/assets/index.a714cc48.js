import { $ as $PROXY, b as $TRACK, d as getListener, e as batch, f as createSignal, i as insert, c as createComponent, F as For, t as template, h as delegateEvents, g as getNextElement, a as getNextMarker, T as Title } from './index.0a1ce43b.js';

const controls = [
  {
    control: "Sequ\xEDas c\xEDclicas",
    color: {
      r: 255,
      g: 185,
      b: 33
    }
  },
  {
    control: "Municipios indemnizados",
    color: {
      r: 106,
      g: 192,
      b: 26
    }
  },
  {
    control: "Datos de precipitaci\xF3n de Mayo",
    color: {
      r: 143,
      g: 0,
      b: 0
    }
  },
  {
    control: "Datos de precipitaci\xF3n de Junio",
    color: {
      r: 143,
      g: 0,
      b: 0
    }
  },
  {
    control: "Datos de precipitaci\xF3n de Julio",
    color: {
      r: 143,
      g: 0,
      b: 0
    }
  }
];

const $RAW = Symbol("store-raw"),
      $NODE = Symbol("store-node"),
      $NAME = Symbol("store-name");
function wrap$1(value, name) {
  let p = value[$PROXY];
  if (!p) {
    Object.defineProperty(value, $PROXY, {
      value: p = new Proxy(value, proxyTraps$1)
    });
    const keys = Object.keys(value),
          desc = Object.getOwnPropertyDescriptors(value);
    for (let i = 0, l = keys.length; i < l; i++) {
      const prop = keys[i];
      if (desc[prop].get) {
        const get = desc[prop].get.bind(p);
        Object.defineProperty(value, prop, {
          get
        });
      }
    }
  }
  return p;
}
function isWrappable(obj) {
  let proto;
  return obj != null && typeof obj === "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
}
function unwrap(item, set = new Set()) {
  let result, unwrapped, v, prop;
  if (result = item != null && item[$RAW]) return result;
  if (!isWrappable(item) || set.has(item)) return item;
  if (Array.isArray(item)) {
    if (Object.isFrozen(item)) item = item.slice(0);else set.add(item);
    for (let i = 0, l = item.length; i < l; i++) {
      v = item[i];
      if ((unwrapped = unwrap(v, set)) !== v) item[i] = unwrapped;
    }
  } else {
    if (Object.isFrozen(item)) item = Object.assign({}, item);else set.add(item);
    const keys = Object.keys(item),
          desc = Object.getOwnPropertyDescriptors(item);
    for (let i = 0, l = keys.length; i < l; i++) {
      prop = keys[i];
      if (desc[prop].get) continue;
      v = item[prop];
      if ((unwrapped = unwrap(v, set)) !== v) item[prop] = unwrapped;
    }
  }
  return item;
}
function getDataNodes(target) {
  let nodes = target[$NODE];
  if (!nodes) Object.defineProperty(target, $NODE, {
    value: nodes = {}
  });
  return nodes;
}
function getDataNode(nodes, property, value) {
  return nodes[property] || (nodes[property] = createDataNode(value, true));
}
function proxyDescriptor(target, property) {
  const desc = Reflect.getOwnPropertyDescriptor(target, property);
  if (!desc || desc.get || !desc.configurable || property === $PROXY || property === $NODE || property === $NAME) return desc;
  delete desc.value;
  delete desc.writable;
  desc.get = () => target[$PROXY][property];
  return desc;
}
function trackSelf(target) {
  if (getListener()) {
    const nodes = getDataNodes(target);
    (nodes._ || (nodes._ = createDataNode()))();
  }
}
function ownKeys(target) {
  trackSelf(target);
  return Reflect.ownKeys(target);
}
function createDataNode(value, equals) {
  const [s, set] = createSignal(value, equals ? {
    internal: true
  } : {
    equals: false,
    internal: true
  });
  s.$ = set;
  return s;
}
const proxyTraps$1 = {
  get(target, property, receiver) {
    if (property === $RAW) return target;
    if (property === $PROXY) return receiver;
    if (property === $TRACK) return trackSelf(target);
    const nodes = getDataNodes(target);
    const tracked = nodes[property];
    let value = tracked ? nodes[property]() : target[property];
    if (property === $NODE || property === "__proto__") return value;
    if (!tracked) {
      const desc = Object.getOwnPropertyDescriptor(target, property);
      if (getListener() && (typeof value !== "function" || target.hasOwnProperty(property)) && !(desc && desc.get)) value = getDataNode(nodes, property, value)();
    }
    return isWrappable(value) ? wrap$1(value) : value;
  },
  set() {
    return true;
  },
  deleteProperty() {
    return true;
  },
  ownKeys: ownKeys,
  getOwnPropertyDescriptor: proxyDescriptor
};
function setProperty(state, property, value) {
  if (state[property] === value) return;
  const prev = state[property];
  const len = state.length;
  if (value === undefined) {
    delete state[property];
  } else state[property] = value;
  let nodes = getDataNodes(state),
      node;
  if (node = getDataNode(nodes, property, prev)) node.$(() => value);
  if (Array.isArray(state) && state.length !== len) (node = getDataNode(nodes, "length", len)) && node.$(state.length);
  (node = nodes._) && node.$();
}
function mergeStoreNode(state, value) {
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    setProperty(state, key, value[key]);
  }
}
function updateArray(current, next) {
  if (typeof next === "function") next = next(current);
  next = unwrap(next);
  if (Array.isArray(next)) {
    if (current === next) return;
    let i = 0,
        len = next.length;
    for (; i < len; i++) {
      const value = next[i];
      if (current[i] !== value) setProperty(current, i, value);
    }
    setProperty(current, "length", len);
  } else mergeStoreNode(current, next);
}
function updatePath(current, path, traversed = []) {
  let part,
      prev = current;
  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part,
          isArray = Array.isArray(current);
    if (Array.isArray(part)) {
      for (let i = 0; i < part.length; i++) {
        updatePath(current, [part[i]].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "function") {
      for (let i = 0; i < current.length; i++) {
        if (part(current[i], i)) updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "object") {
      const {
        from = 0,
        to = current.length - 1,
        by = 1
      } = part;
      for (let i = from; i <= to; i += by) {
        updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (path.length > 1) {
      updatePath(current[part], path, [part].concat(traversed));
      return;
    }
    prev = current[part];
    traversed = [part].concat(traversed);
  }
  let value = path[0];
  if (typeof value === "function") {
    value = value(prev, traversed);
    if (value === prev) return;
  }
  if (part === undefined && value == undefined) return;
  value = unwrap(value);
  if (part === undefined || isWrappable(prev) && isWrappable(value) && !Array.isArray(value)) {
    mergeStoreNode(prev, value);
  } else setProperty(current, part, value);
}
function createStore(...[store, options]) {
  const unwrappedStore = unwrap(store || {});
  const isArray = Array.isArray(unwrappedStore);
  const wrappedStore = wrap$1(unwrappedStore);
  function setStore(...args) {
    batch(() => {
      isArray && args.length === 1 ? updateArray(unwrappedStore, args[0]) : updatePath(unwrappedStore, args);
    });
  }
  return [wrappedStore, setStore];
}

const precipitaciones = [
  {
    name: "Alchichilca",
    jul: 6,
    jun: 49,
    may: 13
  },
  {
    name: "Acajete",
    jul: 43,
    jun: 73,
    may: 51
  },
  {
    name: "Acatl\xE1n de Osorio",
    jul: 23,
    jun: 28,
    may: 13
  },
  {
    name: "\xC1fricam",
    jul: 48,
    jun: 26,
    may: 11
  },
  {
    name: "Ahuatepec",
    jul: 5,
    jun: 32,
    may: 18
  },
  {
    name: "Ahuazontepec",
    jul: 41,
    jun: 112,
    may: 0
  },
  {
    name: "Apapantilla",
    jul: 181,
    jun: 347,
    may: 47
  },
  {
    name: "Atlixco",
    jul: 84,
    jun: 105,
    may: 29
  },
  {
    name: "\xC1vila Camacho",
    jul: 433,
    jun: 373,
    may: 36
  },
  {
    name: "Buenos Aires CFE",
    jul: 247,
    jun: 527,
    may: 86
  },
  {
    name: "Manuel \xC1vila Camacho",
    jul: 50,
    jun: 21,
    may: 10
  },
  {
    name: "Ciudad Serd\xE1n",
    jul: 23,
    jun: 30,
    may: 9
  },
  {
    name: "Cemex",
    jul: 46,
    jun: 15,
    may: 73
  },
  {
    name: "Chietla",
    jul: 83,
    jun: 58,
    may: 8
  },
  {
    name: "Cholula",
    jul: 94,
    jun: 74,
    may: 46
  },
  {
    name: "Chila de la Sal",
    jul: 80,
    jun: 54,
    may: 8
  },
  {
    name: "Conagua",
    jul: 80,
    jun: 41,
    may: 48
  },
  {
    name: "Chignahuapan",
    jul: 105,
    jun: 110,
    may: 18
  },
  {
    name: "Coatzingo",
    jul: 30,
    jun: 31,
    may: 8
  },
  {
    name: "Capulac",
    jul: 112,
    jun: 103,
    may: 45
  },
  {
    name: "Cuetzalan del Progreso",
    jul: 549,
    jun: 504,
    may: 149
  },
  {
    name: "Echeverr\xEDa",
    jul: 113,
    jun: 64,
    may: 25
  },
  {
    name: "El Fraile",
    jul: 52,
    jun: 0,
    may: 0
  },
  {
    name: "Huejotzingo",
    jul: 175,
    jun: 105,
    may: 39
  },
  {
    name: "Huaquechula",
    jul: 96,
    jun: 72,
    may: 21
  },
  {
    name: "Huauchinango",
    jul: 270,
    jun: 387,
    may: 27
  },
  {
    name: "Ixcamilpa",
    jul: 131,
    jun: 0,
    may: 0
  },
  {
    name: "Ixtacamaxtitl\xE1n",
    jul: 34,
    jun: 62,
    may: 46
  },
  {
    name: "Iz\xFAcar de Matamoros",
    jul: 83,
    jun: 68,
    may: 18
  },
  {
    name: "Mayorazgo 21 Poniente",
    jul: 105,
    jun: 55,
    may: 36
  },
  {
    name: "Metlaltoyuca",
    jul: 197,
    jun: 359,
    may: 11
  },
  {
    name: "Naranjastitla",
    jul: 436,
    jun: 382,
    may: 45
  },
  {
    name: "Necaxa",
    jul: 330,
    jun: 386,
    may: 0
  },
  {
    name: "Necaxa",
    jul: 435,
    jun: 507,
    may: 69
  },
  {
    name: "Oyameles",
    jul: 41,
    jun: 76,
    may: 0
  },
  {
    name: "Pahuatl\xE1n de Valle",
    jul: 0,
    jun: 321,
    may: 13
  },
  {
    name: "Paso Carretas",
    jul: 141,
    jun: 170,
    may: 16
  },
  {
    name: "Piaxtla",
    jul: 44,
    jun: 56,
    may: 6
  },
  {
    name: "Puente Palomas",
    jul: 47,
    jun: 183,
    may: 56
  },
  {
    name: "Patla",
    jul: 590,
    jun: 437,
    may: 41
  },
  {
    name: "Observatorio de Puebla",
    jul: 46,
    jun: 35,
    may: 57
  },
  {
    name: "Observatorio de Puebla",
    jul: 67,
    jun: 46,
    may: 35
  },
  {
    name: "Quimixtl\xE1n",
    jul: 259,
    jun: 384,
    may: 23
  },
  {
    name: "Rancho Nuevo",
    jul: 376,
    jun: 260,
    may: 136
  },
  {
    name: "San Crist\xF3bal Caleras",
    jul: 118,
    jun: 36,
    may: 27
  },
  {
    name: "San Jos\xE9 Acateno",
    jul: 94,
    jun: 189,
    may: 102
  },
  {
    name: "San Miguel Canoa",
    jul: 77,
    jun: 45,
    may: 54
  },
  {
    name: "San Mart\xEDn Texmelucan",
    jul: 153,
    jun: 77,
    may: 32
  },
  {
    name: "La Soledad",
    jul: 372,
    jun: 523,
    may: 100
  },
  {
    name: "Santa Rita Tlahuapan",
    jul: 98,
    jun: 129,
    may: 13
  },
  {
    name: "Sontalalco CFE",
    jul: 263,
    jun: 532,
    may: 51
  },
  {
    name: "Tepango de Rodr\xEDguez",
    jul: 202,
    jun: 500,
    may: 26
  },
  {
    name: "Tecamachalco",
    jul: 4,
    jun: 6,
    may: 7
  },
  {
    name: "Tehuac\xE1n",
    jul: 20,
    jun: 102,
    may: 10
  },
  {
    name: "Teotlalco",
    jul: 149,
    jun: 125,
    may: 3
  },
  {
    name: "Tetela de Ocampo",
    jul: 59,
    jun: 176,
    may: 20
  },
  {
    name: "Tepexic",
    jul: 398,
    jun: 423,
    may: 20
  },
  {
    name: "Teziutl\xE1n",
    jul: 103,
    jun: 1,
    may: 0
  },
  {
    name: "Teziutl\xE1n",
    jul: 93,
    jun: 338,
    may: 15
  },
  {
    name: "Tlacotepec de D\xEDaz",
    jul: 676,
    jun: 890,
    may: 34
  },
  {
    name: "Tlaxco",
    jul: 67,
    jun: 88,
    may: 5
  },
  {
    name: "Tepeyahualco",
    jul: 31,
    jun: 26,
    may: 29
  },
  {
    name: "Tepeyac",
    jul: 545,
    jun: 418,
    may: 61
  },
  {
    name: "Universidad de la Sierra",
    jul: 286,
    jun: 379,
    may: 28
  },
  {
    name: "Universidad Tecnol\xF3gica Tecamachalco",
    jul: 7,
    jun: 9,
    may: 10
  },
  {
    name: "Venustiano Carranza",
    jul: 37,
    jun: 198,
    may: 89
  },
  {
    name: "Xicotepec de Ju\xE1rez",
    jul: 598,
    jun: 524,
    may: 68
  },
  {
    name: "Zacapoaxtla",
    jul: 78,
    jun: 0,
    may: 9
  },
  {
    name: "Zoquitl\xE1n",
    jul: 353,
    jun: 558,
    may: 104
  },
  {
    name: "Zaragoza",
    jul: 72,
    jun: 162,
    may: 0
  }
];

const sequiaCiclica = [
  "Acatl\xE1n",
  "Ahuatl\xE1n",
  "Ahuehuetitla",
  "Albino Zertuche",
  "Altepexi",
  "Atexcal",
  "Atzala",
  "Axutla",
  "Caltepec",
  "Chapulco",
  "Chiautla",
  "Chietla",
  "Chigmecatitl\xE1n",
  "Chila",
  "Chila de la Sal",
  "Chinantla",
  "Coatzingo",
  "Cohetzala",
  "Coxcatl\xE1n",
  "Coyotepec",
  "Cuayuca de Andrade",
  "Cuyoaco",
  "Epatl\xE1n",
  "Guadalupe",
  "Huatlatlauca",
  "Huehuetl\xE1n el Chico",
  "Huehuetl\xE1n el Grande",
  "Ixcamilpa de Guerrero",
  "Ixcaquixtla",
  "Iz\xFAcar de Matamoros",
  "Jolalpan",
  "Juan N. M\xE9ndez",
  "La Magdalena Tlatlauquitepec",
  "Libres",
  "Molcaxac",
  "Nicol\xE1s Bravo",
  "Ocotepec",
  "Oriental",
  "Petlalcingo",
  "Piaxtla",
  "San Antonio Ca\xF1ada",
  "San Diego la Mesa Tochimiltzingo",
  "San Gabriel Chilac",
  "San Jer\xF3nimo Xayacatl\xE1n",
  "San Jos\xE9 Miahuatl\xE1n",
  "San Juan Atzompa",
  "San Mart\xEDn Totoltepec",
  "San Miguel Ixitl\xE1n",
  "San Pablo Anicano",
  "San Pedro Yeloixtlahuaca",
  "Santa Catarina Tlaltempan",
  "Santa In\xE9s Ahuatempan",
  "Santiago Miahuatl\xE1n",
  "Tecomatl\xE1n",
  "Tehuac\xE1n",
  "Tehuitzingo",
  "Teopantl\xE1n",
  "Teotlalco",
  "Tepanco de L\xF3pez",
  "Tepeojuma",
  "Tepexco",
  "Tepexi de Rodr\xEDguez",
  "Tepeyahualco",
  "Tilapa",
  "Tlapanal\xE1",
  "Totoltepec de Guerrero",
  "Tulcingo",
  "Xayacatl\xE1n de Bravo",
  "Xicotl\xE1n",
  "Xochiltepec",
  "Zacapala",
  "Zapotitl\xE1n",
  "Zinacatepec"
];

const municipios = [
  {
    name: "Acajete",
    total: "1510"
  },
  {
    name: "Acatl\xE1n",
    total: "395"
  },
  {
    name: "Acatzingo",
    total: "150"
  },
  {
    name: "Ahuatl\xE1n",
    total: "0"
  },
  {
    name: "Ahuehuetitla",
    total: "100"
  },
  {
    name: "Albino Zertuche",
    total: "60"
  },
  {
    name: "Aljojuca",
    total: "200"
  },
  {
    name: "Altepexi",
    total: "50"
  },
  {
    name: "Amozoc",
    total: "480"
  },
  {
    name: "Atzala",
    total: "70"
  },
  {
    name: "Axutla",
    total: "85"
  },
  {
    name: "Caltepec",
    total: "170"
  },
  {
    name: "Chalchicomula de Sesma",
    total: "2544"
  },
  {
    name: "Chapulco",
    total: "90"
  },
  {
    name: "Chiautla",
    total: "150"
  },
  {
    name: "Chietla",
    total: "50"
  },
  {
    name: "Chiqmecatitl\xE1n",
    total: "0"
  },
  {
    name: "Chila de la Sal",
    total: "50"
  },
  {
    name: "Chila de las Flores",
    total: "0"
  },
  {
    name: "Chinantla",
    total: "80"
  },
  {
    name: "Coatzingo",
    total: "0"
  },
  {
    name: "Cohetzala",
    total: "110"
  },
  {
    name: "Coxcatl\xE1n",
    total: "70"
  },
  {
    name: "Coyotepec",
    total: "110"
  },
  {
    name: "Cuautinchan",
    total: "593"
  },
  {
    name: "Cuayuca de Andrade",
    total: "0"
  },
  {
    name: "Epatl\xE1n",
    total: "30"
  },
  {
    name: "Esperanza",
    total: "350"
  },
  {
    name: "Guadalupe",
    total: "90"
  },
  {
    name: "Guadalupe Victoria",
    total: "640"
  },
  {
    name: "Huatlatlauca",
    total: "200"
  },
  {
    name: "Huehuetl\xE1n el Grande",
    total: "235"
  },
  {
    name: "Huehuetl\xE1n el Chico",
    total: "240"
  },
  {
    name: "Ixcamilpa de Guerrero",
    total: "335"
  },
  {
    name: "Ixcaquixtla",
    total: "150"
  },
  {
    name: "Ixtacamaxtitl\xE1n",
    total: "300"
  },
  {
    name: "Iz\xFAcar de Matamoros",
    total: "380"
  },
  {
    name: "Jolalpan",
    total: "360"
  },
  {
    name: "Juan N. M\xE9ndez",
    total: "287"
  },
  {
    name: "Lafragua",
    total: "540"
  },
  {
    name: "La Magdalena Tlatlauquitepec",
    total: "12"
  },
  {
    name: "Molcaxac",
    total: "320"
  },
  {
    name: "Nopalucan",
    total: "790"
  },
  {
    name: "Oriental",
    total: "750"
  },
  {
    name: "Palmar de Bravo",
    total: "300"
  },
  {
    name: "Petlalcingo",
    total: "0"
  },
  {
    name: "Piaxtla",
    total: "150"
  },
  {
    name: "Rafael Lara Grajales",
    total: "700"
  },
  {
    name: "San Diego la Mesa Tochimiltzingo",
    total: "108"
  },
  {
    name: "San Gabriel Chilac",
    total: "40"
  },
  {
    name: "San Jer\xF3nimo Xayacatl\xE1n",
    total: "0"
  },
  {
    name: "San Jos\xE9 Chiapa",
    total: "500"
  },
  {
    name: "San Jos\xE9 Miahuatl\xE1n",
    total: "50"
  },
  {
    name: "San Juan Atenco",
    total: "630"
  },
  {
    name: "San Juan Atzompa",
    total: "40"
  },
  {
    name: "San Mart\xEDn Totoltepec",
    total: "55"
  },
  {
    name: "San Miguel Ixitl\xE1n",
    total: "20"
  },
  {
    name: "San Nicol\xE1s Buenos Aires",
    total: "250"
  },
  {
    name: "San Pablo Anicano",
    total: "0"
  },
  {
    name: "San Pedro Yeloixtlahuaca",
    total: "0"
  },
  {
    name: "San Salvador el Seco",
    total: "650"
  },
  {
    name: "Santa Catarina Tlaltempan",
    total: "0"
  },
  {
    name: "Santa In\xE9s Ahuatempan",
    total: "200"
  },
  {
    name: "Santiago Miahuatl\xE1n",
    total: "50"
  },
  {
    name: "Soltepec",
    total: "650"
  },
  {
    name: "Tecomatl\xE1n",
    total: "145"
  },
  {
    name: "Tepeaca",
    total: "970"
  },
  {
    name: "Tehuitzingo",
    total: "360"
  },
  {
    name: "Teopantl\xE1n",
    total: "80"
  },
  {
    name: "Teotlalco",
    total: "115"
  },
  {
    name: "Tehuac\xE1n",
    total: "200"
  },
  {
    name: "Tepexco",
    total: "135"
  },
  {
    name: "Tepexi de Rodr\xEDguez",
    total: "550"
  },
  {
    name: "Tepeyahualco",
    total: "740"
  },
  {
    name: "Tepatlaxco de Hidalgo",
    total: "700"
  },
  {
    name: "Tilapa",
    total: "0"
  },
  {
    name: "Tlachichuca",
    total: "700"
  },
  {
    name: "Tlapanala",
    total: "160"
  },
  {
    name: "Totoltepec de Guerrero",
    total: "12"
  },
  {
    name: "Tulcingo de Valle",
    total: "0"
  },
  {
    name: "Xayacatl\xE1n de Bravo",
    total: "0"
  },
  {
    name: "Xicotl\xE1n",
    total: "140"
  },
  {
    name: "Xochiltepec",
    total: "0"
  },
  {
    name: "Zacapala",
    total: "205"
  },
  {
    name: "Zapotitl\xE1n Salinas",
    total: "0"
  },
  {
    name: "Zinacatepec",
    total: "100"
  }
];

const _tmpl$$2 = /*#__PURE__*/template(`<form class="control-form"></form>`),
      _tmpl$2$1 = /*#__PURE__*/template(`<label><input type="radio" name="graphics"></label>`);
function Controls() {
  const [checkeds, setCheckeds] = createStore({
    "sequia": false,
    "indemnizados": false,
    "may": false,
    "jun": false,
    "jul": false
  });

  const reset = () => document.querySelectorAll('path[name]').forEach(path => {
    path.classList.remove('may', 'june', 'jul');
    path.style.fill = 'transparent';
    path.style.opacity = '1';
  });

  const changeColorUntillAverge = (path, color) => {
    let colorObj = { ...color
    };
    return `rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})`;
  };

  const changeSVGClass = (name, checked, color) => {
    const path = document.querySelector(`[name="${name}"]`);
    let colorObj = { ...color
    };
    let finalColor = changeColorUntillAverge(path, colorObj);

    if (!checked) {
      path.style.fill = "transparent";
      return;
    }

    path.style.fill = finalColor;
  };

  const changeSVGColor = (name, intensity, media, checked, color, month) => {
    const path = document.querySelector(`[name="${name}"]`);

    if (path != null) {
      if (checked) {
        path.style.fill = changeColorUntillAverge(path, color);
        path.style.opacity = intensity / media;
        path.classList.add(month);
        return;
      }

      path.style.opacity = 1;
      path.style.fill = "transparent";
      path.classList.remove(month);
    }
  };

  const getMedia = numbers => {
    let sum = 0;
    numbers.forEach(num => {
      sum += num;
    });
    return sum / (numbers.length + 1);
  };

  const handleChange = (option, checked, color) => {
    reset();

    switch (option) {
      case 'Sequías cíclicas':
        setCheckeds('sequia', checked);
        sequiaCiclica.forEach(municipio => {
          changeSVGClass(municipio, checked, color);
        });
        break;

      case 'Municipios indemnizados':
        setCheckeds('indemnizados', checked);
        municipios.forEach(({
          total,
          name
        }) => {
          changeSVGColor(name, parseInt(total), 500, checked, color, 'indem');
        });
        break;

      case 'Datos de precipitación de Mayo':
        setCheckeds('may', checked);
        precipitaciones.forEach(({
          name,
          may
        }) => {
          changeSVGColor(name, may, getMedia(precipitaciones.map(({
            may
          }) => may)), checked, color, 'may');
        });
        break;

      case 'Datos de precipitación de Junio':
        setCheckeds('jun', checked);
        precipitaciones.forEach(({
          name,
          jun
        }) => {
          changeSVGColor(name, jun, getMedia(precipitaciones.map(({
            jun
          }) => jun)), checked, color, 'jun');
        });
        break;

      case 'Datos de precipitación de Julio':
        setCheckeds('jul', checked);
        precipitaciones.forEach(({
          name,
          jul
        }) => {
          changeSVGColor(name, jul, getMedia(precipitaciones.map(({
            jul
          }) => jul)), checked, color, 'jul');
        });
        break;

    }
  };

  return (() => {
    const _el$ = _tmpl$$2.cloneNode(true);

    insert(_el$, createComponent(For, {
      each: controls,
      children: ({
        control,
        color
      }) => (() => {
        const _el$2 = _tmpl$2$1.cloneNode(true),
              _el$3 = _el$2.firstChild;

        _el$3.addEventListener("change", e => handleChange(control, e.target.checked, color));

        insert(_el$2, control, null);

        return _el$2;
      })()
    }));

    return _el$;
  })();
}


const map = '';

const _tmpl$ = /*#__PURE__*/template(`<main class="main"><!#><!/><!#><!/><!#><!/></main>`);
function Index() {
  return (() => {
    const _el$ = getNextElement(_tmpl$),
          _el$2 = _el$.firstChild,
          [_el$3, _co$] = getNextMarker(_el$2.nextSibling),
          _el$4 = _el$3.nextSibling,
          [_el$5, _co$2] = getNextMarker(_el$4.nextSibling),
          _el$6 = _el$5.nextSibling,
          [_el$7, _co$3] = getNextMarker(_el$6.nextSibling);

    insert(_el$, createComponent(Title, {
      children: "Mapa de calor"
    }), _el$3, _co$);

    insert(_el$, createComponent(Controls, {}), _el$5, _co$2);

    insert(_el$, createComponent(Map$1, {}), _el$7, _co$3);

    return _el$;
  })();
}

export { Index as default };