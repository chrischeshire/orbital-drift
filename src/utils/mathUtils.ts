import { Cartesian3, JulianDate, Math as CesiumMath } from "cesium";

/**
 * Calculates the velocity of a satellite based on its position at two different times.
 * @param currentPosition - The satellite's position at the current time.
 * @param previousPosition - The satellite's position at the previous time.
 * @param currentTime - The current Cesium JulianDate.
 * @param previousTime - The previous Cesium JulianDate.
 * @returns The velocity as a Cartesian3 object, or null if positions are invalid.
 */
export function calculateVelocity(
  currentPosition: Cartesian3 | null,
  previousPosition: Cartesian3 | null,
  currentTime: JulianDate,
  previousTime: JulianDate
): Cartesian3 | null {
  if (!currentPosition || !previousPosition) return null;

  // Calculate the difference in position
  const deltaPosition = Cartesian3.subtract(
    currentPosition,
    previousPosition,
    new Cartesian3()
  );

  // Calculate the difference in time (in seconds)
  const deltaTime = JulianDate.secondsDifference(currentTime, previousTime);

  // Calculate velocity as position difference divided by time difference
  return Cartesian3.multiplyByScalar(deltaPosition, 1 / deltaTime, new Cartesian3());
}

/**
 * Calculates the Doppler shift based on the base frequency and radial velocity.
 * @param baseFrequencyHz - The base frequency in Hz.
 * @param radialVelocity - The radial velocity in m/s.
 * @returns The Doppler shift in Hz.
 */
export function calculateDopplerShift(
  baseFrequencyHz: number,
  radialVelocity: number
): number {
  const speedOfLight = 299792458; // Speed of light in m/s
  return baseFrequencyHz * (radialVelocity / speedOfLight);
}

/**
 * Calculates the line-of-sight vector between two positions.
 * @param satellitePosition - The satellite's position as a Cartesian3.
 * @param groundStationPosition - The ground station's position as a Cartesian3.
 * @returns The normalized line-of-sight vector as a Cartesian3.
 */
export function calculateLineOfSight(
  satellitePosition: Cartesian3,
  groundStationPosition: Cartesian3
): Cartesian3 {
  const lineOfSight = Cartesian3.subtract(
    satellitePosition,
    groundStationPosition,
    new Cartesian3()
  );
  return Cartesian3.normalize(lineOfSight, new Cartesian3());
}

/**
 * Calculates the radial velocity of a satellite relative to a ground station.
 * @param satelliteVelocity - The satellite's velocity as a Cartesian3.
 * @param lineOfSight - The normalized line-of-sight vector as a Cartesian3.
 * @returns The radial velocity in m/s.
 */
export function calculateRadialVelocity(
  satelliteVelocity: Cartesian3,
  lineOfSight: Cartesian3
): number {
  return Cartesian3.dot(satelliteVelocity, lineOfSight);
}

/**
 * Calculates the azimuth angle (degrees) from an ENU vector.
 * Azimuth is the angle clockwise from North.
 * @param enuVector - The ENU vector as a Cartesian3.
 * @returns The azimuth angle in degrees.
 */
export function calculateAzimuth(enuVector: Cartesian3): number {
  const azimuth = Math.atan2(enuVector.x, enuVector.y); // atan2(East, North)
  return CesiumMath.toDegrees(azimuth >= 0 ? azimuth : azimuth + 2 * Math.PI); // Normalize to [0, 360]
}

/**
 * Calculates the elevation angle (degrees) from an ENU vector.
 * Elevation is the angle above the horizon.
 * @param enuVector - The ENU vector as a Cartesian3.
 * @returns The elevation angle in degrees.
 */
export function calculateElevation(enuVector: Cartesian3): number {
  const horizontalDistance = Math.sqrt(enuVector.x ** 2 + enuVector.y ** 2); // Horizontal distance (East-North plane)
  const elevation = Math.atan2(enuVector.z, horizontalDistance); // atan2(Up, Horizontal)
  return CesiumMath.toDegrees(elevation); // Convert to degrees
}