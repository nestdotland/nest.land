import { chakra, HTMLChakraProps } from '@chakra-ui/react';

export const Logo = (props: HTMLChakraProps<'svg'>) => {
  return (
    <chakra.svg viewBox="0 0 32 32" h={10} width="auto" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0)">
        <circle cx="16" cy="16" r="16" fill="url(#paint0_linear)" />
        <ellipse cx="16" cy="19.152" rx="15.68" ry="2.512" fill="url(#paint1_linear)" />
        <path
          d="M15.999 5.76C11.879 5.76 8 12.705 8 18.088c0 5.853 4.017 8.472 7.999 8.472 3.982 0 8.001-2.62 8.001-8.471 0-5.384-3.88-12.329-8.001-12.329z"
          fill="url(#paint2_linear)"
        />
        <path
          d="M31.68 19.2c-.428 1.362-7.284 2.464-15.68 2.464S.747 20.562.32 19.2C1.843 26.51 8.285 32 16 32s14.156-5.49 15.68-12.8z"
          fill="url(#paint3_linear)"
        />
      </g>
      <defs>
        <linearGradient id="paint0_linear" x1="16" y1="0" x2="16" y2="21.6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="paint1_linear" x1="16" y1="16.64" x2="16" y2="21.664" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C4B5FD" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="paint2_linear" x1="16" y1="5.76" x2="16" y2="26.56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9FAFB" />
          <stop offset="1" stopColor="#F3F4F6" />
        </linearGradient>
        <linearGradient id="paint3_linear" x1="16" y1="19.2" x2="16" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
        <clipPath id="clip0">
          <path d="M0 16C0 7.163 7.163 0 16 0s16 7.163 16 16-7.163 16-16 16S0 24.837 0 16z" fill="#fff" />
        </clipPath>
      </defs>
    </chakra.svg>
  );
};

export default Logo;
