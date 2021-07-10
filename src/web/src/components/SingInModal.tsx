import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Center, Text } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/spinner";
import axios from "axios";
import { useState } from "react";
import { FcKey } from "react-icons/fc";
import { store } from "../stores";
import { USER_ACTION } from "../stores/user/actions";
import { bufferDecode, bufferEncode } from "../utils/codec";

interface Resp {
  publicKey: PublicKeyCredentialRequestOptions,
  signal: AbortSignal,
};

const getCredential = async (email: string) => {
  const resp = await axios.get<Resp>(`/api/login/begin/${email}`);

  // @ts-ignore
  resp.data.publicKey.challenge = bufferDecode(resp.data.publicKey.challenge);
  resp.data.publicKey.allowCredentials?.forEach(function (listItem) {
    // @ts-ignore
    listItem.id = bufferDecode(listItem.id)
  });


  const assertion = await navigator.credentials.get({
      publicKey: resp.data.publicKey
  });


  // Encode.
  const pkAssertion = assertion as PublicKeyCredential;
  const credentialId = pkAssertion.id
  const authData = bufferEncode((pkAssertion.response as AuthenticatorAssertionResponse).authenticatorData);
  const clientDataJSON = bufferEncode(pkAssertion.response.clientDataJSON);
  const rawId = bufferEncode(pkAssertion.rawId);
  const sig = bufferEncode((pkAssertion.response as AuthenticatorAssertionResponse).signature);
  const userHandle = bufferEncode((pkAssertion.response as AuthenticatorAssertionResponse).userHandle!);

  await axios.post<Resp>(`/api/login/finish/${email}`, {
    id: credentialId,
    rawId: rawId,
    type: pkAssertion.type,
    response: {
      authenticatorData: authData,
      clientDataJSON: clientDataJSON,
      signature: sig,
      userHandle: userHandle,
    },
  });

  return {
    credentialId,
    signature: sig,
  };
}

const signIn = async (email: string, setState: any) => {
  if (email === '') {
    return;
  }
  setState(STATE_LOADING);
  
  try {
    const {
      credentialId,
      signature,
    } = await getCredential(email);
    store.dispatch({
      type: USER_ACTION.SET_EMAIL,
      value: email,
    });
    store.dispatch({
      type: USER_ACTION.SET_SIGNATURE,
      value: signature,
    });
    store.dispatch({
      type: USER_ACTION.SET_CREDENTIAL_ID,
      value: credentialId,
    });
    localStorage.setItem('user', JSON.stringify({
      email,
      credentialId,
      signature: signature,
    }));
    setState(STATE_DEFAULT);
  } catch (err) {
    console.log(err);
    setState(STATE_DEFAULT);
  }
};

const STATE_DEFAULT = 0;
const STATE_LOADING = 1;

function SignInModal() {
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
          <Button colorScheme="blue" mr={3} onClick={() => signIn(email, setState)}>
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
      );
      break;
  }

  return (
    <>
      <Button leftIcon={<FcKey />} onClick={onOpen}>Sign In</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign In</ModalHeader>
          <ModalCloseButton />
          {content}
        </ModalContent>
      </Modal>
    </>
  );
}

export default SignInModal;
