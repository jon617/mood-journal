'use client'
import { deleteAll } from "@/utils/api";
import { useRouter } from "next/navigation";

const DeletePage = () => {
  // const deleted = await deleteAll();

  const handleOnClick = async () => {
    const data = await deleteAll();
  }

  return (
    <div>
      <button onClick={ handleOnClick }>Delete all</button>
    </div>
  )
}
export default DeletePage;