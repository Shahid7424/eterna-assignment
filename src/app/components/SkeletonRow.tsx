import React, { memo } from 'react';

export const SkeletonRow = memo(() => (
  <tr className="animate-pulse border-b border-gray-800">
    {[...Array(11)].map((_, i) => (
      <td key={i} className="px-3 py-4">
        <div className="h-4 bg-gray-800 rounded w-full"></div>
      </td>
    ))}
  </tr>
));

SkeletonRow.displayName = 'SkeletonRow';