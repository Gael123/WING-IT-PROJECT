// CSS
import "bootstrap";
import 'mapbox-gl/dist/mapbox-gl.css'; // <-- you need to uncomment the stylesheet_pack_tag in the layout!
// internal imports
import { initMapbox } from '../plugins/init_mapbox';
import { initModal } from '../components/modal';
import '../components/post_location_input';
import '../components/nearby_markers';

initMapbox();
initModal();
