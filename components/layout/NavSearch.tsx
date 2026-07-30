"use client";

import { useState } from "react";
import Input from "../ui/Input";

function NavSearch() {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="flex-1">
      <Input
        placeholder="Search MacIdeas"
        value={search}
        setValue={(s) => setSearch(s)}
        styles="w-full"
        clear
      />
    </div>
  );
}

export default NavSearch;
