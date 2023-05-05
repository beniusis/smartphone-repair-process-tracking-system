import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
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
} from "@chakra-ui/react";
import axios from "axios";
import { formatInTimeZone } from "date-fns-tz";
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
  const [newRepairData, setNewRepairData] = useState({});
  const [refresh, setRefresh] = useState(false);

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

  const fetchData = async () => {
    await fetchEmployeeRepairs();
    await fetchUsers();
    setIsLoading(false);
  };

  const registerRepair = async () => {
    // const response = await axios.post("/api/register/repair", {
    //   title: newRepairData.title,
    //   registered_at: new Date(),
    //   total_cost: parseInt(newRepairData.total_cost),
    //   status: "registered",
    //   fk_user_client: newRepairData.fk_user_client,
    //   fk_user_employee: session.id,
    //   user_repair_fk_user_clientTouser: newRepairData.fk_user_client,
    //   user_repair_fk_user_employeeTouser: session.id,
    // });

    // if (response.status === 201) {
    //   setRefresh(true);
    // }
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

  return (
    <div className="">
      {isLoading ? (
        <div className="w-full">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-6">
          <div>
            <button
              className="bg-slate-900 rounded-xl text-gray-100 py-2 px-4 hover:scale-105 duration-300 relative mt-4 ml-4"
              onClick={onOpen}
            >
              Registruoti remontą
            </button>
          </div>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Remonto registravimas</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Pavadinimas</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setNewRepairData({
                        ...newRepairData,
                        title: e.target.value,
                      })
                    }
                  />
                  <FormLabel mt={4}>Kaina</FormLabel>
                  <Input
                    type="number"
                    onChange={(e) =>
                      setNewRepairData({
                        ...newRepairData,
                        total_cost: e.target.value,
                      })
                    }
                  />
                  <FormLabel mt={4}>Klientas</FormLabel>
                  <Select
                    placeholder=""
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
                <Button
                  colorScheme="green"
                  onClick={() => registerRepair()}
                >
                  Registruoti
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <TableContainer overflowX="hidden">
            <Table size="sm">
              <Thead>
                <Tr>
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
                {employeeRepairs?.map((repair) => (
                  <Tr key={repair.id}>
                    <Td>{repair.title}</Td>
                    <Td>
                      {formatInTimeZone(
                        repair.registered_at,
                        "UTC",
                        "yyyy-MM-dd kk:mm"
                      )}
                    </Td>
                    <Td>
                      {(repair.started_at !== null &&
                        formatInTimeZone(
                          repair.started_at,
                          "UTC",
                          "yyyy-MM-dd kk:mm"
                        )) ||
                        "Nepradėta"}
                    </Td>
                    <Td>
                      {(repair.estimated_time !== null &&
                        formatInTimeZone(
                          repair.estimated_time,
                          "UTC",
                          "yyyy-MM-dd kk:mm"
                        )) ||
                        "Nenurodyta"}
                    </Td>
                    <Td>{showStatus(repair)}</Td>
                    <Td>{repair.total_cost}</Td>
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
        </div>
      )}
    </div>
  );
}
