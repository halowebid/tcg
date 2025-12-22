import { SearchIcon } from "lucide-react"

import { Input } from "./Input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  )
}
