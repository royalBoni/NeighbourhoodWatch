"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../lib/actions";

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
    queryFn: () => fetch(`${baseUrl}api/users`).then((res) => res.json()),
    refetchInterval: 4000,
    retry: 5,
  });

  const {
    data: reports,
    error: reportsError,
    isLoading: reportsLoading,
  } = useQuery({
    queryKey: ["reportsposts"],
    queryFn: () => fetch(`${baseUrl}api/reports`).then((res) => res.json()),
    refetchInterval: 4000,
    retry: 5,
  });

  const {
    data: comments,
    error: commentsError,
    isLoading: commentsLoading,
  } = useQuery({
    queryKey: ["commentsposts"],
    queryFn: () => fetch(`${baseUrl}api/comment`).then((res) => res.json()),
    refetchInterval: 4000,
    retry: 5,
  });

  const {
    data: votes,
    error: votesError,
    isLoading: votesLoading,
  } = useQuery({
    queryKey: ["votesposts"],
    queryFn: () => fetch(`${baseUrl}api/votes`).then((res) => res.json()),
    refetchInterval: 4000,
    retry: 5,
  });

  const {
    data: campaigns,
    error: campaignsError,
    isLoading: campaignsLoading,
  } = useQuery({
    queryKey: ["campaignssposts"],
    queryFn: () => fetch(`${baseUrl}api/campaign`).then((res) => res.json()),
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
        campaigns,
        specifyMapLocation,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
