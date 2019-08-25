exports.formatDates = list => {
  if (!list.length) return [];
  const formattedArray = [];
  list.forEach(dateObj => {
    const newDateObj = {};
    for (let key in dateObj) {
      if (key === "created_at") {
        newDateObj.created_at = new Date(dateObj[key]);
      } else {
        newDateObj[key] = dateObj[key];
      }
    }
    formattedArray.push(newDateObj);
  });
  return formattedArray;
};
