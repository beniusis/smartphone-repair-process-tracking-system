import { FormLabel, Select, TableContainer } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "../components/table";
import axios from "axios";
import { format } from "date-fns-tz";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RepairAsAdministrator() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [repairs, setRepairs] = useState([]);
  const [employees, setEmployees] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [offers, setOffers] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchAllRepairs();
    await fetchOffers();
    await fetchAllEmployees().then(() => setIsLoading(false));
  };
  const fetchAllRepairs = async () => {
    const response = await axios.post("/api/repairs");
    setRepairs(response.data);
  };

  const fetchAllEmployees = async () => {
    const response = await axios.get("/api/employees");
    setEmployees(response.data);
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
    repairs?.forEach((repair) => {
      if (repair.id === repair_id) {
        totalCost = totalCost + repair.total_cost;
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
          <div className="flex flex-col mt-4 ml-4">
            <FormLabel ml={1}>Filtruoti pagal darbuotoją</FormLabel>
            <Select
              maxW={"208px"}
              placeholder="Visi"
              onChange={(e) => {
                setSelectedEmployee(e.target.value);
              }}
            >
              {employees?.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} {employee.surname}
                </option>
              ))}
            </Select>
          </div>
          {repairs.length !== 0 && (
            <TableContainer overflowX="hidden">
              <Table variant="striped" size="md">
                <Thead>
                  <Tr>
                    <Th>Darbuotojas</Th>
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
                  {repairs
                    ?.filter((frepair) => {
                      if (selectedEmployee === "") {
                        return frepair;
                      }
                      return (
                        frepair.fk_user_employee === parseInt(selectedEmployee)
                      );
                    })
                    .map((repair) => (
                      <Tr key={repair.id}>
                        <Td>
                          {employees.map(
                            (employee) =>
                              repair.fk_user_employee === employee.id &&
                              employee.name + " " + employee.surname
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
          {repairs.length === 0 && (
            <div className="p-4 text-red-500">Nėra registruotų remontų</div>
          )}
        </div>
      )}
    </>
  );
}
