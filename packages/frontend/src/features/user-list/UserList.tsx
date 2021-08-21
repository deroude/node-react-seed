import React, { useEffect } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { loadUsers, selectUsers } from "./userListSlice";
export function UserList() {
  const userList = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUsers({ filter: "" }));
  });

  return (
    <div>
      <ul>
        {userList.map((u) => (
          <li>{u.email}</li>
        ))}
      </ul>
    </div>
  );
}
