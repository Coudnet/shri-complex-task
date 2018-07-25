export function mapServerData(serverData) {
  return {
    type: "FeatureCollection",
    features: serverData.map((obj, index) => ({
      id: index,
      type: "Feature",
      isActive: obj.isActive,
      geometry: 
      {
        type: "Point",
        coordinates: [obj.long, obj.lat],
      },
      properties: {
          iconCaption: index,
      },
      options: {
          preset: getObjectPreset(obj)
      }
    }))
  };
}

function getObjectPreset(obj) {
  return obj.isActive
    ? 'islands#blueCircleDotIconWithCaption'
    : 'islands#redCircleDotIconWithCaption';
}
