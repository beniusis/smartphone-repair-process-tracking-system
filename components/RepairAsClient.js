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
  RadioGroup,
  Stack,
  Radio,
  Textarea,
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

  const [clientRepairs, setClientRepairs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [selectedRepairID, setSelectedRepairID] = useState();
  const [evaluationData, setEvaluationData] = useState({
    rating: 0,
    review: "",
  });
  const [evaluationErrors, setEvaluationErrors] = useState({
    rating: "",
  });
  const toast = useToast();

  const ratings = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const [offers, setOffers] = useState({});

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const fetchData = async () => {
    await fetchClientRepairs();
    await fetchOffers().then(() => setIsLoading(false));
  };

  const fetchClientRepairs = async () => {
    const response = await axios.post("/api/repairs/by/client", {
      client_id: parseInt(session?.id),
    });
    setClientRepairs(response.data);
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

  const calculateTotalRepairCost = (repair_id) => {
    let totalCost = 0;
    offers?.forEach((offer) => {
      if (offer.fk_repair === repair_id && offer.status === "accepted") {
        totalCost = totalCost + offer.cost;
      }
    });
    clientRepairs?.forEach((clientRepair) => {
      if (clientRepair.id === repair_id) {
        totalCost = totalCost + clientRepair.total_cost;
      }
    });
    return totalCost.toFixed(2);
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

  const evaluateRepair = async () => {
    if (evaluationData.rating === 0) {
      setEvaluationErrors({ rating: "* Nepasirinktas įvertis!" });
    } else {
      try {
        const response = await axios.post("/api/repair/evaluate", {
          repair_id: selectedRepairID,
          rating: parseInt(evaluationData.rating),
          review: evaluationData.review || null,
        });

        if (response.status !== 201) {
          onClose();
          toast({
            title: "Įvyko klaida! Bandykite iš naujo.",
            status: "error",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
          return;
        }

        onClose();
        setRefresh(!refresh);
        toast({
          title: "Remontas sėkmingai įvertintas!",
          status: "success",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        onClose();
        toast({
          title: "Įvyko klaida! Bandykite iš naujo.",
          status: "error",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

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
                  {evaluationErrors.rating && (
                    <span className="text-xs text-red-600 ml-1">
                      {evaluationErrors.rating}
                    </span>
                  )}
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
                    evaluateRepair();
                    // setTimeout(() => {
                    //   setRefresh(true);
                    // }, 500);
                  }}
                >
                  Pateikti
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {clientRepairs.length !== 0 && (
            <TableContainer overflowX="hidden">
              <Table variant="striped" size="md">
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
          )}
          {clientRepairs.length === 0 && (
            <div className="p-4 text-red-500">Neturite registruotų remontų</div>
          )}
        </div>
      )}
    </>
  );
}
