// articles.js
const listArticles = async (req, res) => {
  return res.status(200).json([
  { id: 1, title: "First Article"},
  { id: 2, title: "Second Article" }
]);
};

export default listArticles;