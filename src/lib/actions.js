import {
  setKey,
  setDefaults,
  setLanguage,
  setRegion,
  fromAddress,
  fromLatLng,
  fromPlaceId,
  setLocationType,
  geocode,
  RequestType,
} from "react-geocode";

export const returnLocationFromCordinates = (latitude, longitude) => {
  const loc = geocode(RequestType.LATLNG, `${latitude},${longitude}`)
    .then(({ results }) => {
      const address = results[0].formatted_address;
      console.log(address);
    })
    .catch(console.error);
  //return loc;
};

export const findCommentedReports = (comments, reportId) => {
  const findCommentedReport = comments?.filter(
    (comment) => comment.reportId === reportId
  );
  return findCommentedReport.length;
};

export const findCommentedOnReports = (comments, reportId) => {
  const findCommentedReport = comments?.filter(
    (comment) => comment.reportId === reportId
  );
  return findCommentedReport;
};

export const findReport = (reports, reportId) => {
  const Report = reports?.find((report) => report.id === reportId);
  return Report;
};

export const returnNumberOfVotes = (votes, reportId) => {
  const findNumberOfVotes = votes?.filter((vote) => vote.reportId === reportId);
  return findNumberOfVotes?.length;
};

export const checkIfVotedVotes = (votes, reportId, userId) => {
  const findIfVoted = votes?.find(
    (vote) => vote.reportId === reportId && vote.userId === userId
  );
  return findIfVoted;
};
