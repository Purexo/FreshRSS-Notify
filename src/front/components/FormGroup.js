import React from "react";

import useUid from "../hooks/useUid";

export default function FormGroup({label, help, placeholder, uid: _uid, value, onChange, renderInput, inputProps}) {
  const [uid, helpuid] = useUid(_uid);
  
  return (
    <div className="form-group">
      <label htmlFor={uid}>{label}</label>
      {
        renderInput
          ? renderInput({uid, placeholder, value, onChange, inputProps, helpuid})
          : <input
            id={uid} className="form-control" type="text"
            placeholder={placeholder} value={value} onChange={onChange}
            aria-describedby={helpuid}
            {...inputProps}
          />
      }
      <small id={helpuid} className="form-text text-muted">{help}</small>
    </div>
  );
}