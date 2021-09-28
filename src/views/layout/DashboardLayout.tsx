import * as React from "react"
import { ReactElement, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import Loading from "../../components/Loading"
import SideBar from "../../components/SideBar"
import UpperBar from "../../components/UpperBar"
import { http } from "../../util/http"
import { domain } from "../../util/environnement"

export const DashboardLayout = ({ children }): ReactElement => {
  const [isPending, setIsPending] = useState(true)
  const [toggle, setToggle] = useState(true)
  const history = useHistory()
  useEffect(() => {
    const controller = new AbortController()
    const token = sessionStorage.getItem("token")
    const options = {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    }
    http
      .get(`${domain}/v1/product?limit=1&page=1`, options)
      .then(({ error }) => {
        if (error) return history.push("/login")
        setIsPending(false)
      })
    return () => controller.abort()
  }, [toggle])
  return (
    <>
      <SideBar />
      <div className="container">
        <UpperBar />
        <div className="content">
          {isPending && <Loading />}
          {!isPending && children}
        </div>
      </div>
    </>
  )
}
