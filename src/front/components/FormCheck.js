import ruid from "../libs/ruid";
import React, {useState} from "react";
import useUid from "../hooks/useUid";

export default function FormCheck({label, help, checked, value, uid: _uid}) {
  const [uid, helpuid] = useUid(_uid);
  
  return (
    <div className="form-check">
      <label className="form-check-label">
        <input
          className="form-check-input" type="checkbox"
          checked={checked} value={value}
          aria-describedby={helpuid}
        />
        <span>{label}</span>
      </label>
      <small id={helpuid} className="form-text text-muted">{help}</small>
    </div>
  );
}