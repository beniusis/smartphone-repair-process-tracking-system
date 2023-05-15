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
  RadioGroup,
  Stack,
  Radio,
  Textarea,
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

  const [clientRepairs, setClientRepairs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [selectedRepairID, setSelectedRepairID] = useState();
  const [evaluationData, setEvaluationData] = useState({});

  const ratings = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  useEffect(() => {
    fetchClientRepairs();
  }, [refresh]);

  const fetchClientRepairs = async () => {
    const response = await axios.post("/api/repairs/by/client", {
      client_id: session?.id,
    });
    setClientRepairs(response.data);
    setIsLoading(false);
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

  const evaluteRepair = async () => {
    const response = await axios.post("/api/repair/evaluate", {
      repair_id: selectedRepairID,
      rating: parseInt(evaluationData.rating),
      review: evaluationData.review,
    });
    console.log(response);
  };

  return (
    <div className="">
      {isLoading ? (
        <div className="w-full">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-6">
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Remonto kokybės įvertinimas</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Įvertis</FormLabel>
                  <RadioGroup
                    onChange={(e) =>
                      setEvaluationData({ ...evaluationData, rating: e })
                    }
                    value={evaluationData.rating}
                  >
                    <Stack direction="row">
                      {ratings.map((rating) => (
                        <Radio value={rating}>{rating}</Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                  <FormLabel mt={4}>Atsiliepimas</FormLabel>
                  <Textarea
                    onChange={(e) =>
                      setEvaluationData({
                        ...evaluationData,
                        review: e.target.value,
                      })
                    }
                  ></Textarea>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="green"
                  onClick={() => {
                    evaluteRepair();
                    setTimeout(() => {
                      setRefresh(true);
                    }, 500);
                    onClose();
                  }}
                >
                  Pateikti
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <TableContainer overflowX="hidden" maxWidth={"70%"}>
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
                {clientRepairs?.map((repair) => (
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
                      <div className="flex flex-row gap-2">
                        <button
                          className="bg-slate-900 rounded-xl text-gray-100 py-2 px-4 hover:scale-105"
                          onClick={() => router.push("/repair/" + repair.id)}
                        >
                          Peržiūrėti
                        </button>
                        {repair.status === "finished" &&
                          repair.rating === null && (
                            <button
                              className="border border-slate-900 rounded-xl text-slate-900 py-2 px-4 hover:scale-105"
                              onClick={() => {
                                setSelectedRepairID(repair.id);
                                onOpen();
                              }}
                            >
                              Įvertinti
                            </button>
                          )}
                      </div>
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
