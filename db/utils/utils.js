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

exports.makeRefObj = (list, refKey, refValue) => {
  if (!list.length) return {};
  const newRefObj = {};
  list.forEach(obj => (newRefObj[obj[refKey]] = obj[refValue]));
  return newRefObj;
};

exports.formatComments = (comments, articleRef) => {
  if (!comments.length) return [];
  const formattedComments = [];
  comments.forEach(comment => {
    const newComment = {};
    for (let key in comment) {
      if (key === "created_by") {
        newComment.author = comment[key];
        delete comment.created_by;
      } else if (key === "belongs_to") {
        newComment.article_id = articleRef[comment[key]];
      } else if (key === "created_at") {
        newComment.created_at = new Date(comment[key]);
      } else {
        newComment[key] = comment[key];
      }
    }
    formattedComments.push(newComment);
  });
  return formattedComments;
};
