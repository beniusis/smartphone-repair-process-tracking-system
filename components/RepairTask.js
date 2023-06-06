import { Button, Card, FormLabel, useToast } from "@chakra-ui/react";
import axios from "axios";
import { format } from "date-fns-tz";
import { useEffect, useState } from "react";

export default function RepairTask(props) {
  const [refresh, setRefresh] = useState(false);
  const [task, setTask] = useState({});
  const toast = useToast();

  useEffect(() => {
    fetchTask();
  }, [refresh]);

  async function fetchTask() {
    try {
      const response = await axios.post("/api/task", {
        task_id: parseInt(props.id),
      });
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
      setTask(response.data);
    } catch (error) {
      toast({
        title: "Įvyko klaida! Bandykite iš naujo.",
        status: "error",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  async function startTask(newStatus) {
    const currentDate = format(new Date(), "yyyy-MM-dd kk:mm", {
      timeZone: "Europe/Vilnius",
    });
    try {
      const response = await axios.post("/api/task/update/start", {
        status: newStatus,
        task_id: parseInt(props.id),
        started_at: new Date(currentDate),
      });

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

      setRefresh(!refresh);
      toast({
        title: "Remonto užduotis pradėta!",
        status: "success",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Įvyko klaida! Bandykite iš naujo.",
        status: "error",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  async function endTask(newStatus) {
    const currentDate = format(new Date(), "yyyy-MM-dd kk:mm", {
      timeZone: "Europe/Vilnius",
    });
    try {
      const response = await axios.post("/api/task/update/finish", {
        status: newStatus,
        task_id: parseInt(props.id),
        finished_at: new Date(currentDate),
      });

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

      setRefresh(!refresh);
      toast({
        title: "Remonto užduotis baigta!",
        status: "success",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Įvyko klaida! Bandykite iš naujo.",
        status: "error",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      <Card variant={"filled"} mt={4}>
        <main className="w-full h-fit flex flex-col justify-center p-2 mb-4">
          <div className="flex flex-row">
            <div className="w-full">
              <FormLabel>{props.title}</FormLabel>
              <FormLabel fontWeight={"400"}>{props.description}</FormLabel>
              {task?.started_at && (
                <FormLabel fontWeight={"400"}>
                  Pradėta:{" "}
                  <strong>
                    {format(new Date(task?.started_at), "yyyy-MM-dd kk:mm", {
                      timeZone: "Europe/Vilnius",
                    })}
                  </strong>
                </FormLabel>
              )}
              {task?.finished_at && (
                <FormLabel fontWeight={"400"}>
                  Baigta:{" "}
                  <strong>
                    {" "}
                    {format(new Date(task?.finished_at), "yyyy-MM-dd kk:mm", {
                      timeZone: "Europe/Vilnius",
                    })}
                  </strong>
                </FormLabel>
              )}
            </div>
            {((props.userRole === "client" ||
              props.userRole === "administrator") &&
              task?.status === "not_started" && (
                <div className="flex flex-col gap-2 ml-2 justify-center text-red-500">
                  Nepradėta
                </div>
              )) ||
              ((props.userRole === "client" ||
                props.userRole === "administrator") &&
                task?.status === "in_progress" && (
                  <div className="flex flex-col gap-2 ml-2 justify-center text-gray-500">
                    Atliekama
                  </div>
                )) ||
              ((props.userRole === "client" ||
                props.userRole === "administrator") &&
                task?.status === "done" && (
                  <div className="flex flex-col gap-2 ml-2 justify-center text-green-500">
                    Atlikta
                  </div>
                ))}
            {(props.userRole === "employee" &&
              task?.status === "not_started" && (
                <div className="flex justify-center items-center">
                  <Button
                    colorScheme="green"
                    onClick={() => startTask("in_progress")}
                  >
                    Pradėti
                  </Button>
                </div>
              )) ||
              (props.userRole === "employee" &&
                task?.status === "in_progress" && (
                  <div className="flex justify-center items-center">
                    <Button colorScheme="red" onClick={() => endTask("done")}>
                      Užbaigti
                    </Button>
                  </div>
                ))}
          </div>
        </main>
      </Card>
    </>
  );
}
