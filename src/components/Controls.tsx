import controls from "~/data/controls";
import { createEffect, For } from 'solid-js';
import { createStore } from 'solid-js/store';
import {precipitaciones, sequiaCiclica, municipios} from '../data';
import { avrRGB } from '../utils/avrgRGB';

interface Color {
  r: number;
  g: number;
  b: number;
}

export function Controls() {
  const [checkeds, setCheckeds] = createStore({
    "sequia": false,
    "indemnizados": false,
    "may": false,
    "jun": false,
    "jul": false,
  })
  const reset = () =>
    document.querySelectorAll('path[name]').forEach( path => {
      path.classList.remove('may', 'june', 'jul');
      path.style.fill = 'transparent';
      path.style.opacity = '1';
    })

  const changeColorUntillAverge = (path: HTMLElement, color: Color) => {
    let colorObj = {...color}

    return `rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})`;
  }

  const rgbExists = (path: HTMLElement): boolean => (path.style.fill).match("rgb")
  
  const changeSVGClass = (name: string, checked: boolean, color: Color) => {
    const path = document.querySelector(`[name="${name}"]`);
    let colorObj = {...color}
    let finalColor = changeColorUntillAverge(path, colorObj);

    if(!checked) {
      path.style.fill = "transparent";
      return;
    }

    path.style.fill = finalColor;
  }

  const changeSVGColor = (name: string, intensity: number, media: number, checked: boolean, color: Color, month: string) => {
    const path = document.querySelector(`[name="${name}"]`)
    if(path != null) {
      if(checked) {
        path.style.fill = changeColorUntillAverge(path, color);
        path.style.opacity = intensity/media
        path.classList.add(month)
        return
      }
      path.style.opacity = 1;
      path.style.fill = "transparent";
      path.classList.remove(month)

    }

  } 

  const getMedia = (numbers: number[]): number => {
    let sum = 0;

    numbers.forEach(num => {
      sum += num
    });

    return sum / (numbers.length + 1);
  }

  const handleChange = (option: string, checked: boolean, color: Color): void => {

    switch(option) {
      case 'Sequías cíclicas':
        setCheckeds('sequia', checked);
        sequiaCiclica.forEach(municipio => {
          changeSVGClass(municipio, checked, color);
        })
      break;

      case 'Municipios indemnizados':
        setCheckeds('indemnizados', checked);
        municipios.forEach(({total, name}) => {
          changeSVGColor(name, parseInt(total), 500, checked, color, 'indem');
        })
      break;

      case 'Datos de precipitación de Mayo':
        setCheckeds('may', checked);
        precipitaciones.forEach( ({name, may}) => {
          changeSVGColor(name, may, getMedia(precipitaciones.map(({may}) => may)), checked, color, 'may')
        })
      break;

      case 'Datos de precipitación de Junio':
        setCheckeds('jun', checked);
        precipitaciones.forEach( ({name, jun}) => {
          changeSVGColor(name, jun, getMedia(precipitaciones.map(({jun}) => jun)), checked, color, 'jun')
        })
      break;

      case 'Datos de precipitación de Julio':
        setCheckeds('jul', checked);
        precipitaciones.forEach( ({name, jul}) => {
          changeSVGColor(name, jul, getMedia(precipitaciones.map(({jul}) => jul)), checked, color, 'jul')
        })
      break;

      default:
        // document.querySelectorAll('.selected').forEach(path => path.classList.remove('selected'))
    }
  }


  return (
    <>
      <form class="control-form">
        <For each={controls}>{({control, color}) =>
          <label>
            <input type="checkbox" name="graphics" onchange={(e) => handleChange(control, e.target.checked, color)}/>
            {control}
          </label>
        }</For>
      </form>
    </>
  );
}
