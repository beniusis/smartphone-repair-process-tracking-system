import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import axios from "axios";
import { format, formatInTimeZone } from "date-fns-tz";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RepairAsEmployee() {
  const { data: session } = useSession();
  const router = useRouter();

  const [employeeRepairs, setEmployeeRepairs] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeRepairs();
  }, []);

  const fetchEmployeeRepairs = async () => {
    const response = await axios.post("/api/repairs/by/employee", {
      employee_id: session?.id,
    });
    setEmployeeRepairs(response.data);
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
          <div>
            <button className="bg-slate-900 rounded-xl text-gray-100 py-2 px-4 hover:scale-105 duration-300 relative mt-4 ml-4">
              Registruoti remontą
            </button>
          </div>
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
                      {formatInTimeZone(
                        repair.estimated_time,
                        "UTC",
                        "yyyy-MM-dd kk:mm"
                      )}
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
                      <button className="border border-slate-900 text-slate-900 rounded-xl py-2 px-4 hover:scale-105">
                        Pasiūlyti
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
