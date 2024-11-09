
import { useState } from "react";
import UsersList from "../UserList";

const UserSearchBar = function Search() {
  const [query, setQuery] = useState("");
  return (
    <>
      <div className="bg-white w-[25vw] h-[30vw] rounded-md shadow-md p-10">
        <input
          className="search w-full rounded shadow-md border-cyan-700 border-2 p-2 "
          type="text"
          placeholder="Search Users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
          <UsersList query={query} />
      </div>
    </>
  );
}

export default UserSearchBar;
