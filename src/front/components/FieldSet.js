import React from "react";

export default function FieldSet({legend, children}) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      
      {children}
    </fieldset>
  );
}