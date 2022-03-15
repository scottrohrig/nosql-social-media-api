module.exports = ( datetime ) => {
  return new Date( datetime ).toLocaleString( 'en-US', {
    hourCycle: 'h12',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  } );
};
