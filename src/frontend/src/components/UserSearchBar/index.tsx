
import { useState } from "react";
import UsersList from "../UserList";

const UserSearchBar = function Search() {
  const [query, setQuery] = useState("");
  return (
    <>
      <div className="bg-white rounded-md shadow-md flex flex-col items-center transition-all duration-300 relative 2xl:h-[30vw] lg:h-[45vw] lg:w-[25vw] md:h-[60vw] ml-0 sm:ml-6 lg:ml-0 md:w-[90vw] sm:h-[60vw] sm:w-[90vw] h-[150vw] w-[80vw] p-10 2xl:pt-[15%]">
        <input
          className="search w-full rounded shadow-md p-2 py-2.3 "
          type="text"
          placeholder="Procurar Usuários..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
          <UsersList query={query} />
      </div>
    </>
  );
}

export default UserSearchBar;
