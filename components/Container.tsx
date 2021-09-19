import { Flex, useColorModeValue, FlexProps } from '@chakra-ui/react';

export const Container = (props: FlexProps) => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      bg={useColorModeValue('gray.100', 'gray.800')}
      color={useColorModeValue('black', 'white')}
      {...props}
    />
  );
};
