import { useEffect, useState } from "react";
import {
  addMinutes,
  format,
  formatISO,
  getMinutes,
  isBefore,
  parse,
} from "date-fns";
import Calendar from "react-calendar";
import axios from "axios";
import { useRouter } from "next/router";
import { IoArrowBackCircle } from "react-icons/io5";
import Navbar from "@/components/Navbar";

export default function Reservation() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState();
  const [reservationHours, setReservationHours] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let rounded;
    async function fetch() {
      await fetchReservationHours();
      setIsLoading(false);
      rounded = await roundToMinutes(new Date(), reservationHours.interval);
    }
    fetch();
    console.log(rounded);
  }, []);

  const fetchFreeTimes = async (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setSelectedDate(formattedDate);
    const response = await axios.post("/api/reservation/times", {
      date: formattedDate,
    });
    console.log(response);
  };

  const fetchReservationHours = async () => {
    const response = await axios.get("/api/reservation/hours");
    setReservationHours(response.data[0]);
  };

  const roundToMinutes = async (date, interval) => {
    const minutesLeft = interval - (getMinutes(date) % interval);
    return addMinutes(date, minutesLeft);
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
          <div className="w-full flex flex-col justify-center items-center gap-4">
            <div className="flex flex-row items-center gap-4">
              <h1 className="text-3xl font-bold text-slate-900">
                Pasirinkite datą
              </h1>
            </div>
            <div className="h-[550px] pr-10">
              <Calendar
                minDate={new Date()}
                locale="LT"
                onClickDay={(date) => fetchFreeTimes(date)}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
