import * as React from "react"
import { ReactElement } from "react"
import Loading from "../../components/Loading"
import SideBar from "../../components/SideBar"
import UpperBar from "../../components/UpperBar"
import useCheckUser from "../../util/hook/useCheck"

export const DashboardLayout = ({ children }): ReactElement => {
  const { isPending } = useCheckUser()
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
