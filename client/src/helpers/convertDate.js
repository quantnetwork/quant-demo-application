export default (timeStamp) => new Date(timeStamp).toLocaleString('en-GB', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
  .split(',')
  .join('');
