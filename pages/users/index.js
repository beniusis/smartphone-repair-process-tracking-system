import Navbar from "@/components/Navbar";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormLabel,
  useDisclosure,
  Button,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedRole, setSelectedRole] = useState("");
  const toast = useToast();
  const [refresh, setRefresh] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const roles = [
    { LT: "Klientas", EN: "client" },
    { LT: "Darbuotojas", EN: "employee" },
    { LT: "Administratorius", EN: "administrator" },
  ];

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const fetchUsers = async () => {
    const response = await axios.get("/api/users");
    setUsers(response.data);
  };

  const updateUserRole = async (userId, newRole) => {
    const response = await axios.post("/api/users", {
      id: userId,
      role: newRole,
    });

    if (response.status === 200) {
      setRefresh(!refresh);
      toast({
        title: "Naudotojo rolė sėkmingai pakeista!",
        status: "success",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Įvyko klaida! Bandykite iš naujo.",
        status: "error",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const checkSelectedRole = () => {
    if (selectedUser.role === "client") return "Klientas";
    else if (selectedUser.role === "employee") return "Darbuotojas";
    else if (selectedUser.role === "administrator") return "Administratorius";
  };

  return (
    <>
      <main className="min-h-screen flex flex-row">
        <Navbar />
        <TableContainer overflowX="hidden" className="w-full">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>El. paštas</Th>
                <Th>Vardas Pavardė</Th>
                <Th>Adresas</Th>
                <Th>Telefono numeris</Th>
                <Th>Veiksmai</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users?.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.email_address}</Td>
                  <Td>
                    {user.name} {user.surname}
                  </Td>
                  <Td>{user.address}</Td>
                  <Td>{user.phone_number}</Td>
                  <Td>
                    <button
                      className="bg-slate-900 rounded-xl text-gray-100 py-2 px-4 hover:scale-105 duration-300"
                      value={JSON.stringify(user)}
                      onClick={(e) => {
                        onOpen();
                        setSelectedUser(JSON.parse(e.target.value));
                      }}
                    >
                      Privilegijos
                    </button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Privilegijų keitimas</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormLabel>
                {selectedUser.name} {selectedUser.surname}
              </FormLabel>
              <Select
                variant="filled"
                placeholder={checkSelectedRole()}
                pt={3}
                defaultValue={selectedUser.role}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map((role) => {
                  if (role.LT !== checkSelectedRole()) {
                    return (
                      <option value={role.EN} key={role.EN}>
                        {role.LT}
                      </option>
                    );
                  }
                })}
              </Select>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="green"
                mr={3}
                onClick={() => updateUserRole(selectedUser.id, selectedRole)}
              >
                Išsaugoti
              </Button>
              <Button colorScheme="red" onClick={onClose}>
                Atšaukti
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </main>
    </>
  );
}
