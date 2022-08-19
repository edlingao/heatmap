import { Title } from "solid-start";
import { Controls } from "~/components/Controls";
import { Map } from "~/components/Map";
import '../components/map.scss';
export default function Index() {
  return (
    <main class="main">
        <Title>Mapa de calor</Title>
        <Controls />
        <Map />
    </main>
  );
}
