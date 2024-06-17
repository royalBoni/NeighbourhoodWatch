"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const DataContext = createContext(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider");
  }

  return context;
};

export const DataProvider = ({ children }) => {
  const [centerLocation, setCenterLocation] = useState({
    lat: 49.2022459,
    lng: 16.5805312,
  });

  const specifyMapLocation = (state) => {
    setCenterLocation(state);
  };

  const {
    data: reportersData,
    error: reportersError,
    isLoading: reportersIsLoading,
  } = useQuery({
    queryKey: ["reportersposts"],
    queryFn: () =>
      fetch("http://localhost:3000/api/users").then((res) => res.json()),
    refetchInterval: 4000,
    retry: 5,
  });

  const {
    data: reports,
    error: reportsError,
    isLoading: reportsLoading,
  } = useQuery({
    queryKey: ["reportsposts"],
    queryFn: () =>
      fetch("http://localhost:3000/api/reports").then((res) => res.json()),
    refetchInterval: 4000,
    retry: 5,
  });

  const {
    data: comments,
    error: commentsError,
    isLoading: commentsLoading,
  } = useQuery({
    queryKey: ["commentsposts"],
    queryFn: () =>
      fetch("http://localhost:3000/api/comment").then((res) => res.json()),
    refetchInterval: 4000,
    retry: 5,
  });

  const {
    data: votes,
    error: votesError,
    isLoading: votesLoading,
  } = useQuery({
    queryKey: ["votesposts"],
    queryFn: () =>
      fetch("http://localhost:3000/api/votes").then((res) => res.json()),
    refetchInterval: 4000,
    retry: 5,
  });

  return (
    <DataContext.Provider
      value={{
        reports,
        reportsLoading,
        reportersData,
        centerLocation,
        comments,
        votes,
        specifyMapLocation,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
