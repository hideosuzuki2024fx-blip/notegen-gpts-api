export default async function handler(req, res) {
  const url = 'https://raw.githubusercontent.com/hideosuzuki2024fx-blip/NoteGenerator/main/NoteMD/entrypoints.json';
  const response = await fetch(url);
  const data = await response.json();
  res.status(200).json(data);
}
