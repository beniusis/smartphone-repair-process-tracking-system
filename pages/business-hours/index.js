import Navbar from "@/components/Navbar";
import { Button, FormLabel, Input, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";

export default function BusinessHours() {
  const [isLoading, setIsLoading] = useState(true);
  const [reservationHours, setReservationHours] = useState({});
  const [businessHoursData, setBusinessHoursData] = useState({
    opening_time: "",
    closing_time: "",
    interval: "",
  });
  const [refresh, setRefresh] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getReservationHours();
  }, [refresh]);

  const getReservationHours = async () => {
    const response = await axios.get("/api/reservation/hours");

    if (response.status === 200) {
      setReservationHours(response.data[0]);
      setIsLoading(false);
    }
  };

  const updateReservationHours = async () => {
    if (
      businessHoursData.opening_time !== "" ||
      businessHoursData.closing_time !== "" ||
      businessHoursData.interval !== ""
    ) {
      try {
        const response = await axios.post("/api/reservation/hours", {
          opening_time:
            businessHoursData.opening_time || reservationHours.opening_time,
          closing_time:
            businessHoursData.closing_time || reservationHours.closing_time,
          interval: businessHoursData.interval || reservationHours.interval,
        });

        if (response.status !== 201) {
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
          title: "Sėkmingai atnaujinti darbo laiko duomenys!",
          status: "success",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
        setBusinessHoursData({
          opening_time: "",
          closing_time: "",
          interval: "",
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
    } else {
      toast({
        title: "Neatliekami jokie pakeitimai!",
        status: "warning",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
    }
    // if (businessHoursData.interval === "") {
    //   toast({
    //     title: "Intervalo laukas negali būti tuščias!",
    //     status: "warning",
    //     position: "top-right",
    //     duration: 5000,
    //     isClosable: true,
    //   });
    // } else {
    //   const response = await axios.post("/api/reservation/hours", {
    //     opening_time:
    //       businessHoursData.opening_time || reservationHours.opening_time,
    //     closing_time:
    //       businessHoursData.closing_time || reservationHours.closing_time,
    //     interval:
    //       parseInt(businessHoursData.interval) || reservationHours.interval,
    //   });

    //   if (response.status === 201) {
    //     toast({
    //       title: "Darbo laikas sėkmingai atnaujintas!",
    //       status: "success",
    //       position: "top-right",
    //       duration: 5000,
    //       isClosable: true,
    //     });
    //     setRefresh(!refresh);
    //     setBusinessHoursData({
    //       opening_time: "",
    //       closing_time: "",
    //       interval: "",
    //     });
    //   }
    // }
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
        <main className="min-h-screen flex flex-row">
          <Navbar />
          <div className="w-full">
            <div className="flex flex-col w-48 m-10">
              <FormLabel fontSize={"2xl"}>Pradžia</FormLabel>
              <input
                type="time"
                defaultValue={formatInTimeZone(
                  reservationHours?.opening_time,
                  "UTC",
                  "kk:mm"
                )}
                className="text-xl"
                onChange={(e) =>
                  setBusinessHoursData({
                    ...businessHoursData,
                    opening_time: e.target.value,
                  })
                }
              />
              <FormLabel fontSize={"2xl"} mt={4}>
                Pabaiga
              </FormLabel>
              <input
                type="time"
                className="text-xl"
                defaultValue={formatInTimeZone(
                  reservationHours?.closing_time,
                  "UTC",
                  "kk:mm"
                )}
                onChange={(e) =>
                  setBusinessHoursData({
                    ...businessHoursData,
                    closing_time: e.target.value,
                  })
                }
              />
              <FormLabel fontSize={"2xl"} mt={4}>
                Intervalas
              </FormLabel>
              <Input
                type="text"
                placeholder="pvz.: 10"
                fontSize={"xl"}
                defaultValue={reservationHours?.interval}
                onChange={(e) =>
                  setBusinessHoursData({
                    ...businessHoursData,
                    interval: e.target.value,
                  })
                }
              />
              <Button
                mt={4}
                colorScheme="green"
                onClick={() => updateReservationHours()}
              >
                Išsaugoti
              </Button>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
