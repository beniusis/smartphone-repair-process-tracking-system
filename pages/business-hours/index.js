import Navbar from "@/components/Navbar";
import { Button, FormLabel, Input, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";

export default function BusinessHours() {
  const [isLoading, setIsLoading] = useState(true);
  const [reservationHours, setReservationHours] = useState({});
  const [businessHoursData, setBusinessHoursData] = useState({});
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
    const response = await axios.post("/api/reservation/hours", {
      opening_time: businessHoursData.opening_time || reservationHours.opening_time,
      closing_time: businessHoursData.closing_time || reservationHours.closing_time,
      interval: parseInt(businessHoursData.interval) || reservationHours.interval,
    });

    if (response.status === 201) {
      toast({
        title: "Darbo laikas sėkmingai atnaujintas!",
        status: "success",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
      setRefresh(!refresh);
    }
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
          <div className="w-full">
            <div className="flex flex-col w-24 m-10">
              <FormLabel>Pradžia</FormLabel>
              <input
                type="time"
                defaultValue={formatInTimeZone(
                  reservationHours?.opening_time,
                  "UTC",
                  "kk:mm"
                )}
                onChange={(e) =>
                  setBusinessHoursData({
                    ...businessHoursData,
                    opening_time: e.target.value,
                  })
                }
              />
              <FormLabel mt={4}>Pabaiga</FormLabel>
              <input
                type="time"
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
              <FormLabel mt={4}>Intervalas</FormLabel>
              <Input
                type="text"
                placeholder="pvz.: 10"
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
        )}
      </main>
    </>
  );
}
