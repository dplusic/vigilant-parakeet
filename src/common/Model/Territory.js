import inside from "point-in-polygon";

export const makeInitialTerritory = countOfPoints => radius => centerPosition => {
  const radianInterval = (Math.PI * 2) / countOfPoints;
  return [...Array(countOfPoints).keys()].map(index => {
    const radian = radianInterval * index;
    return [
      centerPosition[0] + radius * Math.sin(radian),
      centerPosition[1] + radius * Math.cos(radian)
    ];
  });
};

export const inTerritory = territory => point => inside(point, territory);

const findIndexOfNearest = points => point =>
  points.reduce(
    (acc, cur, idx) => {
      const distance = (cur[0] - point[0]) ** 2 + (cur[1] - point[1]) ** 2;
      if (distance < acc.distance) {
        return {
          distance,
          pointIndex: idx
        };
      } else {
        return acc;
      }
    },
    {
      distance: Number.MAX_VALUE,
      pointIndex: -1
    }
  ).pointIndex;

export const makeNewTerritory = previousTerritory => rawNewBorder => {
  // TODO:
  // ---------------@
  //          <IN>  |  <OUT>
  //                @
  //                |
  //           O----X----O---------O
  //       startIn  |  startOut    |
  //                #              |
  //                |              O newBorder
  //   existBorderA #              |
  //                |              |
  //           O----X----O---------O
  //         endIn  |  endOut
  //                @
  //                |
  //   existBorderB @
  //                |
  // ---------------@

  // TODO: check when length === 1
  if (rawNewBorder.length < 1) {
    return previousTerritory;
  }

  const startPointOfNewBorder = rawNewBorder[0];
  const endPointOfNewBorder = rawNewBorder[rawNewBorder.length - 1];

  const indexOfNearestToStart = findIndexOfNearest(previousTerritory)(
    startPointOfNewBorder
  );
  const indexOfNearestToEnd =
    findIndexOfNearest(previousTerritory)(endPointOfNewBorder) +
    (1 % previousTerritory.length);

  if (indexOfNearestToStart === indexOfNearestToEnd) {
    return previousTerritory;
  }

  const reverse = indexOfNearestToStart > indexOfNearestToEnd;

  const indexOfNearest1 = reverse ? indexOfNearestToEnd : indexOfNearestToStart;
  const indexOfNearest2 = reverse ? indexOfNearestToStart : indexOfNearestToEnd;

  const rawNewBorderReversed = [...rawNewBorder].reverse();

  const newBorder = reverse ? rawNewBorderReversed : rawNewBorder;
  const newBorderReversed = reverse ? rawNewBorder : rawNewBorderReversed;

  const existBorder1 = previousTerritory.slice(
    indexOfNearest1,
    indexOfNearest2
  );
  const existBorder2 = [
    ...previousTerritory.slice(indexOfNearest2),
    ...previousTerritory.slice(0, indexOfNearest1)
  ];

  const newTerritoryCandidate = [...existBorder1, ...newBorderReversed];

  if (inTerritory(newTerritoryCandidate)(existBorder2[0])) {
    return newTerritoryCandidate;
  } else {
    return [...existBorder2, ...newBorder];
  }
};
