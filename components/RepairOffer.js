import { FormLabel, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillCheckSquare } from "react-icons/ai";
import { HiXMark } from "react-icons/hi2";

export default function RepairOffer(props) {
  const [offerData, setOfferData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchOffer();
  }, [refresh]);

  const fetchOffer = async () => {
    const response = await axios.post("/api/offer", {
      offer_id: parseInt(props.id),
    });

    if (response.status === 200) {
      setOfferData(response.data);
    }
  };

  const updateOfferStatus = async (newStatus) => {
    try {
      const response = await axios.post("/api/offer/update/status", {
        status: newStatus,
        offer_id: parseInt(props.id),
      });

      if (response.status === 200) {
        if (newStatus === "accepted") {
          toast({
            title: "Remonto pasiūlymas patvirtintas!",
            status: "success",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
        } else if (newStatus === "declined") {
          toast({
            title: "Remonto pasiūlymas atmestas!",
            status: "success",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Įvyko klaida! Bandykite iš naujo.",
          status: "error",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
      }

      setRefresh(!refresh);
    } catch (error) {
      toast({
        title: "Įvyko klaida! Bandykite iš naujo.",
        status: "error",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <main className="border border-slate-900 rounded-md w-full h-fit flex flex-col justify-center p-2 mb-4">
        <div className="flex flex-row">
          <div className="w-full">
            <FormLabel>{props.title}</FormLabel>
            <FormLabel fontWeight={"400"}>{props.description}</FormLabel>
            <FormLabel fontWeight={"400"}>
              Kaina: <strong>{props.cost} &euro;</strong>
            </FormLabel>
          </div>
          {props.userRole === "client" && offerData?.status === "proposed" && (
            <div className="flex flex-col gap-2 ml-5 justify-center">
              <AiFillCheckSquare
                color="green"
                className="w-10 h-10 hover:cursor-pointer p-0"
                onClick={() => updateOfferStatus("accepted")}
              />
              <HiXMark
                color="white"
                className="bg-red-600 w-8 h-8 ml-1 hover:cursor-pointer"
                onClick={() => updateOfferStatus("declined")}
              />
            </div>
          )}
          {props.userRole === "employee" &&
            offerData?.status === "proposed" && (
              <div className="flex flex-col gap-2 ml-2 justify-center text-gray-500">
                Pasiūlyta
              </div>
            )}
          {offerData?.status === "accepted" && (
            <div className="flex flex-col gap-2 ml-2 justify-center text-green-500">
              Priimta
            </div>
          )}
          {offerData?.status === "declined" && (
            <div className="flex flex-col gap-2 ml-2 justify-center text-red-500">
              Atmesta
            </div>
          )}
        </div>
      </main>
    </>
  );
}
