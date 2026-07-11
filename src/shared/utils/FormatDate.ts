import moment from "moment";

const FormatDate = (date: string | Date | undefined): string => {
  if (!date) return "";
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

export default FormatDate;
