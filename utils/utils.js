export const fetcher = (url) => fetch(url).then((res) => res.json());

export const statusType = {
  positive: "POSITIVE",
  negative: "NEGATIVE",
  neutral: "NEUTRAL",
};
