export default function(favorites) {
  return favorites.map(f => {
    return {...f, favorite: true};
  })
}