import {useState, useEffect} from 'react';

export default function useTitle(_title='') {
  const [title, setTitle] = useState(_title);
  
  useEffect(() => { // sync title state with _title prop change
    setTitle(_title);
  }, [_title]);
  
  useEffect(() => { // set document title on change title
    document.title = title;
  }, [title]);
  
  return [title, setTitle];
}