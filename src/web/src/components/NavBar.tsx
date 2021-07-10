import React from 'react';
import { Flex } from '@chakra-ui/react';

function NavBar({ children }: any) {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={4}
      bg={"cyan.700"}
      color={"primary"}
    >
      {children}
    </Flex>
  );
}

export default NavBar;