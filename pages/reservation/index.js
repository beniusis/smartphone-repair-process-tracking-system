import { useEffect, useState } from "react";
import { addMinutes, getMinutes } from "date-fns";
import Calendar from "react-calendar";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Button, Select, useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { format } from "date-fns-tz";

export default function Reservation() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState();
  const [reservationHours, setReservationHours] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [times, setTimes] = useState([]);
  const [reservedTimes, setReservedTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState();
  const [userReservation, setUserReservation] = useState({});
  const toast = useToast();

  useEffect(() => {
    if (!session) {
      return;
    }
    checkIfUserHasReservation();
    fetchReservationHours();
  }, [session]);

  const checkIfUserHasReservation = async () => {
    const response = await axios.post("/api/reservation/user", {
      user_id: parseInt(session?.id),
    });

    if (response.status === 200) {
      setUserReservation(response.data);
    }
  };

  const fetchReservedTimes = async (date) => {
    setReservedTimes([]);
    const formattedDate = new Date(format(date, "yyyy-MM-dd"));
    setSelectedDate(formattedDate);
    const response = await axios.post("/api/reservation/times", {
      date: formattedDate,
    });

    if (response.status === 200) {
      response.data.forEach((rt) => {
        const newTime = new Date(rt.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        });
        reservedTimes.push(newTime);
      });
      await setTimesArray();
    }
  };

  const fetchReservationHours = async () => {
    const response = await axios.get("/api/reservation/hours");
    setReservationHours(response.data[0]);
    setIsLoading(false);
  };

  const getLastDayOfTheYear = () => {
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, 11, 31);
  };

  const setTimesArray = async () => {
    let openingDate = new Date(reservationHours.opening_time);
    const closingDate = new Date(reservationHours.closing_time);
    const interval = reservationHours.interval;
    const rounded = await roundToMinutes(new Date(), interval);
    const earliestTime = rounded.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const timeSelectionDiv = document.getElementById("time-select");
    const selectElement = document.getElementById("time-selector");

    while (selectElement.options.length > 0) {
      selectElement.remove(0);
    }

    while (openingDate <= closingDate) {
      const formattedTime = openingDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      });

      if (!reservedTimes.includes(formattedTime)) {
        if (
          new Date(selectedDate).toDateString() === new Date().toDateString()
        ) {
          if (formattedTime >= earliestTime) {
            const optionElement = document.createElement("option");
            optionElement.value = formattedTime;
            optionElement.text = formattedTime;
            selectElement.appendChild(optionElement);
            times.push(formattedTime);
          }
        } else {
          const optionElement = document.createElement("option");
          optionElement.value = formattedTime;
          optionElement.text = formattedTime;
          selectElement.appendChild(optionElement);
          times.push(formattedTime);
        }
      }

      openingDate = new Date(openingDate.getTime() + interval * 60000);
    }

    timeSelectionDiv.removeAttribute("hidden");
  };

  const setUserReservationTime = async () => {
    const response = await axios.post("/api/reservation/create", {
      date: selectedDate,
      time: selectedTime || times[0],
      fk_user: session.id,
    });

    if (response.status === 201) {
      router.push("/");
      toast({
        title: "Remonto laikas sėkmingai rezervuotas!",
        status: "success",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Įvyko klaida! Bandykite iš naujo.",
        status: "error",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const roundToMinutes = async (date, interval) => {
    const minutesLeft = interval - (getMinutes(date) % interval);
    return addMinutes(date, minutesLeft);
  };

  const cancelReservation = async () => {
    const response = await axios.post("/api/reservation/cancel", {
      user_id: parseInt(session?.id),
    });

    if (response.status === 200) {
      router.push("/");
      toast({
        title: "Rezervacija atšaukta!",
        status: "success",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Įvyko klaida! Bandykite iš naujo.",
        status: "success",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
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
      ) : userReservation ? (
        <main className="min-h-screen flex flex-row">
          <Navbar />
          <div className="w-full p-4 flex flex-col gap-6">
            <div>
              <strong>Jūsų rezervacija: </strong>
              {format(new Date(userReservation?.date), "yyyy-MM-dd", {
                timeZone: "Europe/Vilnius",
              })}{" "}
              {format(new Date(userReservation?.time), "kk:mm", {
                timeZone: "Europe/Vilnius",
              })}
            </div>
            <div className="flex flex-col gap-2">
              Norite atšaukti rezervaciją?
              <Button
                colorScheme="red"
                className="w-28 hover:scale-105"
                onClick={() => cancelReservation()}
              >
                Atšaukti
              </Button>
            </div>
          </div>
        </main>
      ) : (
        <main className="min-h-screen flex flex-row">
          <Navbar />
          <div className="w-full flex flex-col justify-center items-center gap-4">
            <div className="flex flex-row">
              <h1 className="text-3xl font-bold text-slate-900">
                Pasirinkite datą
              </h1>
            </div>
            <div className="h-[550px] space-y-8">
              <Calendar
                minDate={new Date()}
                maxDate={getLastDayOfTheYear()}
                locale="LT"
                onClickDay={(date) => fetchReservedTimes(date)}
              />
              <div
                className="text-center text-red-500 text-xl"
                id="no-times"
                hidden
              >
                Laisvų laikų pasirinktą dieną nėra!
              </div>
              <div
                className="flex flex-col justify-center items-center gap-4"
                id="time-select"
                hidden
              >
                <h1 className="text-2xl font-bold text-slate-900">
                  Pasirinkite laiką
                </h1>
                <Select
                  id="time-selector"
                  defaultValue={times[0]}
                  onChange={(e) => {
                    setSelectedTime(e.target.value);
                  }}
                ></Select>
                <Button
                  colorScheme="green"
                  onClick={() => setUserReservationTime()}
                >
                  Rezervuoti
                </Button>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
