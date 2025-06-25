import { useState, useEffect } from "react";
import { db } from "@/integrations/firebase/client";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp,
  orderBy,
  doc,
  writeBatch,
} from "firebase/firestore";
import {
  Registrant,
  RegistrationHistory,
  RegistrantWithHistory,
} from "@/types/registrant";
import { useToast } from "@/components/ui/use-toast";

export const useRegistrants = () => {
  const [registrants, setRegistrants] = useState<RegistrantWithHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRegistrants = async () => {
    try {
      setLoading(true);

      // 獲取所有報名者
      const registrantsCollection = collection(db, "registrants");
      const registrantsQuery = query(
        registrantsCollection,
        orderBy("created_at", "desc")
      );
      const registrantsSnapshot = await getDocs(registrantsQuery);

      const registrantsData = registrantsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Registrant)
      );

      // 獲取所有報名歷史
      const historyCollection = collection(db, "registration_history");
      const historyQuery = query(
        historyCollection,
        orderBy("submit_time", "desc")
      );
      const historySnapshot = await getDocs(historyQuery);
      const historyData = historySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as RegistrationHistory)
      );

      // 合併資料
      const registrantsWithHistory: RegistrantWithHistory[] =
        registrantsData.map((registrant) => ({
          ...registrant,
          history: historyData.filter(
            (history) => history.registrant_id === registrant.id
          ),
        }));

      setRegistrants(registrantsWithHistory);
    } catch (error) {
      console.error("Error fetching registrants:", error);
      toast({
        title: "獲取報名者資料失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRegistrantsFromFirebase = async () => {
    const registrantsCollection = collection(db, "registrants");
    const registrantsQuery = query(
      registrantsCollection,
      where("phone", "==", "0988992069")
    );
    const registrantsSnapshot = await getDocs(registrantsQuery);
    const registrantsData = registrantsSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Registrant)
    );
    console.log("registrantsData", registrantsData);
  };

  const addRegistrantToFirebase = async (
    registrant: Omit<Registrant, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const registrantsCollection = collection(db, "registrants");
      const docRef = await addDoc(registrantsCollection, {
        ...registrant,
        created_at: new Date(),
        updated_at: new Date(),
      });
      console.log("Added registrant with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding registrant:", error);
      throw error;
    }
  };

  const addRegistrantWithHistory = async ({
    id,
    name,
    email,
    phone,
    history,
  }: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    history: {
      registrationId: string;
      activityName: string;
      activityDate: string;
    }[];
  }) => {
    try {
      // Add registrant
      const registrantsCollection = collection(db, "registrants");
      const registrantDoc = await addDoc(registrantsCollection, {
        name,
        email,
        phone,
        is_resident: false, // default, adjust as needed
        created_at: new Date(),
        updated_at: new Date(),
      });
      // const registrantId = registrantDoc.id;

      // // Add registration history
      // const historyCollection = collection(db, "registration_history");
      // for (const h of history) {
      //   await addDoc(historyCollection, {
      //     registrant_id: registrantId,
      //     activity_name: h.activityName,
      //     submit_time: new Date(h.activityDate),
      //     created_at: new Date(),
      //   });
      // }
      // return registrantId;
    } catch (error) {
      console.error("Error adding registrant with history:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchRegistrants();
    // getRegistrantsFromFirebase();
    // addRegistrantWithHistory({
    //   name: "張聿昕",
    //   email: "morrielynn@gmail.com",
    //   phone: "0988992069",
    //   history: [],
    // });
  }, []);

  return {
    registrants,
    loading,
    fetchRegistrants,
    addRegistrantToFirebase,
    addRegistrantWithHistory,
  };
};
