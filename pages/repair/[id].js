import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  FormControl,
  FormLabel,
  Input,
  Text,
  Select,
  Button,
} from "@chakra-ui/react";
import { formatInTimeZone } from "date-fns-tz";
import { useSession } from "next-auth/react";

export default function Repair() {
  const { data: session } = useSession();
  const router = useRouter();
  const repair_id = router.query.id;

  const [repairData, setRepairData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [changedStatus, setChangedStatus] = useState("registered");
  const [refresh, setRefresh] = useState(false);

  const status = [
    { LT: "Užregistruotas", EN: "registered" },
    { LT: "Remontuojama", EN: "in_progress" },
    { LT: "Užbaigtas", EN: "finished" },
  ];

  useEffect(() => {
    if (!repair_id) {
      return;
    }
    fetchRepairData();
  }, [repair_id, refresh]);

  const fetchRepairData = async () => {
    const response = await axios.post("/api/repair", {
      id: parseInt(repair_id),
    });
    setRepairData(response.data);
    setIsLoading(false);
  };

  const updateRepairData = async () => {
    const dateToUTC = Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDay(),
      new Date().getHours(),
      new Date().getMinutes()
    );
    const startedDate = new Date(dateToUTC);
    const response = await axios.put("/api/repair", {
      id: parseInt(repair_id),
      title: repairData.title,
      started_at: startedDate,
      finished_at: repairData.finished_at,
      estimated_time: repairData.estimated_time,
      total_cost: repairData.total_cost,
      status: repairData.status,
    });

    if (response.status === 201) {
      // router.reload(window.location.pathname);
      setRefresh(true);
    }
  };

  const checkSelectedStatus = () => {
    if (repairData.status === "registered") {
      return "Užregistruotas";
    } else if (repairData.status === "in_progress") {
      return "Remontuojama";
    } else if (repairData.status === "finished") {
      return "Užbaigtas";
    }
  };

  const lastDayOfYear = () => {
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, 11, 31);
  };

  return (
    <>
      <main className="min-h-screen flex flex-row">
        <Navbar />
        {isLoading ? (
          <div className="w-full">
            <h1>Loading...</h1>
          </div>
        ) : (
          <div className="w-full p-4">
            <FormControl maxWidth="xs">
              <FormLabel>Pavadinimas</FormLabel>
              {session?.role === "employee" ? (
                <Input
                  type="text"
                  value={repairData.title}
                  onChange={(e) =>
                    setRepairData({ ...repairData, title: e.target.value })
                  }
                />
              ) : (
                <Text>{repairData.title}</Text>
              )}
              <FormLabel mt={4}>Būsena</FormLabel>
              {session?.role === "employee" ? (
                <Select
                  variant="filled"
                  placeholder={checkSelectedStatus()}
                  defaultValue={repairData.status}
                  onChange={(e) => {
                    setRepairData({ ...repairData, status: e.target.value });
                    setChangedStatus(e.target.value);
                  }}
                >
                  {status.map((status) => {
                    if (status.LT !== checkSelectedStatus()) {
                      return (
                        <option value={status.EN} key={status.EN}>
                          {status.LT}
                        </option>
                      );
                    }
                  })}
                </Select>
              ) : (
                <Text>{checkSelectedStatus()}</Text>
              )}
              <FormLabel mt={4}>Remontas užregistruotas</FormLabel>
              <Text>
                {formatInTimeZone(
                  repairData.registered_at,
                  "UTC",
                  "yyyy-MM-dd kk:mm"
                )}
              </Text>
              {(repairData.status === "in_progress" ||
                repairData.status === "finished") && (
                <>
                  {repairData.started_at !== null && (
                    <div>
                      <FormLabel mt={4}>Remontas pradėtas</FormLabel>
                      {formatInTimeZone(
                        repairData.started_at,
                        "UTC",
                        "yyyy-MM-dd kk:mm"
                      ) || ""}
                      <FormLabel mt={4}>Planuojama remonto pabaiga</FormLabel>
                      {formatInTimeZone(
                        repairData.estimated_time,
                        "UTC",
                        "yyyy-MM-dd kk:mm"
                      )}
                    </div>
                  )}
                </>
              )}
              {repairData.status === "finished" &&
                repairData.started_at !== null && (
                  <div>
                    <FormLabel mt={4}>Remontas baigtas</FormLabel>
                    {formatInTimeZone(
                      repairData.finished_at,
                      "UTC",
                      "yyyy-MM-dd kk:mm"
                    ) || ""}
                  </div>
                )}
              <FormLabel mt={4}>Kaina</FormLabel>
              <Text>{repairData.total_cost} &euro;</Text>
              {repairData.status === "finished" &&
                repairData.started_at !== null && (
                  <>
                    <FormLabel mt={4}>Įvertinimas</FormLabel>
                    <Text>
                      Įvertis:{" "}
                      <strong>{repairData.rating || "neįvertinta"}</strong>
                    </Text>
                    <Text>
                      Atsiliepimas:{" "}
                      <strong>{repairData.review || "nėra"}</strong>
                    </Text>
                  </>
                )}
              {changedStatus === "in_progress" &&
                repairData.started_at === null && (
                  <div>
                    <FormLabel mt={4}>Numatoma suremontuoti iki</FormLabel>
                    <input
                      type="datetime-local"
                      defaultValue={new Date().toLocaleTimeString("lt-LT", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      min={new Date().toLocaleTimeString("lt-LT", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      max={lastDayOfYear().toLocaleString("lt-LT", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      onChange={({ target }) => {
                        setRepairData({
                          ...repairData,
                          estimated_time: new Date(
                            new Date(target.valueAsNumber).toLocaleDateString(
                              "lt-LT",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                timeZone: "UTC",
                              }
                            )
                          ),
                        });
                      }}
                    />
                  </div>
                )}
              <div className="flex flex-row gap-4">
                {session?.role === "employee" && (
                  <Button
                    colorScheme="green"
                    mt={4}
                    onClick={() => updateRepairData()}
                  >
                    Išsaugoti
                  </Button>
                )}
                <Button colorScheme="red" mt={4} onClick={() => router.back()}>
                  Grįžti atgal
                </Button>
              </div>
            </FormControl>
          </div>
        )}
      </main>
    </>
  );
}
