import { Flex, Heading } from '@chakra-ui/react';

export const Hero = ({ title }: { title: string }) => (
  <Flex
    justifyContent="center"
    alignItems="center"
    height="100vh"
    bgGradient="linear(to-r, #6366F1, #A855F7)"
    bgClip="text"
  >
    <Heading fontSize="6vw">{title}</Heading>
  </Flex>
);

Hero.defaultProps = {
  title: 'Nest Land',
};
