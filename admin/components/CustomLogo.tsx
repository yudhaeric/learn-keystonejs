/** @jsxRuntime classic */
/** @jsx jsx */
import Link from 'next/link';
import { jsx, H3 } from '@keystone-ui/core';

export const CustomLogo = () => {
  return (
    <H3>
      <Link
        href="/"
        css={{
          // TODO: we don't have colors in our design-system for this.
          color: '#872238',
          fontSize: '28px',
          backgroundClip: 'text',
          textDecoration: 'none',
        }}
      >
        AITINDO
      </Link>
    </H3>
  );
};