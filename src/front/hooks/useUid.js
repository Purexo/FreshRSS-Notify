import {useState} from 'react';

import ruid from "../libs/ruid";

export default function useUid(_uid) {
  const [uid] = useState(`${_uid}-${ruid()}`);
  const helpuid = `${uid}-help`;
  
  return [uid, helpuid];
}