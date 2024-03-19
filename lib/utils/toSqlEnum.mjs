//      

export default function toSqlEnum(obj         )         {
  return Object.keys(obj)
    .map((a) => JSON.stringify(a))
    .join()
    .replace(/"/g, "'")
}
