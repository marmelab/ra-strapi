import { useRecordContext } from "react-admin";
import { Avatar as MuiAvatar } from "@mui/material";
import { get } from 'lodash';

export const Avatar = ({ source }: { source: string }) => {
  const record = useRecordContext();
  if (!record) return null;
  const avatar = get(record, source);
  return (
    <MuiAvatar src={avatar?.url ?? undefined}/>
  );
};
