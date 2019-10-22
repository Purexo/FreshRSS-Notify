export default function ruid(seed = new Date().getTime()) {
  return Math.floor(Math.random()
    * (Number.MAX_SAFE_INTEGER - seed)
    + seed
  ).toString(16);
}