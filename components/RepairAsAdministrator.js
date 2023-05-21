import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { format } from "date-fns-tz";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RepairAsAdministrator() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [repairs, setRepairs] = useState([]);

  useEffect(() => {
    fetchAllRepairs();
  }, []);

  const fetchAllRepairs = async () => {
    const response = await axios.post("/api/repairs");
    setRepairs(response.data);
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

  return (
    <div className="">
      {isLoading ? (
        <div className="w-full">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-6">
          {repairs.length !== 0 && (
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
                  {repairs?.map((repair) => (
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
                          )) ||
                          "Nepradėta"}
                      </Td>
                      <Td>
                        {(repair.estimated_time !== null &&
                          format(
                            new Date(repair.estimated_time),
                            "yyyy-MM-dd kk:mm",
                            {
                              timeZone: "Europe/Vilnius",
                            }
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
          )}
          {repairs.length === 0 && (
            <div className="p-4 text-red-500">Nėra registruotų remontų</div>
          )}
        </div>
      )}
    </div>
  );
}
