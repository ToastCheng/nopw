import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Center, Text } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/spinner";
import axios from "axios";
import { useState } from "react";
import { FcPrivacy } from "react-icons/fc";
import { bufferDecode, bufferEncode } from "../utils/codec";

interface Resp {
  publicKey: PublicKeyCredentialCreationOptions,
  signal: AbortSignal,
};

const createCredentiall = async (email: string) => {
  // api.
  const resp = await axios.get<Resp>(`/api/register/begin/${email}`);

  // @ts-ignore
  resp.data.publicKey.challenge = bufferDecode(resp.data.publicKey.challenge);
  // @ts-ignore
  resp.data.publicKey.user.id = bufferDecode(resp.data.publicKey.user.id);

  if (resp.data.publicKey.excludeCredentials) {
    for (var i = 0; i < resp.data.publicKey.excludeCredentials.length; i++) {
      // @ts-ignore
      resp.data.publicKey.excludeCredentials[i].id = bufferDecode(resp.data.publicKey.excludeCredentials[i].id);
    }
  }

  // Authenticator.
  let credential = await navigator.credentials.create({
    publicKey: resp.data.publicKey
  });
  const pkCredential = credential as PublicKeyCredential;

  // Resp to server.
  let attestationObject = (pkCredential.response as AuthenticatorAttestationResponse).attestationObject;
  let clientDataJSON = pkCredential.response.clientDataJSON;
  let rawId = pkCredential.rawId;

  const data = {
    id: pkCredential.id,
    rawId: bufferEncode(rawId),
    type: pkCredential.type,
    response: {
      attestationObject: bufferEncode(attestationObject),
      clientDataJSON: bufferEncode(clientDataJSON),
    },
  };

  await axios.post(`/api/register/finish/${email}`, data);
}

const register = async (email: string, setState: any) => {

  setState(STATE_LOADING);
  try {
    await createCredentiall(email);
    setState(STATE_SUCCESS);
  } catch (err) {
    console.log(err);
    setState(STATE_DEFAULT);
  } 
};

const completeFlow = (onClose: any, setState: any, setEmail: any) => () => {
  setState(STATE_DEFAULT);
  setEmail('');
  onClose();
}

const STATE_DEFAULT = 0;
const STATE_LOADING = 1;
const STATE_SUCCESS = 2;

const SignUpModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState('');
  const [state, setState] = useState(STATE_DEFAULT);

  let content = null;
  switch (state) {
    case STATE_DEFAULT:
      content = <>
        <ModalBody pb={6}>
          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Email" 
              onChange={(e) => {setEmail(e.target.value)}}
              value={email}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => register(email, setState)}>
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
        </>;
      break;
    case STATE_LOADING:
      content = (
        <>
          <ModalBody pb={6}>
            <Center>
              <Spinner />
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </>
      )
      break;
    case STATE_SUCCESS:
      content = <>
        <ModalBody pb={6}>
          <Text>
            You can sign in now!
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={completeFlow(onClose, setState, setEmail)}>OK</Button>
        </ModalFooter>
      </>;


  }


  return (
    <>
      <Button leftIcon={<FcPrivacy />} onClick={onOpen}>Sign Up</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          {content}
        </ModalContent>
      </Modal>
    </>
  );
}

export default SignUpModal;