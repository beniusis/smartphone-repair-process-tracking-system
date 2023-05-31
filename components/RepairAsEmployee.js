import {
  TableContainer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "../components/table";
import axios from "axios";
import { format } from "date-fns-tz";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RepairAsEmployee() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [employeeRepairs, setEmployeeRepairs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [newRepairData, setNewRepairData] = useState({
    title: "Priekinės kameros keitimas",
    total_cost: "50",
    fk_user_client: 0,
  });
  const [refresh, setRefresh] = useState(false);
  const [errorFields, setErrorFields] = useState({
    title: "",
    cost: "",
  });
  const toast = useToast();

  const [searchInput, setSearchInput] = useState("");

  const [offers, setOffers] = useState({});

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const fetchEmployeeRepairs = async () => {
    const response = await axios.post("/api/repairs/by/employee", {
      employee_id: session?.id,
    });
    setEmployeeRepairs(response.data);
  };

  const fetchUsers = async () => {
    const response = await axios.get("/api/clients");
    setUsers(response.data);
  };

  const calculateTotalRepairCost = (repair_id) => {
    let totalCost = 0;
    offers?.forEach((offer) => {
      if (offer.fk_repair === repair_id && offer.status === "accepted") {
        totalCost = totalCost + offer.cost;
      }
    });
    employeeRepairs?.forEach((employeeRepair) => {
      if (employeeRepair.id === repair_id) {
        totalCost = totalCost + employeeRepair.total_cost;
      }
    });
    return totalCost.toFixed(2);
  };

  const fetchOffers = async () => {
    const response = await axios.get("/api/offers");

    if (response.status !== 200) {
      toast({
        title: "Įvyko klaida! Bandykite iš naujo.",
        status: "error",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setOffers(response.data);
  };

  const fetchData = async () => {
    await fetchEmployeeRepairs();
    await fetchUsers();
    await fetchOffers().then(() => setIsLoading(false));
  };

  const registerRepair = async () => {
    const currentDate = format(new Date(), "yyyy-MM-dd kk:mm", {
      timeZone: "Europe/Vilnius",
    });
    if (newRepairData.fk_user_client === null) {
      setNewRepairData({ ...newRepairData, fk_user_client: users[0].id });
    } else if (newRepairData.title === "") {
      setErrorFields({
        ...errorFields,
        title: "* Neįvestas remonto pavadinimas!",
      });
    } else if (newRepairData.total_cost === "") {
      setErrorFields({
        ...errorFields,
        cost: "* Neįvesta remonto kaina!",
      });
    } else {
      const response = await axios.post("/api/register/repair", {
        title: newRepairData.title,
        registered_at: new Date(currentDate),
        total_cost: parseFloat(newRepairData.total_cost),
        status: "registered",
        fk_user_client: newRepairData.fk_user_client || users[0].id,
        fk_user_employee: session.id,
      });

      if (response.status === 201) {
        onClose();
        setRefresh(!refresh);
        toast({
          title: "Remontas sėkmingai užregistruotas!",
          status: "success",
          position: "top-right",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Įvyko klaida! Bandykite iš naujo.",
          status: "error",
          position: "top-right",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const showStatus = (repair) => {
    if (repair.status === "registered") {
      return "Užregistruotas";
    } else if (repair.status === "in_progress") {
      return "Remontuojama";
    } else if (repair.status === "finished") {
      return "Užbaigtas";
    }
  };

  function handleSearch(e) {
    e.preventDefault();
    setSearchInput(e.target.value);
  }

  return (
    <>
      {isLoading ? (
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-6">
          <div className="flex md:flex-row flex-col gap-4 mt-4 ml-4">
            <button
              className="bg-slate-900 rounded-xl text-gray-100 py-2 px-4 hover:scale-105 duration-300 relative w-52"
              onClick={onOpen}
            >
              Registruoti remontą
            </button>
            <Input
              maxW={"250px"}
              type="text"
              placeholder="Ieškoti pagal pavadinimą..."
              onChange={handleSearch}
              value={searchInput}
            />
          </div>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader fontSize={"2xl"}>Remonto registravimas</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel fontSize={"xl"}>Pavadinimas</FormLabel>
                  <Input
                    type="text"
                    defaultValue={newRepairData.title}
                    onChange={(e) =>
                      setNewRepairData({
                        ...newRepairData,
                        title: e.target.value,
                      })
                    }
                  />
                  {!newRepairData.title && (
                    <span className="text-xs text-red-600 ml-1">
                      {errorFields.title}
                    </span>
                  )}
                  <FormLabel fontSize={"xl"} mt={4}>
                    Kaina
                  </FormLabel>
                  <Input
                    type="number"
                    defaultValue={newRepairData.total_cost}
                    onChange={(e) =>
                      setNewRepairData({
                        ...newRepairData,
                        total_cost: e.target.value,
                      })
                    }
                  />
                  {!newRepairData.cost && (
                    <span className="text-xs text-red-600 ml-1">
                      {errorFields.cost}
                    </span>
                  )}
                  <FormLabel fontSize={"xl"} mt={4}>
                    Klientas
                  </FormLabel>
                  <Select
                    onChange={(e) =>
                      setNewRepairData({
                        ...newRepairData,
                        fk_user_client: e.target.value,
                      })
                    }
                  >
                    {users.map((user) => (
                      <option value={user.id} key={user.id}>
                        {user.name} {user.surname}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="green" onClick={() => registerRepair()}>
                  Registruoti
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {employeeRepairs.length !== 0 && (
            <TableContainer overflowX="hidden">
              <Table variant="striped" size="md">
                <Thead>
                  <Tr>
                    <Th>Klientas</Th>
                    <Th>Pavadinimas</Th>
                    <Th>Užregistruota</Th>
                    <Th>Pradėta remontuoti</Th>
                    <Th>Numatoma remonto pabaiga</Th>
                    <Th>Statusas</Th>
                    <Th>Kaina</Th>
                    <Th>Veiksmai</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {employeeRepairs
                    ?.filter((erepair) => {
                      return erepair.title
                        .toLowerCase()
                        .includes(searchInput.toLowerCase());
                    })
                    .map((repair) => (
                      <Tr key={repair.id}>
                        <Td>
                          {users.map(
                            (user) =>
                              repair.fk_user_client === user.id &&
                              user.name + " " + user.surname
                          )}
                        </Td>
                        <Td>{repair.title}</Td>
                        <Td>
                          {format(
                            new Date(repair.registered_at),
                            "yyyy-MM-dd kk:mm",
                            {
                              timeZone: "Europe/Vilnius",
                            }
                          )}
                        </Td>
                        <Td>
                          {(repair.started_at !== null &&
                            format(
                              new Date(repair.started_at),
                              "yyyy-MM-dd kk:mm",
                              {
                                timeZone: "Europe/Vilnius",
                              }
                            )) || (
                            <div className="flex h-10 md:h-0 items-center">
                              Nepradėta
                            </div>
                          )}
                        </Td>
                        <Td>
                          {(repair.estimated_time !== null &&
                            format(
                              new Date(repair.estimated_time),
                              "yyyy-MM-dd kk:mm",
                              {
                                timeZone: "Europe/Vilnius",
                              }
                            )) || (
                            <div className="flex h-10 md:h-0 items-center">
                              Nenurodyta
                            </div>
                          )}
                        </Td>
                        <Td>{showStatus(repair)}</Td>
                        <Td>{calculateTotalRepairCost(repair.id)}</Td>
                        <Td className="space-x-2">
                          <button
                            className="bg-slate-900 rounded-xl text-gray-100 py-2 px-4 hover:scale-105"
                            onClick={() => router.push("/repair/" + repair.id)}
                          >
                            Peržiūrėti
                          </button>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
          {employeeRepairs.length === 0 && (
            <div className="p-4 text-red-500">
              Jums priskirtų remontų nerasta
            </div>
          )}
        </div>
      )}
    </>
  );
}
