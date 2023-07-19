'use client'

import { askQuestion } from "@/utils/api";
import { useState } from "react";

const Question = () => {
  const [ value, setValue ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ response, setResponse ] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading( true );
    const answer = await askQuestion(value);
    setResponse( answer );
    setLoading( false );
    setValue( "" );
  }
  const onChange = (e) => {
    setValue( e.target.value );
  }
  return (
    <div>
      <form onSubmit={ handleSubmit }>
        <input
          type="text"
          placeholder="Ask a question"
          value={ value }
          onChange={ onChange }
          className="border border-black/20 px-4 py-2 text-lg rounded-lg"
          disabled={ loading }
        />
        <button
          type="submit"
          className="bg-blue-400 px-4 py-2 rounded-lg text-lg"
          disabled={ loading }
        >
          Ask
        </button>
      </form>
      { loading &&
        <div>
          ...loading
        </div>
      }
      { response &&
        <div>
          { response }
        </div>
      }
    </div>
  )
}
export default Question;