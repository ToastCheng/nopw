import { Center, Container, Flex, Text } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { connect } from 'react-redux';
import { UserState } from "../stores/user/reducer";


const PlaceHolder = () => {
  return (
    <Flex
      justify={{ base: "center", md: "space-around", xl: "space-around" }}
      direction={{ base: "column-reverse", md: "column", xl: "column" }}
      wrap="nowrap"
      minH="70vh"
      align="center"
    >
      <Center>
        <Text fontSize="3xl">
          Try to Sign In with TouchID!
        </Text>
      </Center>
    </Flex>
  );
}

const MainPage = (props: any) => {
  const { user } = props;
  if (!user.email) {
    return <PlaceHolder />
  }

  return (
    <>
      <Container maxW="container.md">
        This is your Account Page.
        <br />
        Your key is saved in your secure device.
      </Container>
      <br />
      <br />
      <Container maxW="container.md">
        <Table variant="simple" size="sm" colorScheme="cyan">
          <Thead>
            <Tr>
              <Th>Account Info</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>User Email</Td>
              <Td>{user.email}</Td>
            </Tr>
            <Tr>
              <Td>Signature</Td>
              <Td>{user.signature}</Td>
            </Tr>
            <Tr>
              <Td>Credential ID</Td>
              <Td>{user.credentialId}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Container>
    </>
  )
}

const mapStateToProps = (state: UserState) => state;
export default connect(mapStateToProps)(MainPage);