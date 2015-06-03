export default function renderif(cond) {
  return body => cond ? body : null;
}