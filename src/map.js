import { loadList, loadDetails } from './api';
import { getDetailsContentLayout } from './details';
import { createFilterControl } from './filter';

export function initMap(ymaps, containerId) {
  const myMap = new ymaps.Map(containerId, {
    center: [55.45, 37.36],
    controls: [],
    zoom: 9
  });

  const objectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 128,
    clusterIconLayout: 'default#pieChart',
    clusterDisableClickZoom: false,
    geoObjectHasBalloon: true,
    geoObjectOpenBalloonOnClick: false,
    geoObjectHideIconOnBalloonOpen: false,
    geoObjectBalloonContentLayout: getDetailsContentLayout(ymaps)
  });

  myMap.geoObjects.add(objectManager);

  loadList().then(data => {
    objectManager.add(JSON.stringify(data));
  });

  // details
  objectManager.objects.events.add('click', event => {
    const objectId = event.get('objectId');
    const obj = objectManager.objects.getById(objectId);

    if (!obj.properties.details) {
      loadDetails(objectId).then(data => {
        obj.properties.details = data;
        objectManager.objects.balloon.setData(obj);
        objectManager.objects.balloon.open(objectId);
      });
    }
  });

  // filters
  const listBoxControl = createFilterControl(ymaps);
  myMap.controls.add(listBoxControl);

  const filterMonitor = new ymaps.Monitor(listBoxControl.state);
  filterMonitor.add('filters', filters => {
    objectManager.setFilter(
      obj => filters[obj.isActive ? 'active' : 'defective']
    );
  });
}
