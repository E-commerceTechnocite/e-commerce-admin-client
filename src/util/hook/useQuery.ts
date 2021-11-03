import { useLocation } from 'react-router'

// A custom hook that builds on useLocation to parse query string
export function useQuery() {
  return new URLSearchParams(useLocation().search);
}
