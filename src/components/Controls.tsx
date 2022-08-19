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
    "month": false,
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
    path.style.opacity = 1;
    path.style.fill = finalColor;
  }

  const changeSVGColor = (name: string, intensity: number, max: number, checked: boolean, color: Color, month: string) => {
    console.log(max);
    const path = document.querySelector(`[name="${name}"]`)
    if(path != null) {
      if(checked) {
        path.style.fill = changeColorUntillAverge(path, color);
        path.style.opacity = (intensity/max) * 10
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
      break;

      case 'Municipios indemnizados':
        setCheckeds('indemnizados', checked);
      break;

      case 'Datos de precipitación de Mayo, Junio y Julio':
        setCheckeds('month', checked);
      break;

      default:
        // document.querySelectorAll('.selected').forEach(path => path.classList.remove('selected'))
    }
  }

  createEffect(() => {
    reset();
    if(checkeds.sequia) {
      sequiaCiclica.forEach(municipio => {
        changeSVGClass(municipio, true, controls[0].color);
      })
    }

    if(checkeds.indemnizados) {
      municipios.forEach(({total, name}) => {
        changeSVGColor(name, parseInt(total), 500, true, controls[1].color, 'indem');
      })
    }

    if(checkeds.month) {
      precipitaciones.forEach( ({name, may}) => {
        changeSVGColor(name, may, getMedia(precipitaciones.map(({may, jul, jun}) => may + jul + jun)), true, controls[2].color, 'may')
      })
    }

  })


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
