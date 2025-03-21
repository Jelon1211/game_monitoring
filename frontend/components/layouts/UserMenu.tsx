"use client";

import { useDropdown } from "../user/useDropdown";
import UserAvatarButton from "../user/UserAvatarButton";
import UserDropdown from "../user/UserDropdown";

export default function UserMenu() {
  const { open, setOpen, dropdownRef, buttonRef } = useDropdown();

  return (
    <div className="relative">
      <UserAvatarButton onClick={() => setOpen(!open)} buttonRef={buttonRef} />
      {open && <UserDropdown dropdownRef={dropdownRef} />}
    </div>
  );
}
