import React from 'react';

interface ProductAttribute {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ProductAttributesGridProps {
  attributes: ProductAttribute[];
}

export function ProductAttributesGrid({ attributes }: ProductAttributesGridProps) {
  if (!attributes || attributes.length === 0) return null;

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-md overflow-hidden mb-2">
      <div className="grid grid-cols-2 divide-x divide-[#E0E0E0] divide-y">
        {attributes.map((attr, index) => (
          <div 
            key={index} 
            className={`
              px-1.5 py-1.5 flex flex-col justify-center
              ${index >= attributes.length - (attributes.length % 2 === 0 ? 0 : 1) ? '' : 'border-b-[#E0E0E0]'}
            `}
          >
            <span className="text-[9px] text-[#666666] mb-0.5 leading-none">{attr.label}</span>
            <span className={`text-[11px] font-bold leading-tight break-all ${attr.highlight ? 'text-[#0047AB]' : 'text-[#333333]'}`}>
              {attr.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
