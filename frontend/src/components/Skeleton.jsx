export function SkeletonRow() {
  return (
    <tr className="border-b border-surface-100">
      {[1,2,3,4,5,6].map(i => (
        <td key={i} className="px-4 py-4">
          <div className="skeleton h-4 rounded" style={{ width: `${60 + Math.random()*30}%`, animationDelay: `${i*0.1}s` }} />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-3">
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton h-8 w-32 rounded" />
      <div className="skeleton h-3 w-24 rounded" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </tbody>
  )
}
