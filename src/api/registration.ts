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
  getDoc,
} from "firebase/firestore";
import {
  Registrant,
  RegistrantFromFirebase,
  Registration,
  RegistrationFromFirebase,
} from "@/types/registrant";
import { useToast } from "@/components/ui/use-toast";
import {
  type UseQueryOptions,
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";

const getRegistrantionHistory = async () => {
  const registrationHistoryCollection = collection(db, "registration_history");
  const registrationHistorySnapshot = await getDocs(
    registrationHistoryCollection
  );
  const registrationHistoryData = registrationHistorySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as RegistrationFromFirebase)
  );
  return registrationHistoryData;
};

const useGetRegistrantionHistory = (
  options?: UseQueryOptions<RegistrationFromFirebase[], Error>
) => {
  return useQuery({
    queryKey: ["registrantion-history"],
    queryFn: getRegistrantionHistory,
    ...options,
  });
};

const getRegistrantsFromFirebase = async () => {
  const registrantsCollection = collection(db, "registrants");
  //   const registrantsQuery = query(
  //     registrantsCollection,
  //     where("phone", "==", "0988992069")
  //   );
  const registrantsSnapshot = await getDocs(registrantsCollection);
  const registrantsData = registrantsSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as RegistrantFromFirebase)
  );
  return registrantsData;
};

const useGetRegistrants = (
  options?: UseQueryOptions<RegistrantFromFirebase[], Error>
) => {
  return useQuery({
    queryKey: ["registrants"],
    queryFn: getRegistrantsFromFirebase,
    ...options,
  });
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

const getRegistrantHistoryById = async (registrantId: string) => {
  try {
    const registrantionCollection = collection(db, "registration_history");
    const registrantionQuery = query(
      registrantionCollection,
      where("registrant_id", "==", registrantId)
    );
    const registrantionSnapshot = await getDocs(registrantionQuery);
    const registrantsData = registrantionSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as RegistrationFromFirebase)
    );
    return registrantsData;
  } catch (error) {
    console.error("Error getting registration by ID:", error);
    throw error;
  }
};

const useGetRegistrantHistoryById = (
  registrantId: string | null,
  options?: UseQueryOptions<RegistrationFromFirebase[], Error>
) => {
  return useQuery({
    queryKey: ["registrant_history_Id", registrantId],
    queryFn: () => getRegistrantHistoryById(registrantId!),
    enabled: !!registrantId,
    ...options,
  });
};

export {
  getRegistrantsFromFirebase,
  useGetRegistrants,
  getRegistrantionHistory,
  useGetRegistrantionHistory,
  getRegistrantHistoryById,
  useGetRegistrantHistoryById,
};
