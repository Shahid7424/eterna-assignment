import React, { memo, useState } from 'react';

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  align?: 'left' | 'right';
}

export const Popover = memo(({ trigger, content, align = 'left' }: PopoverProps) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div onClick={() => setShow(!show)}>
        {trigger}
      </div>
      {show && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShow(false)} />
          <div className={`absolute z-40 mt-2 w-80 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}>
            {content}
          </div>
        </>
      )}
    </div>
  );
});

Popover.displayName = 'Popover';