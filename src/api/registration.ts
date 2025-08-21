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
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  getCountFromServer,
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
  QueryKey,
} from "@tanstack/react-query";

// Paginated registration history fetcher
const getRegistrantionHistory = async (
  page: number = 1,
  pageSize: number = 10,
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null
) => {
  console.log("getRegistrantionHistory");

  const registrationHistoryCollection = collection(db, "registration_history");
  let q = query(
    registrationHistoryCollection,
    orderBy("submit_time", "desc"),
    limit(pageSize)
  );
  if (lastVisible) {
    q = query(
      registrationHistoryCollection,
      orderBy("submit_time", "desc"),
      startAfter(lastVisible),
      limit(pageSize)
    );
  }
  const registrationHistorySnapshot = await getDocs(q);
  const registrationHistoryData = registrationHistorySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as RegistrationFromFirebase)
  );
  const newLastVisible =
    registrationHistorySnapshot.docs.length > 0
      ? registrationHistorySnapshot.docs[
          registrationHistorySnapshot.docs.length - 1
        ]
      : null;
  return { data: registrationHistoryData, lastVisible: newLastVisible };
};

const useGetRegistrantionHistory = (
  page: number = 1,
  pageSize: number = 10,
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null,
  options?: Partial<
    UseQueryOptions<
      {
        data: RegistrationFromFirebase[];
        lastVisible: QueryDocumentSnapshot<DocumentData> | null;
      },
      Error
    >
  >
) => {
  return useQuery({
    queryKey: ["registrantion_history", page, pageSize, lastVisible?.id],
    queryFn: () => getRegistrantionHistory(page, pageSize, lastVisible),
    refetchOnWindowFocus: false,
    ...options,
  });
};

const getRegistrantsFromFirebase = async (
  page: number = 1,
  pageSize: number = 10,
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null,
  searchTerm?: string
) => {
  console.log("getRegistrantsFromFirebase");

  const registrantsCollection = collection(db, "registrants");
  
  let q;
  if (searchTerm) {
    // For search, use where query with range queries for partial name matching
    const searchEnd = searchTerm + '\uf8ff';
    q = query(
      registrantsCollection,
      where("name", ">=", searchTerm),
      where("name", "<=", searchEnd),
      orderBy("name"),
      limit(pageSize)
    );
    
    if (lastVisible) {
      q = query(
        registrantsCollection,
        where("name", ">=", searchTerm),
        where("name", "<=", searchEnd),
        orderBy("name"),
        startAfter(lastVisible),
        limit(pageSize)
      );
    }
  } else {
    // Regular pagination without search
    q = query(
      registrantsCollection,
      orderBy("updated_at", "desc"),
      limit(pageSize)
    );

    if (lastVisible) {
      q = query(
        registrantsCollection,
        orderBy("updated_at", "desc"),
        startAfter(lastVisible),
        limit(pageSize)
      );
    }
  }

  const registrantsSnapshot = await getDocs(q);
  const registrantsData = registrantsSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as RegistrantFromFirebase)
  );

  const newLastVisible =
    registrantsSnapshot.docs.length > 0
      ? registrantsSnapshot.docs[registrantsSnapshot.docs.length - 1]
      : null;

  return { data: registrantsData, lastVisible: newLastVisible };
};

const useGetRegistrants = (
  page: number = 1,
  pageSize: number = 10,
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null,
  searchTerm?: string,
  options?: Partial<
    UseQueryOptions<
      {
        data: RegistrantFromFirebase[];
        lastVisible: QueryDocumentSnapshot<DocumentData> | null;
      },
      Error
    >
  >
) => {
  return useQuery({
    queryKey: ["registrants", page, pageSize, lastVisible?.id, searchTerm],
    queryFn: () => getRegistrantsFromFirebase(page, pageSize, lastVisible, searchTerm),
    refetchOnWindowFocus: false,
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

// Get total count of registration_history documents
const getRegistrationHistoryCount = async () => {
  const coll = collection(db, "registration_history");
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count as number;
};

const useGetRegistrationHistoryCount = (
  options?: Partial<UseQueryOptions<number, Error>>
) => {
  return useQuery({
    queryKey: ["registration_history_total_count"],
    queryFn: getRegistrationHistoryCount,
    ...options,
  });
};

const getRegistrantsCount = async () => {
  const registrantsCollection = collection(db, "registrants");
  const snapshot = await getCountFromServer(registrantsCollection);
  return snapshot.data().count;
};

const useGetRegistrantsCount = (
  options?: Partial<UseQueryOptions<number, Error>>
) => {
  return useQuery<number, Error>({
    queryKey: ["registrants_total_count"],
    queryFn: getRegistrantsCount,
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
  getRegistrationHistoryCount,
  useGetRegistrationHistoryCount,
  getRegistrantsCount,
  useGetRegistrantsCount,
  addRegistrantToFirebase,
};
