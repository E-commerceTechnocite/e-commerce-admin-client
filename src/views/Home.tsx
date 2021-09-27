import * as React from "react"
import Loading from "../components/Loading"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { http } from "../util/http"

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const [isPending, setIsPending] = useState(true)
  const history = useHistory()
  useEffect(() => {
    setTimeout(() => {
      const token = sessionStorage.getItem("token")
      const options = {
        headers: { Authorization: `Bearer ${token}` },
      }
      http
        .get("http://localhost:3000/v1/product?limit=1&page=1", options)
        .then(({ error }) => {
          if (error) {
            return history.push("/login")
          }
          setIsPending(false)
        })
    }, 5000)
  })
  return (
    <>
      {isPending && <Loading />}
      {!isPending && <div>Dashboard Home</div>}
    </>
  )
}
export default Home
