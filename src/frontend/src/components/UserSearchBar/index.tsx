
import { useState } from "react";
import UsersList from "../UserList";

 const UserSearchBar = function Search() {
     const [query, setQuery] = useState("");
    return (
        <>
          <input
            className="search"
            type="text"
            placeholder="Search Users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />
            
            <UsersList query={query}/>


            </>
        );
      }

export default UserSearchBar;
