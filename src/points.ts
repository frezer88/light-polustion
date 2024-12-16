const LIGHT_POLLUTION_TOKEN = 'MTczNDM3OTM2NDUzNjtpc3Vja2RpY2tzOik=';
const LIGHT_POLLUTION_ARRAY: any[] = [];
const getLightPollution = async (lat: number, lng: number) => {
  const url = `https://www.lightpollutionmap.info/QueryRaster/?qk=${LIGHT_POLLUTION_TOKEN}&ql=wa_2015&qt=point&qd=${lat},${lng}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.text();

    return result;
  } catch (error) {
    console.error(error);
  }
};

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const earthRadius = 6371000; // Радиус Земли в метрах

  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1); // Разница широт в радианах
  const dLon = toRadians(lon2 - lon1); // Разница долгот в радианах

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c; // Возвращаем расстояние в метрах
}

function generatePointsInCircle(
  lat: number,
  lng: number,
  radius: number,
  stepDistance: number,
  changedRadius: number = 0,
): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  const earthRadiusKm = 6371;

  for (let r = 0; r <= radius; r += stepDistance) {
    const circumference = 2 * Math.PI * r;
    const stepAngle = (stepDistance / circumference) * 360;

    for (let angle = 0; angle < 360; angle += stepAngle) {
      const offsetLat =
        (r / earthRadiusKm) * (180 / Math.PI) * Math.cos(toRad(angle));
      const offsetLng =
        ((r / earthRadiusKm) * (180 / Math.PI) * Math.sin(toRad(angle))) /
        Math.cos(toRad(lat));

      const distanceToCenter =
        calculateDistance(lat, lng, lat + offsetLat, lng + offsetLng) / 1000;

      // console.log(distanceToCenter);
      if (
        changedRadius === 0 ||
        (distanceToCenter > radius - changedRadius - 1 / 1000 &&
          distanceToCenter < radius + 1 / 1000)
      ) {
        points.push([lat + offsetLat, lng + offsetLng]);
      }
    }
  }
  return points;
}

const getArrayLightPollution = () => {
  return [...LIGHT_POLLUTION_ARRAY];
};

const getLightPollutions = async (
  lat: number,
  lng: number,
  radius: number,
  changedRadius?: number,
) => {
  if (changedRadius === undefined || changedRadius > 0) {
    const points =
      changedRadius === undefined
        ? generatePointsInCircle(lat, lng, radius / 1000, 1.5)
        : generatePointsInCircle(
            lat,
            lng,
            radius / 1000,
            1.5,
            changedRadius / 1000,
          );
    const lightPollutions: {
      lat: number;
      lon: number;
      lightPollutionNumber: number;
    }[] = [];
    console.log('points: ' + points.length + '  ', points);

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      // console.log('index: ' + i);
      const lightPollution = await getLightPollution(point[0], point[1]);
      if (lightPollution) {
        const lightPollutionNumber = parseFloat(lightPollution) * 1000;

        console.log(
          'index: ' +
            i +
            ' lightPollution: ' +
            lightPollution +
            ' lightPollutionNumber: ' +
            lightPollutionNumber,
        );

        if (!isNaN(lightPollutionNumber)) {
          LIGHT_POLLUTION_ARRAY.push({
            lat: point[0],
            lon: point[1],
            lightPollutionNumber,
          });
        }
      }
    }

    // if (LIGHT_POLLUTION_ARRAY.length === 0) {
    //   lightPollutions.forEach(point => {
    //   });
    // }
  } else if (changedRadius < 0) {
    for (let i = LIGHT_POLLUTION_ARRAY.length - 1; i >= 0; i--) {
      const point = LIGHT_POLLUTION_ARRAY[i];
      const distance = calculateDistance(lat, lng, point.lat, point.lon);

      console.log(
        i +
          ' distance ' +
          distance +
          ' radius ' +
          radius +
          ' isDeleted ' +
          (distance > radius),
      );

      if (distance > radius - 1) {
        LIGHT_POLLUTION_ARRAY.splice(i, 1);
        // --i;
      }
    }
  }

  return LIGHT_POLLUTION_ARRAY;
};

export {
  getLightPollution,
  generatePointsInCircle,
  getLightPollutions,
  LIGHT_POLLUTION_ARRAY,
  getArrayLightPollution,
};
