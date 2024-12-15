const LIGHT_POLLUTION_TOKEN = 'MTczNDI2NDM5OTI3MTtpc3Vja2RpY2tzOik=';

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

function calcCrow(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(radLat1) *
      Math.cos(radLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function generatePointsInCircle(
  lat: number,
  lng: number,
  radius: number,
  stepDistance: number,
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
      points.push([lat + offsetLat, lng + offsetLng]);
    }
  }
  return points;
}

const getLightPollutions = async (lat: number, lng: number, radius: number) => {
  const points = generatePointsInCircle(lat, lng, radius / 1000, 0.3);
  const lightPollutions: {
    lat: number;
    lon: number;
    lightPollutionNumber: number;
  }[] = [];

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
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
        lightPollutions.push({
          lat: point[0],
          lon: point[1],
          lightPollutionNumber,
        });
      }
    }
  }

  return lightPollutions;
};

export {getLightPollution, generatePointsInCircle, getLightPollutions};
